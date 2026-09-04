-- Histórico de anotações de cada contato.
-- Rodar no painel do Supabase: SQL Editor > New query > colar > Run.

create table anotacoes (
  id          bigint generated always as identity primary key,
  contato_id  bigint not null references contatos(id) on delete cascade,
  texto       text not null,
  criado_em   timestamptz not null default now()
);

-- Deixa rápido buscar as anotações de um contato
create index anotacoes_contato_id_idx on anotacoes (contato_id);

-- Fecha a tabela para acesso público, igual à de contatos
alter table anotacoes enable row level security;

-- Traz para o histórico o texto que estava no campo antigo dos contatos,
-- para nenhuma anotação existente se perder.
insert into anotacoes (contato_id, texto, criado_em)
select id, anotacoes, criado_em
from contatos
where anotacoes is not null and trim(anotacoes) <> '';
