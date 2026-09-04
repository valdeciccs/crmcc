-- Etapas do funil, agora cadastráveis pelo sistema.
-- Rodar no painel do Supabase: SQL Editor > New query > colar > Run.

create table etapas (
  id        bigint generated always as identity primary key,
  nome      text not null unique,
  cor       text not null default 'cinza'
            check (cor in ('cinza', 'laranja', 'roxo', 'verde')),
  ordem     int not null default 0,
  criado_em timestamptz not null default now()
);

-- Fecha a tabela para acesso público pela internet.
-- Nosso servidor usa a chave secreta e continua enxergando tudo.
alter table etapas enable row level security;

-- As quatro etapas de sempre viram as quatro primeiras linhas, nas mesmas cores.
insert into etapas (nome, cor, ordem) values
  ('novo', 'cinza', 1),
  ('em contato', 'laranja', 2),
  ('proposta', 'roxo', 3),
  ('cliente', 'verde', 4);

-- contatos.etapa continua guardando o NOME da etapa, mas a lista de nomes
-- aceitos deixa de estar travada aqui: quem manda agora é a tabela etapas.
alter table contatos drop constraint if exists contatos_etapa_check;
