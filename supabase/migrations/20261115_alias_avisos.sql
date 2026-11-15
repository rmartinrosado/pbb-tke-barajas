-- v480: alias aprendidos de los avisos de CGA (el admin asigna un aviso no reconocido a su elemento / caja de la guía)
create table if not exists public.alias_avisos(
 id uuid primary key default gen_random_uuid(),
 patron text not null,
 sustituto text not null,
 tipo text,
 creado_por uuid default auth.uid(),
 creado timestamptz default now());
alter table public.alias_avisos enable row level security;
create policy "alias leer" on public.alias_avisos for select to authenticated using (true);
create policy "alias crear" on public.alias_avisos for insert to authenticated with check (mi_rol() = 'admin');
create policy "alias editar" on public.alias_avisos for update to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
create policy "alias borrar" on public.alias_avisos for delete to authenticated using (mi_rol() = 'admin');
