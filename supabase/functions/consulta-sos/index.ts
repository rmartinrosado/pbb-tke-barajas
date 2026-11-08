import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// v351 · Consulta IA del SOS (actuación directa) en segundo plano.
// La PWA manda el texto de la consulta (posición, alarma, observaciones) y el CONTEXTO ya preparado en el móvil:
// guía de campo, comprobaciones por sistema, primera actuación, casos parecidos y las páginas de los planos
// (texto extraído del bucket «planos», tabla kb_paginas) que mejor encajan con lo detectado.
// La respuesta se devuelve EN STREAMING como texto plano (Markdown) para que la PWA pinte la barra de progreso real
// y, al terminar, genere el PDF A4. Cabecera «x-motor»: modelo que ha respondido.
// Claves: ANTHROPIC_API_KEY (Claude, preferente) o GEMINI_API_KEY (reserva), como secreto o en el Vault (clave_lector).
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Expose-Headers": "x-motor",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version, x-region, prefer, accept, accept-language, content-language",
};
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const SISTEMA = `Eres el técnico experto de TK Elevator (TKE) en las pasarelas de embarque PBB del Aeropuerto Adolfo Suárez Madrid-Barajas (T4/T4S, sistema APRON DRIVE RCS).
Respondes SIEMPRE en castellano, con instrucciones de campo de nivel profesional, para un técnico que está delante de la pasarela con el polímetro.

Reglas:
- Basa la respuesta en la DOCUMENTACIÓN que se adjunta (guía de campo, comprobaciones por sistema, estado de LEDs del PLC, páginas de los planos eléctricos/hidráulicos y casos anteriores). Cita siempre la referencia: folio, borne, hilo, módulo PLC, entrada/salida y LED.
- Plano de cotejo: ESQUEMA GENERAL rev. J (T87911031210) en todas las posiciones salvo 504/508 (T87911031260) y 507 (T87911031230). En el texto de los planos, cada «=== Pág. N ===» lleva dentro «FOLIO x / y»: cita el FOLIO.
- El texto de los planos viene de una extracción automática del PDF (EPLAN) y puede salir desordenado: deduce las conexiones por las referencias cruzadas (p. ej. «23.36:C +H-H3» = folio 23, columna 36, fila C) y di cuándo algo es una deducción.
- Si algo no se puede confirmar con la documentación, dilo claramente y pide el dato o la medida que falta. No inventes referencias.
- Valores de medida: indica magnitud (VDC, VAC, Ω, mA, bar), puntos exactos de medida y valor esperado. Si el valor es estándar del sector y no viene en los planos, dilo.
- Seguridad: nunca propongas dejar puenteadas setas, finales de carrera de seguridad, bordes, bumpers ni zapata salvo los puentes provisionales que ya recoge la guía, con autorización del Responsable de Turno.
- No generes ni registres órdenes de trabajo (OT).

Formato (Markdown sencillo, se convierte a un PDF A4):
- Título con «# ».
- Apartados con «## »: «Primera actuación en campo», «Diagnóstico paso a paso», «Reparación propuesta», «Comprobación final» y, si procede, «Datos que faltan».
- Pasos numerados «1. » breves. Dentro de cada paso del diagnóstico usa líneas «- Elemento:», «- Medida:», «- Correcto →», «- Incorrecto →».
- Puedes usar tablas «| a | b |» cortas (máx. 4 columnas) y **negrita** para referencias clave. Sin emojis.`;

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

// Lee un stream SSE y llama a onData con cada «data: …» ya parseado
async function sse(body: ReadableStream<Uint8Array>, onData: (d: any) => void) {
  const rd = body.getReader(), dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await rd.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let k;
    while ((k = buf.indexOf("\n")) >= 0) {
      const l = buf.slice(0, k).trim(); buf = buf.slice(k + 1);
      if (!l.startsWith("data:")) continue;
      const p = l.slice(5).trim();
      if (!p || p === "[DONE]") continue;
      try { onData(JSON.parse(p)); } catch { /* línea incompleta */ }
    }
  }
}

async function claude(key: string, usuario: string): Promise<{ r: Response; modelo: string }> {
  const modelo = Deno.env.get("ANTHROPIC_MODEL_SOS") || Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-5-5";
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: modelo, max_tokens: 7000, stream: true, system: SISTEMA, messages: [{ role: "user", content: usuario }] }),
  });
  return { r, modelo };
}

