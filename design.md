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

- **Dashboard** — o painel com os números do funil: total de contatos e quantos há em cada etapa.
- **Contatos** — o formulário de cadastro (nome, email, telefone e **etapa**) e, abaixo, a lista completa de contatos.
- **Funil** — a mesma lista de contatos, para olhar o funil sem o formulário no caminho.
- **Etapas** — o cadastro das etapas do funil: criar, renomear, trocar a cor e a ordem, apagar.
- **Usuários** — a tela de aprovação de cadastros. Só administrador.

A **lista de contatos** é sempre a mesma tabela, em Contatos e no Funil: nome, email, telefone, etapa, anotações (ver, criar, editar, excluir) e follow-up escrito pela IA.

Na coluna Etapa a etiqueta é também o controle: é um seletor com o formato da etiqueta — mesma fonte mono em maiúsculas, mesma borda, na cor da etapa — e escolher outra etapa já salva, sem botão de confirmar.

### Regras do cadastro de etapas

- **Apagar** só funciona com a etapa vazia. Enquanto tiver contato dentro, o botão não aparece e a tela diz quantos são.
- **Sempre sobra pelo menos uma etapa**: sem nenhuma, não dá para cadastrar contato.
- **Renomear leva os contatos junto.** Se "proposta" virar "orçamento", quem estava em proposta vai junto — ninguém fica órfão.

## Telas de fora (sem shell)

**Entrar** e **Criar conta** não têm navegação lateral nem cabeçalho: são um cartão centralizado na tela escura, com o nome do CRM acima. Mesmas cores, mesmas formas, mesma tipografia do resto.
