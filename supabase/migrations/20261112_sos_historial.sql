-- v446: historial de SOS compartido (lo ven todos los técnicos; crear todos; editar y borrar técnicos y admin)
create table if not exists public.sos_historial (
  id text primary key,
  ts bigint not null,
  datos jsonb not null default '{}'::jsonb,
  autor uuid default auth.uid(),
  updated_at timestamptz not null default now()
);
alter table public.sos_historial enable row level security;
create policy "sos ver" on public.sos_historial for select to authenticated using (true);
create policy "sos crear" on public.sos_historial for insert to authenticated with check (true);
create policy "sos editar" on public.sos_historial for update to authenticated using (mi_rol() = any (array['tecnico','admin'])) with check (mi_rol() = any (array['tecnico','admin']));
create policy "sos borrar" on public.sos_historial for delete to authenticated using (mi_rol() = any (array['tecnico','admin']));
create index if not exists sos_historial_ts on public.sos_historial (ts desc);
