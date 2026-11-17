import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// v561 (17/11/2026): MIGRACIÓN de las fotos de Componentes de campo de base64 (dentro de la tabla) al almacén «componentes».
// Sin pérdida: los bytes JPEG/PNG del base64 se suben tal cual (misma resolución y calidad). Antes se copió todo a
// componentes_campo_fotos_backup. Protegida con un token de un solo uso guardado en la tabla migra_token.
// Body: {token, lote, desde}. Recorre las fichas desde «desde» y migra hasta «lote» que tengan fotos en base64; devuelve «siguiente».
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });
const U = Deno.env.get("SUPABASE_URL")!, K = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const H = { apikey: K, Authorization: `Bearer ${K}` };

function deB64(d: string): { bytes: Uint8Array; tipo: string; ext: string } | null {
  const m = /^data:(image\/[a-z+]+);base64,(.*)$/s.exec(d || ""); if (!m) return null;
  const bin = atob(m[2]); const b = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
  return { bytes: b, tipo: m[1], ext: m[1] === "image/png" ? "png" : m[1] === "image/webp" ? "webp" : "jpg" };
}
async function sube(ruta: string, x: { bytes: Uint8Array; tipo: string }): Promise<string> {
  const r = await fetch(`${U}/storage/v1/object/componentes/${ruta}`, { method: "POST", headers: { ...H, "Content-Type": x.tipo, "x-upsert": "true", "cache-control": "31536000" }, body: x.bytes });
  if (!r.ok) throw new Error("subida " + ruta + ": " + r.status + " " + (await r.text()).slice(0, 200));
  return `${U}/storage/v1/object/public/componentes/${ruta}`;
}

Deno.serve(async (req) => {
  try {
    const { token, lote, desde } = await req.json();
    const tk = await (await fetch(`${U}/rest/v1/migra_token?select=t`, { headers: H })).json();
    if (!token || !Array.isArray(tk) || !tk.length || tk[0].t !== token) return json({ error: "token" }, 403);
    const ids = await (await fetch(`${U}/rest/v1/componentes_campo?select=id&order=creado.asc`, { headers: H })).json();
    if (!Array.isArray(ids)) return json({ error: "consulta", d: ids }, 500);
    const max = Math.max(1, Math.min(10, +lote || 3)); const filas: { id: string; fotos: Record<string, unknown>[] }[] = [];
    let k = Math.max(0, +desde || 0);
    for (; k < ids.length && filas.length < max; k++) {
      const r = await (await fetch(`${U}/rest/v1/componentes_campo?select=id,fotos&id=eq.${ids[k].id}`, { headers: H })).json();
      if (Array.isArray(r) && r[0] && JSON.stringify(r[0].fotos || []).includes("data:image")) filas.push(r[0]);
    }
    let fotos = 0, bytes = 0;
    for (const f of filas) {
      const nuevas = [];
      for (const [i, ft] of (f.fotos || []).entries()) {
        const n = { ...ft };
        for (const campo of ["src", "o"]) {
          const v = n[campo]; if (typeof v !== "string" || !v.startsWith("data:")) continue;
          const x = deB64(v); if (!x) continue;
          n[campo] = await sube(`${f.id}/${i}-${campo}-${Date.now().toString(36)}.${x.ext}`, x); fotos++; bytes += x.bytes.length;
        }
        nuevas.push(n);
      }
      const r = await fetch(`${U}/rest/v1/componentes_campo?id=eq.${f.id}`, { method: "PATCH", headers: { ...H, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ fotos: nuevas }) });
      if (!r.ok) throw new Error("guardar " + f.id + ": " + r.status + " " + (await r.text()).slice(0, 200));
    }
    return json({ fichas: filas.length, fotos, mb: +(bytes / 1048576).toFixed(2), siguiente: k, total: ids.length, fin: k >= ids.length });
  } catch (e) { return json({ error: String((e as Error).message || e) }, 500); }
});
