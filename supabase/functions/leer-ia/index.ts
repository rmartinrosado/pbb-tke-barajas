import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// v469 (15/11/2026): lector IA GENÉRICO de fotos para la PWA (LED del PLC, placas de componentes…).
// v521: {motor:"gemini"} → solo Gemini (gratis) · {motor:"claude"} → solo Claude (con coste, aceptado en la PWA) · sin motor: como antes.
// v967: recálculo completo de la guía (cotejo de planos): Claude hasta 140 s y Gemini con 140 s en total entre modelos (la PWA espera 155 s).
// v558: salida ampliada (Claude 12000 tokens, Gemini 12000), prompt hasta 60000 caracteres y 90 s: la ficha con elementos y alarmas se cortaba (JSON incompleto).
// Recibe {img, tipo, prompt}. v480: img opcional (solo texto, p. ej. el cierre dictado). Claude (ANTHROPIC_API_KEY) preferente; Gemini (GEMINI_API_KEY) de reserva. Devuelve {txt, lector}.
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Max-Age": "86400", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version, x-region, prefer" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

async function deVault(n: string): Promise<string> {
  try {
    const u = Deno.env.get("SUPABASE_URL"), k = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); if (!u || !k) return "";
    const r = await fetch(`${u}/rest/v1/rpc/clave_lector`, { method: "POST", headers: { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json" }, body: JSON.stringify({ n }) });
    if (!r.ok) return ""; const v = await r.json(); return typeof v === "string" ? v : "";
  } catch { return ""; }
}

async function conClaude(key: string, img: string, tipo: string, prompt: string): Promise<string> {
  const ac = new AbortController(); const tm = setTimeout(() => ac.abort(), 140_000);
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", signal: ac.signal, headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-5-5", max_tokens: 12000, messages: [{ role: "user", content: [
      ...(img ? [{ type: "image", source: { type: "base64", media_type: tipo || "image/jpeg", data: img } }] : []), { type: "text", text: prompt }] }] }) });
  clearTimeout(tm); const d = await r.json(); if (!r.ok) throw new Error(d?.error?.message || r.statusText);
  return (d.content || []).map((c: { text?: string }) => c.text || "").join("");
}

async function conGemini(key: string, img: string, tipo: string, prompt: string): Promise<{ t: string; m: string }> {
  const ms = [Deno.env.get("GEMINI_MODEL"), "gemini-flash-latest", "gemini-2.5-flash", "gemini-flash-lite-latest"].filter(Boolean) as string[];
  let err = ""; const fin = Date.now() + 140_000;
  for (const m of ms) {
    const queda = fin - Date.now(); if (queda < 15_000) break;
    try {
      const ac = new AbortController(); const tm = setTimeout(() => ac.abort(), Math.min(100_000, queda));
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, { method: "POST", signal: ac.signal, headers: { "x-goog-api-key": key, "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [...(img ? [{ inline_data: { mime_type: tipo || "image/jpeg", data: img } }] : []), { text: prompt }] }], generationConfig: { temperature: 0, responseMimeType: "application/json", maxOutputTokens: 12000 } }) });
      clearTimeout(tm); const d = await r.json().catch(() => ({}));
      const t = (d.candidates?.[0]?.content?.parts || []).filter((p: { thought?: boolean }) => !p.thought).map((p: { text?: string }) => p.text || "").join("");
      if (r.ok && t) return { t, m };
      err = `${m}: ${d?.error?.message?.split("\n")[0] || r.statusText}`;
    } catch (e) { err = `${m}: ${String((e as Error).message || e)}`; }
  }
  throw new Error(err || "Gemini sin respuesta");
}

// v760: clave IA PROPIA del usuario (Vault «ia_<proveedor>_<uid>», se guarda desde la PWA en «Mi clave IA»).
// Si el usuario tiene la suya, el consumo va a SU cuenta; si no, se usa la clave central.
function uidDe(req: Request): string {
  try {
    const t = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").split(".")[1] || "";
    const b = t.replace(/-/g, "+").replace(/_/g, "/"), p = JSON.parse(atob(b + "===".slice((b.length + 3) % 4)));
    return p.role === "authenticated" && typeof p.sub === "string" ? p.sub : "";
  } catch { return ""; }
}
async function propia(req: Request, p: string): Promise<string> {
  const id = uidDe(req); if (!id) return "";
  try {
    const u = Deno.env.get("SUPABASE_URL"), k = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); if (!u || !k) return "";
    const r = await fetch(`${u}/rest/v1/rpc/ia_clave_usuario`, { method: "POST", headers: { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json" }, body: JSON.stringify({ u: id, p }) });
    if (!r.ok) return "";
    const v = await r.json(); return typeof v === "string" ? v : "";
  } catch { return ""; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") { const h = req.headers.get("access-control-request-headers"); return new Response("ok", { headers: h ? { ...cors, "Access-Control-Allow-Headers": h } : cors }); }
  const ka = (await propia(req, "anthropic")) || Deno.env.get("ANTHROPIC_API_KEY") || await deVault("ANTHROPIC_API_KEY"), kg = (await propia(req, "gemini")) || Deno.env.get("GEMINI_API_KEY") || await deVault("GEMINI_API_KEY");
  if (!ka && !kg) return json({ error: "sin_clave" }, 503);
  try {
    const { img, tipo, prompt, motor } = await req.json(); if (!prompt) return json({ error: "faltan_datos" }, 400);
    let t = "", lector = "", errC = "";
    if (motor === "gemini") { if (!kg) return json({ error: "api", mensaje: "sin clave de Gemini" }, 502);
      try { const g = await conGemini(kg, img, tipo, String(prompt).slice(0, 60000)); return json({ txt: g.t, lector: "Gemini " + g.m }); } catch (e) { return json({ error: "api", mensaje: String((e as Error).message || e) }, 502); } }
    if (motor === "claude") { if (!ka) return json({ error: "api", mensaje: "sin clave de Claude" }, 502);
      try { t = await conClaude(ka, img, tipo, String(prompt).slice(0, 60000)); return json({ txt: t, lector: "Claude" }); } catch (e) { return json({ error: "api", mensaje: "Claude: " + String((e as Error).message || e) }, 502); } }
    if (ka) { try { t = await conClaude(ka, img, tipo, String(prompt).slice(0, 60000)); lector = "Claude"; } catch (e) { errC = String((e as Error).message || e); console.log("leer-ia: Claude falló", errC); } }
    if (!t) { if (!kg) return json({ error: "api", mensaje: errC || "sin clave de Gemini" }, 502);
      try { const g = await conGemini(kg, img, tipo, String(prompt).slice(0, 60000)); t = g.t; lector = "Gemini " + g.m; } catch (e) { return json({ error: "api", mensaje: String((e as Error).message || e) }, 502); } }
    return json({ txt: t, lector });
  } catch (e) { return json({ error: "excepcion", mensaje: String(e) }, 500); }
});
