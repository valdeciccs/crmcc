-- Tabela de contatos do CRM.
-- Rodar no painel do Supabase: SQL Editor > New query > colar > Run.

create table contatos (
  id          bigint generated always as identity primary key,
  nome        text not null,
  email       text,
  telefone    text,
  etapa       text not null default 'novo'
              check (etapa in ('novo', 'em contato', 'proposta', 'cliente')),
  anotacoes   text,
  criado_em   timestamptz not null default now()
);

-- Fecha a tabela para acesso público pela internet.
-- Nosso servidor usa a chave secreta e continua enxergando tudo.
alter table contatos enable row level security;

-- Contatos de exemplo
insert into contatos (nome, email, telefone, etapa, anotacoes) values
  ('Ana Ribeiro',   'ana.ribeiro@exemplo.com.br',    '(11) 98877-1020', 'novo',       'Veio pelo formulário do site. Ainda não conversamos.'),
  ('Bruno Tavares', 'bruno@tavaresconsultoria.com.br','(21) 99145-3388', 'em contato', 'Primeira ligação feita. Quer entender o preço por usuário.'),
  ('Carla Menezes', 'carla.menezes@nortelog.com.br', '(31) 98123-7744', 'proposta',   'Proposta enviada. Prometeu retorno na próxima semana.');
