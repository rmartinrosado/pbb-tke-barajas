import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Lee con Claude (visión) la foto de la hoja TKE de registro de OT escrita a mano y devuelve JSON.
// Necesita el secreto ANTHROPIC_API_KEY en el proyecto Supabase. Llamada desde la PWA (usuario con sesión).
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Max-Age": "86400", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version, x-region, prefer, accept, accept-language, content-language" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const PROMPT = (pos: string[], tec: string[]) => `Eres el lector de la hoja de registro de OT de TKE para las pasarelas PBB del aeropuerto de Madrid Barajas. La foto puede estar girada y la letra es manuscrita.
Cabecera: hasta 3 bloques FECHA | TURNO (NOCHE, MAÑANA, TARDE) | INTEGRANTES (técnicos del turno; pueden ir separados por "/", "y" o comas).
Tabla: PAS (posición de la pasarela, 3 dígitos o T+número) | TIPO (PAS, AAA, AAP, AAC, AAR, HZ, SVGA, Sigma) | NUMERO DE OT (6 dígitos, suele empezar por 59 o 60) | H. INICIO | H. LLEGADA | H. FINAL | ACTUACION, INCIDENCIA U OBSERVACIONES.
Posiciones dadas de alta (úsalas para desambiguar dígitos dudosos): ${pos.join(", ")}.
Técnicos dados de alta (úsalos para corregir nombres): ${tec.join(", ") || "—"}.
Reglas: transcribe fielmente; horas en HH:MM (8:31 → 08:31); deja "" si una celda está vacía; ignora filas vacías; si una cifra está tachada y reescrita usa la reescrita; si dudas de una posición o número indícalo en "dudas". Escribe la actuación en español con mayúscula inicial y sin cambiar su sentido (puedes expandir abreviaturas solo si son evidentes, no lo hagas en general).
Responde SOLO con JSON, sin texto alrededor:
{"fecha":"AAAA-MM-DD","turnos":[{"turno":"Noche|Mañana|Tarde","integrantes":"NOMBRE, NOMBRE"}],"ots":[{"pos":"","tipo":"","orden":"","hIni":"","hLle":"","hCie":"","desc":"","dudas":""}]}`;

// v246: si no hay ANTHROPIC_API_KEY, usa Google Gemini (GEMINI_API_KEY, capa gratuita de Google AI Studio).
async function conClaude(key: string, img: string, tipo: string, prompt: string) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-5-5",
      max_tokens: 4000,
      messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: tipo || "image/jpeg", data: img } },
        { type: "text", text: prompt },
      ] }],
    }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d?.error?.message || r.statusText);
  return (d.content || []).map((c: { text?: string }) => c.text || "").join("");
}
// v249: Gemini con reintentos y modelos de reserva si el modelo está saturado (503/429/500).
async function conGemini(key: string, img: string, tipo: string, prompt: string) {
  const env = Deno.env.get("GEMINI_MODEL");
  const modelos = [...new Set([env, "gemini-flash-latest", "gemini-2.5-flash", "gemini-flash-lite-latest", "gemini-2.5-flash-lite"].filter(Boolean) as string[])];
  let ult = "";
  for (const model of modelos) {
    for (let k = 0; k < 2; k++) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "x-goog-api-key": key, "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ inline_data: { mime_type: tipo || "image/jpeg", data: img } }, { text: prompt }] }],
          generationConfig: { temperature: 0, responseMimeType: "application/json" },
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok) { console.log(`leer-hoja: leído con ${model}`); return (d.candidates?.[0]?.content?.parts || []).map((p: { text?: string }) => p.text || "").join(""); }
      ult = `${model}: ${d?.error?.message || r.statusText}`;
      console.log("leer-hoja: intento fallido", r.status, ult);
      if (r.status === 404 || r.status === 400) break; // modelo no disponible: pasa al siguiente
      if (![429, 500, 503].includes(r.status)) throw new Error(ult);
      await new Promise((ok) => setTimeout(ok, 1500 * (k + 1)));
    }
  }
  throw new Error("Lector saturado, prueba en unos minutos (" + ult + ")");
}

// v247: las claves también pueden estar cifradas en el Vault de Supabase (función clave_lector, solo service_role).
async function deVault(n: string): Promise<string> {
  try {
    const u = Deno.env.get("SUPABASE_URL"), k = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!u || !k) return "";
    const r = await fetch(`${u}/rest/v1/rpc/clave_lector`, { method: "POST", headers: { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json" }, body: JSON.stringify({ n }) });
    if (!r.ok) return "";
    const v = await r.json();
    return typeof v === "string" ? v : "";
  } catch { return ""; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    const h = req.headers.get("access-control-request-headers");
    return new Response("ok", { headers: h ? { ...cors, "Access-Control-Allow-Headers": h } : cors });
  }
  const ka = Deno.env.get("ANTHROPIC_API_KEY") || await deVault("ANTHROPIC_API_KEY"), kg = Deno.env.get("GEMINI_API_KEY") || await deVault("GEMINI_API_KEY");
  if (!ka && !kg) return json({ error: "sin_clave", mensaje: "Falta una clave de lectura (GEMINI_API_KEY gratuita o ANTHROPIC_API_KEY) en Supabase" }, 503);
  try {
    const { img, tipo, pos = [], tec = [] } = await req.json();
    if (!img) return json({ error: "sin_imagen" }, 400);
    console.log(`leer-hoja: imagen ${Math.round(img.length / 1024)} KB · lector ${ka ? "Claude" : "Gemini"}`);
    const prompt = PROMPT(pos, tec) + "\nLee TODAS las líneas escritas de la tabla, una OT por línea, en el orden de la hoja, sin saltarte ninguna.";
    let t = "";
    try { t = ka ? await conClaude(ka, img, tipo, prompt) : await conGemini(kg!, img, tipo, prompt); }
    catch (e) { console.log("leer-hoja: error del lector", String((e as Error).message || e)); return json({ error: "api", mensaje: String((e as Error).message || e) }, 502); }
    console.log(`leer-hoja: respuesta ${t.length} caracteres`);
    const m = t.match(/\{[\s\S]*\}/);
    if (!m) return json({ error: "formato", mensaje: "Respuesta sin JSON", texto: t }, 502);
    return json({ ...JSON.parse(m[0]), lector: ka ? "Claude" : "Gemini" });
  } catch (e) {
    return json({ error: "excepcion", mensaje: String(e) }, 500);
  }
});
