-- v760 · Claves de IA propias de cada usuario (Claude/Anthropic y Gemini), cifradas en el Vault.
-- Nombre del secreto: ia_<proveedor>_<uid>. El móvil solo puede guardar/borrar la suya y ver los 4 últimos caracteres;
-- la clave completa solo la leen las Edge Functions (service_role) para que el consumo vaya a la cuenta del técnico.

create or replace function public.ia_clave_guardar(p text, k text)
returns json language plpgsql security definer set search_path = '' as $$
declare u uuid := auth.uid(); nom text; sid uuid; kk text := btrim(coalesce(k, ''));
begin
  if u is null then raise exception 'sin sesión'; end if;
  if p not in ('anthropic', 'gemini') then raise exception 'proveedor no válido'; end if;
  nom := 'ia_' || p || '_' || u::text;
  select id into sid from vault.secrets where name = nom limit 1;
  if kk = '' then
    if sid is not null then delete from vault.secrets where id = sid; end if;
    return json_build_object('ok', true, 'borrada', true);
  end if;
  if p = 'anthropic' and kk !~ '^sk-ant-[A-Za-z0-9_-]{20,}$' then raise exception 'La clave de Claude debe empezar por sk-ant-'; end if;
  if p = 'gemini' and kk !~ '^AIza[A-Za-z0-9_-]{30,}$' then raise exception 'La clave de Gemini debe empezar por AIza'; end if;
  if sid is null then perform vault.create_secret(kk, nom, 'Clave IA propia del usuario');
  else perform vault.update_secret(sid, kk); end if;
  return json_build_object('ok', true, 'fin', right(kk, 4));
end $$;

create or replace function public.ia_clave_estado()
returns json language sql stable security definer set search_path = '' as $$
  select json_build_object(
    'anthropic', (select right(decrypted_secret, 4) from vault.decrypted_secrets where name = 'ia_anthropic_' || auth.uid()::text limit 1),
    'gemini',    (select right(decrypted_secret, 4) from vault.decrypted_secrets where name = 'ia_gemini_'    || auth.uid()::text limit 1))
$$;

-- Solo para las Edge Functions
create or replace function public.ia_clave_usuario(u uuid, p text)
returns text language sql stable security definer set search_path = '' as $$
  select decrypted_secret from vault.decrypted_secrets where name = 'ia_' || p || '_' || u::text and p in ('anthropic', 'gemini') limit 1
$$;

revoke all on function public.ia_clave_guardar(text, text) from public, anon;
revoke all on function public.ia_clave_estado() from public, anon;
revoke all on function public.ia_clave_usuario(uuid, text) from public, anon, authenticated;
grant execute on function public.ia_clave_guardar(text, text) to authenticated;
grant execute on function public.ia_clave_estado() to authenticated;
grant execute on function public.ia_clave_usuario(uuid, text) to service_role;
