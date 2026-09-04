-- Usuários do sistema, com papel e situação.
-- Rodar no painel do Supabase: SQL Editor > New query > colar > Run.

create table usuarios (
  id          bigint generated always as identity primary key,
  usuario     text not null unique,
  senha_hash  text not null,
  papel       text not null default 'comum'
              check (papel in ('admin', 'comum')),
  situacao    text not null default 'pendente'
              check (situacao in ('pendente', 'aprovado', 'recusado')),
  criado_em   timestamptz not null default now()
);

-- Fecha a tabela para acesso público, igual às outras
alter table usuarios enable row level security;
