# Identidade visual do CRM — v2 · Dark Tech

Regra: **todas as telas do projeto seguem este arquivo.** Nada de estilo inventado fora daqui.

## Clima

Ferramenta técnica e precisa, escura, de quem trabalha à noite.
Um produto profissional, não um template.

---

## Cores

### Base

| Uso | Cor |
| --- | --- |
| Fundo da página (quase-preto azulado) | `#0D1117` |
| Superfícies (cartões, barras, tabelas, campos) | `#151B24` |
| Superfícies elevadas (modais, menus, item ativo) | `#1B222E` |
| Borda visível | `#262F3D` |
| Texto principal | `#E6EAF2` |
| Texto de apoio | `#9AA4B2` |

### Cor de destaque

Uma só, para ações e elementos ativos: **azul elétrico `#4DBDFF`**, com hover mais claro `#6BA1FF`.
**Nenhuma outra cor de marca no projeto.**

Como o azul é claro, o texto **em cima** do destaque (botão cheio) é o próprio fundo `#0D1117`.
Fundo de realce (item ativo da navegação): o mesmo azul com transparência baixa, `rgba(77, 189, 255, 0.12)`.

### Erro

`#FB7171`. Texto em cima de fundo de erro cheio: `#0D1117`.

### Paleta das etapas do funil

As etapas são cadastradas por quem usa o sistema, então a cor não é fixa por etapa: é **escolhida numa paleta fechada de quatro**, na hora de criar ou editar a etapa. Versões luminosas, legíveis no escuro:

| Nome | Cor | Etapa que usa por padrão |
| --- | --- | --- |
| cinza | `#8B99AD` | novo |
| laranja | `#F5A524` | em contato |
| roxo | `#A78BFA` | proposta |
| verde | `#34D399` | cliente |

**Nenhuma cor além destas quatro entra na paleta**, e elas são usadas **somente** onde a etapa é o assunto — nas etiquetas/seletores de etapa e nos números do painel. Em nenhum outro lugar.

Contraste sempre confortável de ler.

---

## Tipografia

Duas famílias, com papéis separados:

- **Manrope** (sem serifa) — todo o texto: títulos, parágrafos, rótulos, botões, links, conteúdo das tabelas.
  Títulos em peso forte (700/800), textos em peso normal (400/500).
- **JetBrains Mono** — o toque tech. Só em:
  - números e contadores (números do painel, `Lista (12)`, `Ver (3)`, quantidade de pendentes);
  - etiquetas técnicas (etiqueta de etapa do funil, etiqueta de situação do usuário);
  - cabeçalhos de coluna das tabelas;
  - datas, horas e telefones;
  - o nome do CRM no cabeçalho.

Etiquetas técnicas em maiúsculas, com espaçamento entre letras.
Hierarquia clara: o título tem que ser visivelmente maior que o texto.

---

## Formas e espaço

- Cantos arredondados: **10px**.
- **Bordas visíveis (`#262F3D`) em vez de sombras.** É assim que a superfície se separa do fundo.
- Foco de campo: borda no azul de destaque + contorno de 1px na mesma cor. Sem brilho, sem sombra.
- Bastante respiro entre os elementos.

---

## Proibido

- Gradientes.
- Efeito de vidro / desfoque.
- Emojis na interface.
- Sombras exageradas.
- Animações chamativas.

Se a tela parecer template de IA, está errado.

---

# Estrutura: de página para sistema

O CRM deixa de ser uma página só e vira um **sistema com áreas**.

## Shell de aplicação

Todas as telas de dentro (logado) usam o mesmo esqueleto:

```
┌──────────────────────────────────────────────────────┐
│  CABEÇALHO   Meu CRM              valdeci    [Sair]  │
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│  Dashboard │                                         │
│  Funil     │           ÁREA DE CONTEÚDO              │
│  Contatos  │           (tela cheia)                  │
│  Usuários  │                                         │
│            │                                         │
└────────────┴─────────────────────────────────────────┘
```