async function gemini(key: string, usuario: string): Promise<{ r: Response; modelo: string }> {
  const lista = [Deno.env.get("GEMINI_MODEL"), "gemini-flash-latest", "gemini-3-flash-preview", "gemini-2.5-flash"].filter(Boolean) as string[];
  let ult: Response | null = null, mod = "";
  for (const m of [...new Set(lista)]) {
    const cfg: Record<string, unknown> = { temperature: 0.2, maxOutputTokens: 8192 };
    if (/gemini-3/.test(m)) cfg.thinkingConfig = { thinkingLevel: "low" };
    else if (/2\.5-flash/.test(m)) cfg.thinkingConfig = { thinkingBudget: 1024 };
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:streamGenerateContent?alt=sse`, {
      method: "POST", headers: { "x-goog-api-key": key, "content-type": "application/json" },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: SISTEMA }] }, contents: [{ role: "user", parts: [{ text: usuario }] }], generationConfig: cfg }),
    });
    if (r.ok) return { r, modelo: m };
    ult = r; mod = m;
    console.log("consulta-sos: gemini", m, r.status);
    if (![400, 404, 500, 503].includes(r.status)) break;
  }
  return { r: ult!, modelo: mod };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    const h = req.headers.get("access-control-request-headers");
    return new Response("ok", { headers: h ? { ...cors, "Access-Control-Allow-Headers": h } : cors });
  }
  let pregunta = "", contexto = "";
  try { const b = await req.json(); pregunta = String(b.pregunta || ""); contexto = String(b.contexto || ""); } catch { /* */ }
  if (!pregunta.trim()) return json({ error: "sin_pregunta" }, 400);
  if (contexto.length > 400_000) contexto = contexto.slice(0, 400_000);
  const usuario = `DOCUMENTACIÓN DEL PROYECTO PBB TKE (seleccionada para esta consulta):\n\n${contexto}\n\n==============================\nCONSULTA DEL TÉCNICO:\n\n${pregunta}`;

  const ka = Deno.env.get("ANTHROPIC_API_KEY") || await deVault("ANTHROPIC_API_KEY");
  const kg = ka ? "" : (Deno.env.get("GEMINI_API_KEY") || await deVault("GEMINI_API_KEY"));
  if (!ka && !kg) return json({ error: "sin_clave", mensaje: "Falta ANTHROPIC_API_KEY (o GEMINI_API_KEY de reserva) en los secretos de Supabase" }, 503);

  const ini = Date.now();
  let up: { r: Response; modelo: string };
  try { up = ka ? await claude(ka, usuario) : await gemini(kg, usuario); }
  catch (e) { return json({ error: "api", mensaje: String((e as Error).message || e) }, 502); }
  if (!up.r.ok || !up.r.body) {
    const d = await up.r.json().catch(() => ({}));
    return json({ error: "api", mensaje: d?.error?.message || up.r.statusText || "sin respuesta del modelo" }, 502);
  }
  console.log(`consulta-sos: ${up.modelo} · contexto ${Math.round(contexto.length / 1024)} KB`);
  const enc = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(c) {
      let n = 0;
      try {
        await sse(up.r.body!, (d) => {
          let t = "";
          if (ka) { if (d.type === "content_block_delta" && d.delta?.type === "text_delta") t = d.delta.text || ""; else if (d.type === "error") t = `\n\n[ERROR DEL MODELO: ${d.error?.message || "desconocido"}]`; }
          else t = (d.candidates?.[0]?.content?.parts || []).filter((p: { thought?: boolean }) => !p.thought).map((p: { text?: string }) => p.text || "").join("");
          if (t) { n += t.length; c.enqueue(enc.encode(t)); }
        });
      } catch (e) { c.enqueue(enc.encode(`\n\n[CORTE DE LA CONSULTA: ${String((e as Error).message || e)}]`)); }
      console.log(`consulta-sos: fin ${n} caracteres · ${Math.round((Date.now() - ini) / 1000)} s`);
      c.close();
    },
  });
  return new Response(stream, { headers: { ...cors, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "x-motor": ka ? `Claude - ${up.modelo}` : `Gemini (reserva) - ${up.modelo}` } });
});
