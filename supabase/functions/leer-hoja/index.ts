import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Lee con IA (visión) la foto de la hoja TKE de registro de OT escrita a mano y devuelve JSON.
// Claves: ANTHROPIC_API_KEY o GEMINI_API_KEY (secretos o Vault). Llamada desde la PWA (usuario con sesión).
//
// v291: las filas con casillas vacías se devuelven igual; prioridad a horas y observaciones.
// v290: también lee la hoja «ORDENES DE TRABAJO AVISOS DE 400 HERTZIOS» (siempre tipo HZ).
// v289 (03/11/2026) · rehecho tras los fallos de hoy (logs):
//  · gemini-flash-latest tardaba más de 100 s con razonamiento «medium» o daba 503 (saturado) y la lectura se cortaba;
//    solo acababa leyendo gemini-flash-lite, que lee peor la letra a mano.
//  · Ahora se lanzan A LA VEZ los 3 Flash más nuevos de la clave (razonamiento «low», imagen en alta resolución)
//    y, de reserva, un Flash-Lite. Gana el primer Flash que responda bien; el Lite solo se usa si ningún Flash responde a tiempo.
//  · Cada modelo reintenta los 503 mientras quede tiempo y la función responde siempre antes del corte de Supabase.
//  · Respuesta con esquema JSON fijo (sin JSON incompleto) y prompt con el formato real de la hoja (GUIA = SVGA, SAI, etc.).
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Max-Age": "86400", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version, x-region, prefer, accept, accept-language, content-language" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