**Cabeçalho** — faixa no topo, largura inteira, fundo de superfície e borda embaixo. Contém:
- o nome do CRM à esquerda (em JetBrains Mono);
- quem está logado e o botão **Sair** à direita.

**Navegação lateral** — coluna fixa à esquerda (largura ~220px), fundo de superfície e borda à direita. Contém as áreas do sistema, uma embaixo da outra, e tem espaço para crescer:

| Área | Endereço | Quem vê |
| --- | --- | --- |
| Dashboard | `/` | todos |
| Funil | `/funil` | todos |
| Contatos | `/contatos` | todos |
| Etapas | `/etapas` | todos |
| Usuários | `/usuarios` | **só administrador** |

**Item ativo:** fundo de destaque (`rgba(77, 189, 255, 0.12)`), texto no azul de destaque e uma barra de 2px na borda esquerda, também no azul. Os itens inativos têm a mesma barra transparente, para nada pular de lugar ao trocar de tela.

**Área de conteúdo** — à direita, ocupa o resto. Cada área é uma tela cheia, com título, uma linha de apoio explicando a área, e o conteúdo.

### Telas estreitas

A navegação lateral se recolhe de um jeito simples: vira uma **faixa horizontal logo abaixo do cabeçalho**, com os mesmos itens lado a lado, rolando na horizontal se não couberem. Nada de menu escondido atrás de botão. O item ativo continua marcado — só que com a barra de destaque embaixo, em vez de à esquerda.

## O que fica em cada área

- **Dashboard** — os números do funil, o gráfico da distribuição por etapa e os últimos contatos cadastrados.
- **Contatos** — o formulário de cadastro (nome, email, telefone e **etapa**) e, abaixo, a lista completa de contatos.
- **Funil** — o quadro Kanban: uma coluna por etapa, um cartão por contato, movido de etapa arrastando.
- **Etapas** — o cadastro das etapas do funil: criar, renomear, trocar a cor e a ordem, apagar.
- **Usuários** — a tela de aprovação de cadastros. Só administrador.

A **lista de contatos** é a tabela da área de **Contatos**: nome, email, telefone, etapa, anotações (ver, criar, editar, excluir) e follow-up escrito pela IA. O Funil não usa mais essa tabela — usa o Kanban.

Na coluna Etapa a etiqueta é também o controle: é um seletor com o formato da etiqueta — mesma fonte mono em maiúsculas, mesma borda, na cor da etapa — e escolher outra etapa já salva, sem botão de confirmar.

### Regras do cadastro de etapas

- **Apagar** só funciona com a etapa vazia. Enquanto tiver contato dentro, o botão não aparece e a tela diz quantos são.
- **Sempre sobra pelo menos uma etapa**: sem nenhuma, não dá para cadastrar contato.
- **Renomear leva os contatos junto.** Se "proposta" virar "orçamento", quem estava em proposta vai junto — ninguém fica órfão.

## Dashboard

Três blocos, um embaixo do outro, para o funil ser entendido de relance.

**Números** — cartões grandes lado a lado, um para o total de contatos e um por etapa. O número em mono, grande (38px), na **cor da etapa**; embaixo, o nome da etapa como etiqueta técnica em mono maiúsculo. O total geral fica no texto principal, sem cor de etapa — ele não é de nenhuma.

**Distribuição por etapa** — um gráfico de barras horizontais dentro de um cartão. Cada linha traz: o nome da etapa à esquerda (etiqueta técnica, largura fixa), o trilho da barra no meio e a quantidade em mono à direita. A barra é preenchida na **cor da etapa**, e a etapa com mais contatos ocupa o trilho inteiro — as outras aparecem em proporção a ela, então a maior é sempre visivelmente a maior. Sem eixos, sem legenda, sem grade: o rótulo e o número já dizem tudo.

**Últimos contatos** — os cinco cadastros mais recentes, numa lista de uma linha por contato: o nome à esquerda, que é o link para a página do contato, e há quanto tempo entrou, em mono, à direita.

**Sem dados**, cada bloco se explica sozinho, e nenhum deles quebra: os números mostram zero; o gráfico diz que ainda não há distribuição (ou que falta cadastrar etapa); a lista diz que ainda não há contato e aponta a área de Contatos.

