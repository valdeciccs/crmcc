# PRD — CRM de Contatos e Oportunidades

## O que é e pra quem

Um CRM simples para organizar contatos e acompanhar oportunidades de negócio do começo ao fechamento.
É para uso individual (ou de uma equipe muito pequena) de quem vende e hoje controla isso na cabeça, no WhatsApp ou numa planilha.
O objetivo é responder rápido a três perguntas: com quem eu falei, em que pé está cada negócio e quem eu preciso procurar agora.

## Funcionalidades da primeira versão

- [x] **Cadastro e listagem de contatos** — criar e listar contatos com nome, email e telefone.
- [ ] **Editar contato** — mudar nome, email e telefone de um contato já cadastrado. Hoje, depois de salvo, só a etapa muda.
- [ ] **Empresa do contato** — o campo empresa, previsto desde o começo e ainda não construído.
- [x] **Funil com etapas** — cada contato fica em uma etapa do funil, escolhida no cadastro. Dá para mover de etapa direto na lista.
- [x] **Cadastro de etapas** — as etapas do funil são criadas por quem usa: nome, cor (numa paleta fechada de quatro) e ordem. Começa com novo, em contato, proposta e cliente, mas dá para renomear, recolorir, reordenar, criar e apagar.
- [x] **Anotações por contato** — histórico de anotações com data, para registrar o que foi conversado. Dá para criar, editar e excluir cada anotação.
- [x] **Login de administrador** — o sistema é privado; só entra quem tem usuário e senha.
- [x] **Usuários, papéis e aprovação** — tela de cadastro aberta; todo cadastro novo nasce pendente; só o administrador aprova ou recusa, numa tela própria de usuários.
- [x] **Follow-up gerado por IA** — botão que gera uma sugestão de mensagem de acompanhamento com base nos dados e anotações do contato.
- [x] **Painel com os números do funil** — quantos contatos existem em cada etapa e o total geral.
- [x] **Publicação na internet** — o sistema no ar, acessível por um endereço, com os dados salvos de verdade no Supabase.

## Versão 2

Três frentes. Cada uma só está pronta quando todas as checagens abaixo passam no navegador.

### 1. Kanban do funil

Ver e mover os contatos entre as etapas arrastando, em vez de trocar num seletor de lista.

**PRONTO QUANDO**

- [ ] Abro o Funil e vejo uma coluna por etapa, na ordem cadastrada em Etapas, cada coluna com o nome da etapa na cor dela e a quantidade de contatos no topo.
- [ ] Cada contato aparece como um cartão dentro da coluna da etapa em que está.
- [ ] Arrasto um cartão de uma coluna para outra, solto, e ele fica na coluna nova; aperto F5 e ele continua lá.
- [ ] Depois de arrastar, abro o Dashboard e os números já estão atualizados, sem eu fazer mais nada.
- [ ] Crio uma etapa nova em Etapas e ela aparece como coluna no Kanban, na posição da ordem que eu dei.
- [ ] Em tela estreita as colunas rolam de lado e ainda consigo mover um contato de etapa.

### 2. Página do contato

Tudo de um contato num lugar só, com uma busca para chegar nela rápido.

**PRONTO QUANDO**

- [ ] Clico no nome de um contato na lista e abro uma página só dele, com endereço próprio — copio o link, colo noutra aba e caio no mesmo contato.
- [ ] Nessa página vejo, sem sair dela: nome, email, telefone, a etapa atual, o histórico de anotações e os follow-ups já gerados para esse contato.
- [ ] Troco a etapa dentro da página do contato e a mudança aparece no Funil e no Dashboard.
- [ ] Escrevo uma anotação nova ali e ela entra no histórico na hora, com data.
- [ ] Digito parte de um nome, email ou telefone na busca e chego na página do contato sem precisar rolar a lista.

### 3. Dashboard v2

Os números do funil apresentados como painel de sistema, com um gráfico simples da distribuição por etapa.

**PRONTO QUANDO**

- [ ] Abro o Dashboard e vejo o total geral e um número por etapa, cada um na cor da sua etapa.
- [ ] Vejo um gráfico simples da distribuição por etapa, em que a etapa com mais contatos é visivelmente a maior.
- [ ] O gráfico usa as mesmas cores das etapas; crio ou apago uma etapa em Etapas e o gráfico acompanha.
- [ ] Movo um contato de etapa, volto ao Dashboard e tanto os números quanto o gráfico já estão atualizados.
- [ ] Sem nenhum contato cadastrado, o Dashboard mostra zeros e uma mensagem, não um gráfico quebrado.

## Fora da v2 (fica pra v3)

- Permissões avançadas: dono por contato, metas por usuário.
- Automações e lembretes agendados.
- Integrações com outros sistemas.
- Aplicativo de celular.

## O que NÃO entra na primeira versão

- Importar/exportar contatos (CSV, planilha, agenda do celular).
- Envio de e-mail, WhatsApp ou SMS direto pelo sistema (a IA só escreve o texto; o envio é manual).
- Integração com outras ferramentas (Google Contatos, calendário, ERP, redes sociais).
- Valor da oportunidade, previsão de receita, metas e relatórios financeiros.
- Tarefas, lembretes e notificações automáticas.
- Campos personalizados nos contatos (os campos são nome, email, telefone e etapa).
- Aplicativo para celular (a versão web responsiva basta).
- Anexos e arquivos nos contatos.
- Histórico de auditoria ("quem mudou o quê e quando").
