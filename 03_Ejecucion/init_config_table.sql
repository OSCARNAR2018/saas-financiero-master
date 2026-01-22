-- Tabla de configuración para el SaaS
create table configuracion (
  id uuid primary key default gen_random_uuid(),
  modo_automatico boolean default false,
  perfil_riesgo text default 'conservador',
  alertas_activas boolean default true,
  updated_at timestamp with time zone default now()
);

-- Insertar configuración inicial
insert into configuracion (modo_automatico, perfil_riesgo, alertas_activas)
values (false, 'conservador', true);

-- Habilitar acceso (Relying on service_role for n8n, but for frontend you might need RLS)
alter table configuracion enable row level security;
create policy "Permitir lectura para todos" on configuracion for select using (true);
create policy "Permitir actualización para todos" on configuracion for update using (true);