## Kanban do funil

O Funil é um **quadro**: uma coluna por etapa, na ordem cadastrada em Etapas, e um cartão por contato dentro da coluna da etapa em que ele está.

**Coluna** — cartão de superfície com borda, como o resto do sistema. No topo, numa linha só: um **ponto redondo na cor da etapa**, o nome da etapa em mono maiúsculo espaçado, e a quantidade de contatos em mono, à direita. Uma borda separa esse topo dos cartões. Coluna sem ninguém mostra, no lugar dos cartões, o convite para arrastar um para lá.

**Cartão** — superfície elevada, borda e cantos de 10px. Traz, um embaixo do outro: o **nome** (peso forte, e é o link que abre a página do contato), o email na cor de apoio e, em mono pequeno, há quanto tempo é contato. Nada mais: o resto está na página do contato.

**Arrastar** — pegar o cartão e soltar em outra coluna já salva a etapa nova; não há botão de confirmar. Enquanto o cartão está sendo arrastado ele fica esmaecido, e a coluna sob o cursor mostra a borda no azul de destaque. O cartão aparece na coluna nova na hora, antes mesmo de o servidor responder.

**Botão "Novo contato"** — fica na mesma linha do título Funil, à direita. Ele apenas **leva para a área de Contatos**, onde o formulário de cadastro já mora. O cadastro não é duplicado aqui.

### Telas estreitas

As colunas **rolam de lado**, mantendo a largura mínima — nada de espremer a coluna até o cartão ficar ilegível. Como arrastar não funciona no toque, cada cartão passa a mostrar, embaixo, o **seletor-etiqueta de etapa** já usado na lista de contatos: é por ele que se move alguém de etapa no celular.

## Página do contato

Tudo de um relacionamento numa tela só. Endereço próprio: `/contatos/<número>`, para poder copiar o link e voltar depois. Chega-se nela clicando no **nome** do contato na lista (em Contatos e no Funil) ou pela busca da área de Contatos.

Usa o mesmo shell das outras telas: o **nome do contato é o título da área**, e a linha de apoio diz há quanto tempo ele é contato e desde quando. Acima do conteúdo, um link curto de volta — `← Todos os contatos` — em mono, pequeno.

O conteúdo vem em três blocos, um embaixo do outro:

1. **Ficha** — um cartão com email, telefone e etapa, uma linha por campo, separadas por borda. O rótulo à esquerda é etiqueta técnica (mono, maiúsculas, espaçada, na cor de apoio); o valor à direita. Telefone em mono. A etapa é o mesmo seletor-etiqueta da lista, na cor da etapa: trocar ali já salva.
2. **Anotações** — o histórico de sempre, com o formulário de nova anotação embaixo. O título não repete o nome do contato, que já está no alto da tela.
3. **Follow-ups** — o botão de gerar e, abaixo, a lista dos que já foram escritos, do mais novo para o mais antigo. Cada um traz a data em mono e um botão de copiar. Mesma moldura da lista de anotações.

Cada bloco tem título com a contagem em mono entre parênteses — `Anotações (3)`, `Follow-ups (2)` — como no resto do sistema.

**Contato que não existe** (apagado por alguém, ou endereço digitado errado): a tela avisa num cartão e mostra o botão que volta para Contatos. Nunca um erro cru.

### Busca de contatos

Fica na área de **Contatos**, acima da lista: um campo de texto comum, de largura contida. Filtra a lista enquanto se digita — por nome, email ou telefone —, ignorando acento, maiúscula e a pontuação do telefone. Abaixo do campo, a contagem do que sobrou, em mono: `3 de 12` contatos. Não achando nada, o lugar da tabela recebe o aviso de que ninguém bate com o que foi digitado.

## Telas de fora (sem shell)

**Entrar** e **Criar conta** não têm navegação lateral nem cabeçalho: são um cartão centralizado na tela escura, com o nome do CRM acima. Mesmas cores, mesmas formas, mesma tipografia do resto.