export const PROMPT = (pos: string[], tec: string[]) => `Eres el lector de la hoja de registro de OT de TKE (pasarelas PBB del aeropuerto de Madrid Barajas). Es una FOTO de una hoja impresa rellenada A MANO; puede estar girada, inclinada o con sombras.

ESTRUCTURA DE LA HOJA
· Cabecera arriba a la izquierda: hasta 3 filas FECHA | TURNO | INTEGRANTES (NOCHE, MAÑANA, TARDE). Los integrantes son los técnicos del turno, separados por "/", "y" o comas. La fecha suele ir solo en la primera fila (formato dd/mm/aa o dd-mm-aa).
· Tabla con 7 columnas impresas, de izquierda a derecha:
  1 PAS = posición de la pasarela: 3 cifras (p. ej. 521, 579, 534) o dos posiciones (504/508) o T+número.
  2 TIPO = PAS, AAA, AAP, AAC, AAR, HZ, SVGA, Sigma. En la hoja también aparece "GUIA"/"GUIADO" (= SVGA) y "SAI" (alimentación SAI de la pasarela = PAS).
  3 NUMERO DE OT = 6 cifras, casi siempre empiezan por 59, 60 o 61 (p. ej. 601298, 602037).
  4 H. INICIO  5 H. LLEGADA  6 H. FINAL = horas (6:46, 11:28, 13:02…). Normalmente INICIO ≤ LLEGADA ≤ FINAL y van creciendo a lo largo de la hoja.
  7 ACTUACION, INCIDENCIA U OBSERVACIONES = texto libre; puede seguir en la línea de abajo o salirse por el margen derecho: únelo a la OT de su fila.
· Notas sueltas fuera de la tabla (márgenes, encima de la cabecera) NO son OT.

HAY DOS MODELOS DE HOJA. Mira el título impreso y pon "hoja":
· "PAS" = hoja de registro de OT con columnas PAS | TIPO | NUMERO DE OT | H. INICIO | H. LLEGADA | H. FINAL | ACTUACION (la descrita arriba).
· "HZ" = hoja «ORDENES DE TRABAJO AVISOS DE 400 HERTZIOS» (convertidores de 400 Hz). Es SIEMPRE de tipo HZ: pon "tipo":"HZ" en TODAS sus OT, nunca PAS.
  Cabecera: MAÑANA / TARDE / NOCHE con su fecha al lado (p. ej. 23-10-26) y NOMBRE: técnicos de cada turno (en el mismo orden MAÑANA, TARDE, NOCHE).
  Cada OT ocupa DOS filas impresas: una fila POSICION | S. SERVICIO | FECHA | H. AVISO | H. INICIO | H. FIN | MODELO | MATRICULA | ALARMA | MANGUERAS | CONSUMO | PORTATIL | HORA PORT., y debajo la fila OBSERVACIONES (texto libre que puede ocupar toda la anchura).
  Correspondencia: pos = POSICION; orden = S. SERVICIO (6 cifras); fecha = FECHA de esa fila (dd/mm, año de la cabecera) en AAAA-MM-DD; hIni = H. AVISO; hLle = H. INICIO; hCie = H. FIN;
  desc = OBSERVACIONES de esa OT y, detrás, los datos rellenos de la fila con su nombre: "Modelo A330 · Matrícula EC-MNL · Alarma … · Mangueras … · Consumo … · Portátil … · Hora port. …" (omite los vacíos o con guion).
  Si una observación lleva una llamada como (X) o (*) y abajo de la hoja hay una nota con la misma llamada, añade el texto de esa nota al final de la desc de esa OT.

DATOS DE REFERENCIA
· Posiciones dadas de alta (para desambiguar cifras dudosas): ${pos.join(", ") || "—"}.
· Técnicos dados de alta: ${[...new Set(tec.map((t) => String(t).trim().toUpperCase()))].join(", ") || "—"}. Los INTEGRANTES deben ser nombres de esta lista: compara letra a letra y por longitud (ALEX 4 letras, ALBERTO 7) y elige el que mejor encaje.
· Hoy es ${new Date().toISOString().slice(0, 10)}. La fecha de la hoja es reciente (este año o el anterior) y nunca futura. Lee bien día y mes (8≠6, 1≠7).

CÓMO LEER
1. Orienta la hoja por las cabeceras impresas.
2. Recorre la tabla fila a fila de arriba abajo: para cada fila escrita, lee las 7 celdas de esa MISMA fila siguiendo la línea impresa (no mezcles con la fila de arriba o de abajo). Cuenta las filas escritas y devuelve exactamente ese número de OT, en el mismo orden.
3. Transcribe carácter a carácter. En PAS y NUMERO DE OT solo hay cifras: un trazo que parece J o S es 5, l o I es 1, O es 0, B es 8, Z es 2, g es 9.
4. Si una cifra está tachada y reescrita, usa la reescrita. Celda vacía = "". Horas en HH:MM (8:43 → 08:43).
5. Actuación: transcribe lo escrito, en español, con mayúscula inicial, sin inventar ni resumir; mantén las abreviaturas (CBTH, SAI, MCB, FC…).
6. Si dudas de una cifra o palabra, pon tu mejor lectura y explícalo en "dudas" (p. ej. "orden 601298 o 601293").
7. Si en una fila faltan casillas (posición, tipo, nº de OT, modelo, matrícula…), no pasa nada: devuélvela igual con esas casillas en "" y no lo comentes en "dudas". Lo que IMPORTA es leer bien las HORAS y las OBSERVACIONES / ACTUACIÓN: dedícales la máxima atención.
8. Antes de responder, repasa la foto otra vez fila a fila comparando con tu transcripción y corrige los fallos.

Responde SOLO con JSON ("fecha" de cada OT solo si la hoja la trae por fila; si no, ""):
{"hoja":"PAS|HZ","fecha":"AAAA-MM-DD","turnos":[{"turno":"Noche|Mañana|Tarde","integrantes":"NOMBRE, NOMBRE"}],"ots":[{"pos":"","tipo":"","orden":"","fecha":"","hIni":"","hLle":"","hCie":"","desc":"","dudas":""}]}`;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    hoja: { type: "STRING", enum: ["PAS", "HZ"] },
    fecha: { type: "STRING" },
    turnos: { type: "ARRAY", items: { type: "OBJECT", properties: { turno: { type: "STRING" }, integrantes: { type: "STRING" } }, required: ["turno", "integrantes"] } },
    ots: { type: "ARRAY", items: { type: "OBJECT", properties: {
      pos: { type: "STRING" }, tipo: { type: "STRING" }, orden: { type: "STRING" }, fecha: { type: "STRING" }, hIni: { type: "STRING" }, hLle: { type: "STRING" },
      hCie: { type: "STRING" }, desc: { type: "STRING" }, dudas: { type: "STRING" },
    }, required: ["pos", "tipo", "orden", "fecha", "hIni", "hLle", "hCie", "desc", "dudas"], propertyOrdering: ["pos", "tipo", "orden", "fecha", "hIni", "hLle", "hCie", "desc", "dudas"] } },
  },
  required: ["hoja", "fecha", "turnos", "ots"],
  propertyOrdering: ["hoja", "fecha", "turnos", "ots"],
};

async function conClaude(key: string, img: string, tipo: string, prompt: string) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-5-5",
      max_tokens: 6000,
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

