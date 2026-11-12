import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// v451 (12/11/2026): lee con IA (visión) el CALENDARIO SEMANAL DE INCIDENCIAS de AENA (programa de mantenimiento preventivo)
// para el importador de Mantenimiento. El OCR del móvil (Tesseract) mezclaba el cuadro de la obra de la izquierda con el
// calendario y corría los días. Claves: GEMINI_API_KEY (gratuita) o ANTHROPIC_API_KEY, en secretos o Vault (como «leer-hoja»).
// Recibe {img, tipo} (imagen o PDF). Devuelve {dias:[{fecha,items:[{pos,tipo,ini,fin,ref,notas}]}], evento, lector}.
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Max-Age": "86400", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version, x-region, prefer" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const PROMPT = `Es una hoja de AENA del aeropuerto de Madrid Barajas: «CALENDARIO SEMANAL DE INCIDENCIAS» con el programa de mantenimientos
preventivos de pasarelas (PBB). Puede ser foto, captura o PDF. A la izquierda puede haber un cuadro con datos de la obra (título,
expediente, director, teléfonos, fechas de inicio y fin, planos): IGNÓRALO por completo. Lee SOLO el calendario semanal (columna derecha).

El calendario tiene una fila por día (LUNES … DOMINGO) con su fecha DD/MM/AAAA en la columna izquierda. Dentro de cada día hay apartados
«Mantenimientos MENSUALES», «Mantenimientos SEMESTRALES» (a veces «ANUALES» o «CORRECTIVOS») y líneas del tipo:
«Inop SIN AVO posición T5B / T5 (B28) 15:30 LT a 18:30 LT» o «Inop SIN AVO posición 550/549 (S39) 22:00 LT a 01:00 LT».

TAREA
1. Para CADA día del calendario (usa la fecha escrita junto al nombre del día, formato AAAA-MM-DD) lista TODAS sus líneas, en orden.
2. pos = la posición tal cual, sin espacios: «T5B/T5», «356», «550/549», «T6B/T6/T6W», «T20/T20W». Distingue bien 5/S, 6/G/O, 8/B, 1/I/L, 0/O.
   Las posiciones son números de 3 cifras (3xx, 5xx…) o T + número (T1…T30) con letra opcional (A, B, W).
3. tipo = "M" si está bajo MENSUALES, "S" bajo SEMESTRALES, "A" bajo ANUALES, "C" bajo CORRECTIVOS.
4. ref = lo que va entre paréntesis (B28, J44, S39, C45, H28, D58…): letra + número. ini y fin = horas HH:MM («LT» no se copia).
5. notas = texto extra de la línea (p. ej. «SIN MOVER PASARELA»); "" si no hay.
6. evento = número de evento SGC de las observaciones (p. ej. «SGC 127318» → "127318"); "" si no hay.
7. No inventes líneas ni días. Repasa la hoja otra vez comparando cada día con tu transcripción antes de responder.
Responde SOLO con JSON: {"dias":[{"fecha":"2026-11-16","items":[{"pos":"T5B/T5","tipo":"M","ini":"15:30","fin":"18:30","ref":"B28","notas":""}]}],"evento":""}`;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    dias: { type: "ARRAY", items: { type: "OBJECT", properties: {
      fecha: { type: "STRING" },
      items: { type: "ARRAY", items: { type: "OBJECT", properties: {
        pos: { type: "STRING" }, tipo: { type: "STRING", enum: ["M", "S", "A", "C"] }, ini: { type: "STRING" }, fin: { type: "STRING" }, ref: { type: "STRING" }, notas: { type: "STRING" },
      }, required: ["pos", "tipo", "ini", "fin", "ref", "notas"], propertyOrdering: ["pos", "tipo", "ini", "fin", "ref", "notas"] } },
    }, required: ["fecha", "items"], propertyOrdering: ["fecha", "items"] } },
    evento: { type: "STRING" },
  },
  required: ["dias", "evento"], propertyOrdering: ["dias", "evento"],
};
const LIMITE = 55_000;
const espera = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
const verNum = (n: string) => { const m = /gemini-(\d+)(?:\.(\d+))?/.exec(n); return m ? +m[1] * 100 + (+(m[2] || 0)) : 0; };

