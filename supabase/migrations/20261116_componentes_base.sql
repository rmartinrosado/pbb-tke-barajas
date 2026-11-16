-- v534: fichas de fábrica editadas desde la PWA
alter table public.componentes_campo add column if not exists base text;