const T0 = () => Date.now();
const LIMITE = 128_000; // Supabase corta a 150 s; la PWA espera 150 s
const espera = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
function verNum(n: string) { const m = /gemini-(\d+)(?:\.(\d+))?/.exec(n); return m ? +m[1] * 100 + (+(m[2] || 0)) : 0; }

async function modelosGemini(key: string): Promise<{ flash: string[]; lite: string[] }> {
  const env = Deno.env.get("GEMINI_MODEL");
  let lista: string[] = [];
  try {
    const ac = new AbortController(); const t = setTimeout(() => ac.abort(), 6000);
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": key }, signal: ac.signal });
    clearTimeout(t);
    const d = await r.json().catch(() => ({}));
    lista = (d.models || []).filter((m: { name: string; supportedGenerationMethods?: string[] }) =>
      (m.supportedGenerationMethods || []).includes("generateContent") && /gemini/.test(m.name) &&
      !/(image|tts|audio|live|embedding|robotics|computer-use|native|gemma|exp-|learnlm)/.test(m.name))
      .map((m: { name: string }) => m.name.replace(/^models\//, ""));
  } catch (e) { console.log("leer-hoja: sin lista de modelos", String(e)); }
  if (!lista.length) lista = ["gemini-3-flash-preview", "gemini-flash-latest", "gemini-flash-lite-latest"];
  // Flash concretos del más nuevo al más viejo; el alias «-latest» va detrás (suele ser el mismo modelo y estar más saturado)
  const ord = (a: string, b: string) => verNum(b) - verNum(a) || (/-latest$/.test(a) ? 1 : 0) - (/-latest$/.test(b) ? 1 : 0) || a.length - b.length;
  const flash = lista.filter((n) => /flash/.test(n) && !/lite/.test(n)).sort(ord);
  const lite = lista.filter((n) => /flash-lite/.test(n)).sort(ord);
  const f = [...new Set([env, ...flash].filter(Boolean) as string[])].slice(0, 3);
  console.log("leer-hoja: flash", f.join(", "), "· reserva", lite.slice(0, 1).join(", "));
  return { flash: f, lite: lite.slice(0, 1) };
}

type Res = { t: string; model: string; lite: boolean };
// Un modelo: reintenta 503/500 mientras quede tiempo; si la configuración avanzada da 400 la quita.
async function unModelo(key: string, model: string, img: string, tipo: string, prompt: string, ini: number, stop: AbortSignal, lite: boolean): Promise<Res> {
  let avanzada = true, ult = "";
  for (let k = 0; k < 6; k++) {
    if (stop.aborted) throw new Error(`${model}: cancelado`);
    const queda = LIMITE - (T0() - ini);
    if (queda < 8_000) throw new Error(ult || `${model}: sin tiempo`);
    const cfg: Record<string, unknown> = { temperature: 0, responseMimeType: "application/json", maxOutputTokens: 12000 };
    if (avanzada) {
      cfg.responseSchema = SCHEMA;
      cfg.mediaResolution = "MEDIA_RESOLUTION_HIGH";
      if (/gemini-3/.test(model)) cfg.thinkingConfig = { thinkingLevel: lite ? "minimal" : "low" };
      else if (/2\.5-flash(?!-lite)/.test(model)) cfg.thinkingConfig = { thinkingBudget: 1024 };
    }
    const ac = new AbortController(); const fin = () => ac.abort(); stop.addEventListener("abort", fin);
    const tm = setTimeout(fin, queda - 4_000);
    let r: Response;
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST", signal: ac.signal,
        headers: { "x-goog-api-key": key, "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ inline_data: { mime_type: tipo || "image/jpeg", data: img } }, { text: prompt }] }], generationConfig: cfg }),
      });
    } catch (_e) { clearTimeout(tm); stop.removeEventListener("abort", fin); throw new Error(stop.aborted ? `${model}: cancelado` : `${model}: tardó demasiado`); }
    clearTimeout(tm); stop.removeEventListener("abort", fin);
    const d = await r.json().catch(() => ({}));
    const txt = (d.candidates?.[0]?.content?.parts || []).filter((p: { thought?: boolean }) => !p.thought).map((p: { text?: string }) => p.text || "").join("");
    if (r.ok && txt && /"ots"/.test(txt)) { console.log(`leer-hoja: leído con ${model} en ${Math.round((T0() - ini) / 1000)} s`); return { t: txt, model, lite }; }
    ult = `${model}: ${d?.error?.message?.split("\n")[0] || (r.ok ? "respuesta vacía (" + (d.candidates?.[0]?.finishReason || "?") + ")" : r.statusText)}`;
    console.log("leer-hoja: intento fallido", r.status, ult);
    if (r.status === 400 && avanzada) { avanzada = false; continue; }
    if ([500, 503, 504].includes(r.status) || (r.ok && !txt)) { await espera(2500 + k * 1500); continue; }
    throw new Error(ult); // 404 retirado, 429 sin cupo, 403…
  }
  throw new Error(ult || `${model}: sin respuesta`);
}