async function modelos(key: string): Promise<string[]> {
  const env = Deno.env.get("GEMINI_MODEL");
  let lista: string[] = [];
  try {
    const ac = new AbortController(); const t = setTimeout(() => ac.abort(), 5000);
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": key }, signal: ac.signal });
    clearTimeout(t);
    const d = await r.json().catch(() => ({}));
    lista = (d.models || []).filter((m: { name: string; supportedGenerationMethods?: string[] }) =>
      (m.supportedGenerationMethods || []).includes("generateContent") && /gemini/.test(m.name) && /flash/.test(m.name) &&
      !/(image|tts|audio|live|embedding|robotics|computer-use|native|gemma|exp-|learnlm)/.test(m.name)).map((m: { name: string }) => m.name.replace(/^models\//, ""));
  } catch (e) { console.log("leer-mantenimiento: sin lista de modelos", String(e)); }
  if (!lista.length) lista = ["gemini-3-flash-preview", "gemini-flash-latest", "gemini-flash-lite-latest"];
  const ord = (a: string, b: string) => verNum(b) - verNum(a) || (/-latest$/.test(a) ? 1 : 0) - (/-latest$/.test(b) ? 1 : 0) || a.length - b.length;
  const flash = lista.filter((n) => !/lite/.test(n)).sort(ord), lite = lista.filter((n) => /lite/.test(n)).sort(ord);
  return [...new Set([env, ...flash.slice(0, 3), ...lite.slice(0, 1)].filter(Boolean) as string[])];
}

async function unModelo(key: string, model: string, img: string, tipo: string, ini: number, stop: AbortSignal): Promise<string> {
  let avanzada = true, ult = "";
  for (let k = 0; k < 4; k++) {
    if (stop.aborted) throw new Error("cancelado");
    const queda = LIMITE - (Date.now() - ini);
    if (queda < 6_000) throw new Error(ult || `${model}: sin tiempo`);
    const cfg: Record<string, unknown> = { temperature: 0, responseMimeType: "application/json", maxOutputTokens: 8000 };
    if (avanzada) {
      cfg.responseSchema = SCHEMA; cfg.mediaResolution = "MEDIA_RESOLUTION_HIGH";
      if (/gemini-3/.test(model)) cfg.thinkingConfig = { thinkingLevel: /lite/.test(model) ? "minimal" : "low" };
      else if (/2\.5-flash(?!-lite)/.test(model)) cfg.thinkingConfig = { thinkingBudget: 512 };
    }
    const ac = new AbortController(); const fin = () => ac.abort(); stop.addEventListener("abort", fin);
    const tm = setTimeout(fin, queda - 3_000);
    let r: Response;
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST", signal: ac.signal, headers: { "x-goog-api-key": key, "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ inline_data: { mime_type: tipo || "image/jpeg", data: img } }, { text: PROMPT }] }], generationConfig: cfg }),
      });
    } catch (_e) { clearTimeout(tm); stop.removeEventListener("abort", fin); throw new Error(`${model}: tardó demasiado`); }
    clearTimeout(tm); stop.removeEventListener("abort", fin);
    const d = await r.json().catch(() => ({}));
    const txt = (d.candidates?.[0]?.content?.parts || []).filter((p: { thought?: boolean }) => !p.thought).map((p: { text?: string }) => p.text || "").join("");
    if (r.ok && /"dias"/.test(txt)) { console.log(`leer-mantenimiento: ${model} en ${Math.round((Date.now() - ini) / 1000)} s`); return txt; }
    ult = `${model}: ${d?.error?.message?.split("\n")[0] || r.statusText}`;
    if (r.status === 400 && avanzada) { avanzada = false; continue; }
    if ([500, 503, 504].includes(r.status) || (r.ok && !txt)) { await espera(1500 + k * 1000); continue; }
    throw new Error(ult);
  }
  throw new Error(ult || `${model}: sin respuesta`);
}

async function conGemini(key: string, img: string, tipo: string, ini: number): Promise<{ t: string; m: string }> {
  const ms = await modelos(key); const stop = new AbortController(); const err: string[] = [];
  return await new Promise((ok, no) => {
    let vivos = ms.length, hecho = false;
    ms.forEach((m, i) => espera(i * 300).then(() => unModelo(key, m, img, tipo, ini, stop.signal)).then(
      (t) => { if (!hecho) { hecho = true; stop.abort(); ok({ t, m }); } },
      (e) => { err.push(String((e as Error).message || e)); if (--vivos === 0 && !hecho) no(new Error(err.filter((x) => !/cancelado/.test(x)).join(" · ") || "sin respuesta")); }));
  });
}

async function conClaude(key: string, img: string, tipo: string): Promise<string> {
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-5-5", max_tokens: 6000, messages: [{ role: "user", content: [
      (tipo === "application/pdf" ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: img } } : { type: "image", source: { type: "base64", media_type: tipo || "image/jpeg", data: img } }), { type: "text", text: PROMPT }] }] }) });
  const d = await r.json(); if (!r.ok) throw new Error(d?.error?.message || r.statusText);
  return (d.content || []).map((c: { text?: string }) => c.text || "").join("");
}

async function deVault(n: string): Promise<string> {
  try {
    const u = Deno.env.get("SUPABASE_URL"), k = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); if (!u || !k) return "";
    const r = await fetch(`${u}/rest/v1/rpc/clave_lector`, { method: "POST", headers: { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json" }, body: JSON.stringify({ n }) });
    if (!r.ok) return ""; const v = await r.json(); return typeof v === "string" ? v : "";
  } catch { return ""; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") { const h = req.headers.get("access-control-request-headers"); return new Response("ok", { headers: h ? { ...cors, "Access-Control-Allow-Headers": h } : cors }); }
  const ini = Date.now();
  const ka = Deno.env.get("ANTHROPIC_API_KEY") || await deVault("ANTHROPIC_API_KEY"), kg = Deno.env.get("GEMINI_API_KEY") || await deVault("GEMINI_API_KEY");
  if (!ka && !kg) return json({ error: "sin_clave" }, 503);
  try {
    const { img, tipo } = await req.json(); if (!img) return json({ error: "sin_imagen" }, 400);
    let t = "", lector = "";
    try { if (kg) { const g = await conGemini(kg, img, tipo, ini); t = g.t; lector = "Gemini " + g.m; } else { t = await conClaude(ka!, img, tipo); lector = "Claude"; } }
    catch (e) { console.log("leer-mantenimiento: error", String((e as Error).message || e)); return json({ error: "api", mensaje: String((e as Error).message || e) }, 502); }
    const m = t.match(/\{[\s\S]*\}/); if (!m) return json({ error: "formato" }, 502);
    let o; try { o = JSON.parse(m[0]); } catch { return json({ error: "formato" }, 502); }
    return json({ dias: Array.isArray(o.dias) ? o.dias : [], evento: o.evento || "", lector });
  } catch (e) { return json({ error: "excepcion", mensaje: String(e) }, 500); }
});
