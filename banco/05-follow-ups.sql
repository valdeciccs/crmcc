-- Follow-ups escritos pela IA, guardados para reler depois.
-- Antes desta tabela a mensagem aparecia na tela e sumia ao fechar.
-- Rodar no painel do Supabase: SQL Editor > New query > colar > Run.

create table follow_ups (
  id          bigint generated always as identity primary key,
  contato_id  bigint not null references contatos(id) on delete cascade,
  texto       text not null,
  criado_em   timestamptz not null default now()
);

-- Deixa rápido buscar os follow-ups de um contato
create index follow_ups_contato_id_idx on follow_ups (contato_id);

-- Fecha a tabela para acesso público, igual às de contatos e anotações
alter table follow_ups enable row level security;
