import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// v442 (12/11/2026): lee con IA (visión) la FOTO de la pantalla Magelis de la PBB (alarmas y eventos) para el SOS.
// El OCR del móvil (Tesseract) no lee una pantalla fotografiada en ángulo, con reflejos y poca luz.
// Claves: GEMINI_API_KEY (gratuita) o ANTHROPIC_API_KEY, en secretos o Vault (como «leer-hoja»).
// Devuelve {filas:[{tabla,cod,texto,hora,fecha,estado}], otros, lector}. Se lanzan a la vez varios Flash; gana el primero.
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Max-Age": "86400", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version, x-region, prefer" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const PROMPT = `Es una FOTO hecha con el móvil a la pantalla táctil Magelis (HMI Schneider) de una pasarela de embarque (PBB) TKE del aeropuerto de Madrid Barajas.
Puede estar inclinada, con reflejos, poca luz o borrosa. La pantalla suele tener una tabla «ALARMAS» y otra «EVENTOS» (o solo una, o una pantalla de estado).
Cada fila de tabla tiene: número de alarma/evento (2-3 cifras), texto, hora (HH:MM:SS), fecha (DD/MM/AAAA) y estado («Activado» o «Desactivado»).

TAREA
1. Lee TODAS las filas visibles de cada tabla, de arriba abajo, en el mismo orden. Transcribe el texto tal cual en español, corrigiendo solo letras mal vistas
   por el reflejo (p. ej. «autorizacion», «despliegue», «capota», «Puerta de servicio abierta», «Maquina ON remoto»). No inventes filas.
2. tabla = "alarma" si la fila está bajo el rótulo ALARMAS, "evento" si está bajo EVENTOS, "otro" si no hay rótulo.
3. estado = "Activado", "Desactivado" o "" si no se ve.
4. En "otros" pon cualquier otro texto de aviso visible fuera de las tablas (banner, ventana emergente, p. ej. «LÍNEA DE SEGURIDAD ACTIVADA»); "" si no hay.
5. Repasa la foto otra vez comparando con tu transcripción antes de responder.
Responde SOLO con JSON: {"filas":[{"tabla":"alarma|evento|otro","cod":"141","texto":"Esperando autorizacion remota","hora":"16:42:56","fecha":"11/11/2026","estado":"Desactivado"}],"otros":""}`;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    filas: { type: "ARRAY", items: { type: "OBJECT", properties: {
      tabla: { type: "STRING", enum: ["alarma", "evento", "otro"] }, cod: { type: "STRING" }, texto: { type: "STRING" },
      hora: { type: "STRING" }, fecha: { type: "STRING" }, estado: { type: "STRING" },
    }, required: ["tabla", "cod", "texto", "hora", "fecha", "estado"], propertyOrdering: ["tabla", "cod", "texto", "hora", "fecha", "estado"] } },
    otros: { type: "STRING" },
  },
  required: ["filas", "otros"], propertyOrdering: ["filas", "otros"],
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
  } catch (e) { console.log("leer-magelis: sin lista de modelos", String(e)); }
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
    const cfg: Record<string, unknown> = { temperature: 0, responseMimeType: "application/json", maxOutputTokens: 4000 };
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
    if (r.ok && /"filas"/.test(txt)) { console.log(`leer-magelis: ${model} en ${Math.round((Date.now() - ini) / 1000)} s`); return txt; }
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
    body: JSON.stringify({ model: Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-5-5", max_tokens: 3000, messages: [{ role: "user", content: [
      { type: "image", source: { type: "base64", media_type: tipo || "image/jpeg", data: img } }, { type: "text", text: PROMPT }] }] }) });
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
    catch (e) { console.log("leer-magelis: error", String((e as Error).message || e)); return json({ error: "api", mensaje: String((e as Error).message || e) }, 502); }
    const m = t.match(/\{[\s\S]*\}/); if (!m) return json({ error: "formato" }, 502);
    let o; try { o = JSON.parse(m[0]); } catch { return json({ error: "formato" }, 502); }
    return json({ filas: Array.isArray(o.filas) ? o.filas : [], otros: o.otros || "", lector });
  } catch (e) { return json({ error: "excepcion", mensaje: String(e) }, 500); }
});
