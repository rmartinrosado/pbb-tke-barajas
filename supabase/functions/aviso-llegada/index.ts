import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import webpush from "npm:web-push@3.6.7";

// Revisa cada minuto (pg_cron «aviso-llegada») las OT abiertas sin hora de llegada y, al quedar
// 1 minuto para el tiempo de llegada, envía una notificación push a todos los móviles suscritos.
// Claves VAPID en la tabla privada public.push_config; suscripciones en public.push_subs;
// avisos ya enviados en public.push_avisos (uno por OT).
const LLEG: Record<string, number> = { PAS: 10, HZ: 15, AAA: 15, AAP: 15, SVGA: 15, Sigma: 15 };
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (o: unknown) => new Response(JSON.stringify(o), { headers: { ...cors, "Content-Type": "application/json" } });

const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
function partes(ms: number) { const p: Record<string, number> = {}; for (const x of fmt.formatToParts(new Date(ms))) if (x.type !== "literal") p[x.type] = +x.value; return p; }
function madridAUtc(y: number, mo: number, d: number, h: number, mi: number) {
  const obj = Date.UTC(y, mo - 1, d, h, mi);
  let g = obj;
  for (let k = 0; k < 2; k++) { const p = partes(g); g = g - (Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - obj); }
  return g;
}
function minutos(i: any) { const t = [i.tipo, ...(i.equipos || [])].map((k: string) => LLEG[k]).filter(Boolean); return t.length ? Math.min(...t) : 15; }
function limite(id: string, i: any): number | null {
  const c = Number(id); if (!isFinite(c) || c < 1e12) return null; // el id de la OT es el instante en que se guardó: la cuenta atrás empieza ahí
  return c + minutos(i) * 60e3;
}

async function config() {
  const { data } = await sb.from("push_config").select("clave,valor");
  const c: Record<string, string> = {}; for (const r of data || []) c[r.clave] = r.valor;
  webpush.setVapidDetails(c.vapid_subject, c.vapid_public, c.vapid_private);
}
async function enviar(subs: any[], payload: unknown) {
  let ok = 0; const errores: string[] = []; const cuerpo = JSON.stringify(payload);
  for (const s of subs) {
    try { await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, cuerpo, { TTL: 600, urgency: "high" }); ok++; }
    catch (e: any) {
      errores.push(`${e?.statusCode ?? "?"} ${String(e?.body || e?.message || e).slice(0, 160)}`);
      if (e && (e.statusCode === 404 || e.statusCode === 410)) await sb.from("push_subs").delete().eq("endpoint", s.endpoint);
    }
  }
  if (errores.length) console.log("push errores", errores);
  return { ok, errores };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  await config();
  let body: any = {}; try { body = await req.json(); } catch (_) { /* sin cuerpo */ }

  // Prueba: solo al móvil que la pide (debe estar ya suscrito)
  if (body.prueba && body.endpoint) {
    const { data } = await sb.from("push_subs").select("*").eq("endpoint", body.endpoint);
    const r = await enviar(data || [], { title: "Prueba de aviso · PBB TKE", body: "Las alarmas de llegada llegarán a este móvil.", tag: "prueba" });
    return json({ enviados: r.ok, errores: r.errores });
  }

  const ahora = Date.now();
  const { data: ots } = await sb.from("incidencias").select("id,datos").eq("estado", "abierta");
  const due: { id: string; i: any; fin: number }[] = [];
  for (const r of ots || []) {
    const i = r.datos || {}; if (i.hLle || !i.hIni) continue;
    const fin = limite(r.id, i); if (fin == null) continue;
    const rest = fin - ahora; if (rest <= 75e3 && rest > -3600e3) due.push({ id: r.id, i, fin });
  }
  if (!due.length) return json({ pendientes: 0 });

  const { data: hechos } = await sb.from("push_avisos").select("inc_id").in("inc_id", due.map((d) => d.id));
  const ya = new Set((hechos || []).map((h: any) => h.inc_id));
  const { data: subs } = await sb.from("push_subs").select("*");
  const res: unknown[] = [];
  for (const d of due) {
    if (ya.has(d.id)) continue;
    const { error } = await sb.from("push_avisos").insert({ inc_id: d.id, destinos: (subs || []).length });
    if (error) continue; // otra ejecución ya lo envió
    const rest = Math.round((d.fin - ahora) / 1000);
    const r = await enviar(subs || [], {
      title: `⏰ OT prioritaria · PBB ${d.i.pos} (${d.i.tipo}) · Orden ${d.i.orden}`,
      body: rest > 0 ? `Queda 1 minuto para el tiempo de llegada (${minutos(d.i)} min). Llamar a CGA.` : `Tiempo de llegada superado (${minutos(d.i)} min). Llamar a CGA.`,
      tag: "lleg" + d.id, id: d.id,
    });
    res.push({ id: d.id, enviados: r.ok, errores: r.errores.length });
  }
  return json({ avisos: res });
});
