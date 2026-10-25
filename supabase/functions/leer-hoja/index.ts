import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Lee con Claude (visión) la foto de la hoja TKE de registro de OT escrita a mano y devuelve JSON.
// Necesita el secreto ANTHROPIC_API_KEY en el proyecto Supabase. Llamada desde la PWA (usuario con sesión).
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const PROMPT = (pos: string[], tec: string[]) => `Eres el lector de la hoja de registro de OT de TKE para las pasarelas PBB del aeropuerto de Madrid Barajas. La foto puede estar girada y la letra es manuscrita.
Cabecera: hasta 3 bloques FECHA | TURNO (NOCHE, MAÑANA, TARDE) | INTEGRANTES (técnicos del turno; pueden ir separados por "/", "y" o comas).
Tabla: PAS (posición de la pasarela, 3 dígitos o T+número) | TIPO (PAS, AAA, AAP, AAC, AAR, HZ, SVGA, Sigma) | NUMERO DE OT (6 dígitos, suele empezar por 59 o 60) | H. INICIO | H. LLEGADA | H. FINAL | ACTUACION, INCIDENCIA U OBSERVACIONES.
Posiciones dadas de alta (úsalas para desambiguar dígitos dudosos): ${pos.join(", ")}.
Técnicos dados de alta (úsalos para corregir nombres): ${tec.join(", ") || "—"}.
Reglas: transcribe fielmente; horas en HH:MM (8:31 → 08:31); deja "" si una celda está vacía; ignora filas vacías; si una cifra está tachada y reescrita usa la reescrita; si dudas de una posición o número indícalo en "dudas". Escribe la actuación en español con mayúscula inicial y sin cambiar su sentido (puedes expandir abreviaturas solo si son evidentes, no lo hagas en general).
Responde SOLO con JSON, sin texto alrededor:
{"fecha":"AAAA-MM-DD","turnos":[{"turno":"Noche|Mañana|Tarde","integrantes":"NOMBRE, NOMBRE"}],"ots":[{"pos":"","tipo":"","orden":"","hIni":"","hLle":"","hCie":"","desc":"","dudas":""}]}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "sin_clave", mensaje: "Falta la clave ANTHROPIC_API_KEY en Supabase" }, 503);
  try {
    const { img, tipo, pos = [], tec = [] } = await req.json();
    if (!img) return json({ error: "sin_imagen" }, 400);
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-5-5",
        max_tokens: 4000,
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: tipo || "image/jpeg", data: img } },
          { type: "text", text: PROMPT(pos, tec) },
        ] }],
      }),
    });
    const d = await r.json();
    if (!r.ok) return json({ error: "api", mensaje: d?.error?.message || r.statusText }, 502);
    const t = (d.content || []).map((c: { text?: string }) => c.text || "").join("");
    const m = t.match(/\{[\s\S]*\}/);
    if (!m) return json({ error: "formato", mensaje: "Respuesta sin JSON", texto: t }, 502);
    return json(JSON.parse(m[0]));
  } catch (e) {
    return json({ error: "excepcion", mensaje: String(e) }, 500);
  }
});