async function conGemini(key: string, img: string, tipo: string, prompt: string, ini: number): Promise<Res> {
  const { flash, lite } = await modelosGemini(key);
  const stop = new AbortController();
  const errores: string[] = [];
  let reserva: Res | null = null;
  return await new Promise<Res>((ok, no) => {
    let vivos = 0, hecho = false;
    const acaba = (r: Res | null, e?: string) => {
      if (hecho) return;
      if (r && !r.lite) { hecho = true; stop.abort(); ok(r); return; }
      if (r && r.lite) reserva = r;
      if (e) errores.push(e);
      if (--vivos > 0) return;
      hecho = true;
      if (reserva) ok(reserva); else no(new Error("no se ha podido leer la hoja (" + (errores.filter((x) => !/cancelado/.test(x)).join(" · ") || "sin respuesta") + ")"));
    };
    const lanza = (m: string, esLite: boolean, retraso: number) => {
      vivos++;
      espera(retraso).then(() => unModelo(key, m, img, tipo, prompt, ini, stop.signal, esLite))
        .then((r) => acaba(r), (e) => acaba(null, String((e as Error).message || e)));
    };
    flash.forEach((m, i) => lanza(m, false, i * 400));
    lite.forEach((m) => lanza(m, true, 600));
    // si ya hay lectura de reserva y los Flash no acaban antes del límite, se devuelve la de reserva
    setTimeout(() => { if (!hecho && reserva) { hecho = true; stop.abort(); ok(reserva); } }, LIMITE - 3_000);
    if (!vivos) no(new Error("no hay modelos Gemini disponibles para la clave"));
  });
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
  const ini = T0();
  const ka = Deno.env.get("ANTHROPIC_API_KEY") || await deVault("ANTHROPIC_API_KEY"), kg = Deno.env.get("GEMINI_API_KEY") || await deVault("GEMINI_API_KEY");
  if (!ka && !kg) return json({ error: "sin_clave", mensaje: "Falta una clave de lectura (GEMINI_API_KEY gratuita o ANTHROPIC_API_KEY) en Supabase" }, 503);
  try {
    const { img, tipo, pos = [], tec = [] } = await req.json();
    if (!img) return json({ error: "sin_imagen" }, 400);
    console.log(`leer-hoja: imagen ${Math.round(img.length / 1024)} KB · lector ${ka ? "Claude" : "Gemini"}`);
    const prompt = PROMPT(pos, tec);
    let t = "", modelo = "", lite = false;
    try { if (ka) t = await conClaude(ka, img, tipo, prompt); else { const g = await conGemini(kg!, img, tipo, prompt, ini); t = g.t; modelo = g.model; lite = g.lite; } }
    catch (e) { console.log("leer-hoja: error del lector", String((e as Error).message || e)); return json({ error: "api", mensaje: String((e as Error).message || e) }, 502); }
    console.log(`leer-hoja: respuesta ${t.length} caracteres · ${Math.round((T0() - ini) / 1000)} s`);
    const m = t.match(/\{[\s\S]*\}/);
    if (!m) return json({ error: "formato", mensaje: "Respuesta sin JSON", texto: t }, 502);
    let o; try { o = JSON.parse(m[0]); } catch { return json({ error: "formato", mensaje: "El lector devolvió un JSON incompleto; vuelve a cargar la hoja" }, 502); }
    // v290: la hoja de avisos de 400 Hz es SIEMPRE de tipo HZ
    if (o && o.hoja === "HZ" && Array.isArray(o.ots)) { o.hoja = "HZ"; o.ots.forEach((x: { tipo?: string }) => { x.tipo = "HZ"; }); }
    return json({ ...o, lector: ka ? "Claude" : "Gemini " + modelo, reserva: lite });
  } catch (e) {
    return json({ error: "excepcion", mensaje: String(e) }, 500);
  }
});
