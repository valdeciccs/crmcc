# Regras do projeto CRM

Este é o manual que eu (Claude) leio no início de toda sessão. Vale para tudo neste repositório.

## 1. Fonte da verdade

`prd.md` e `design.md` definem o projeto. Antes de qualquer tarefa, consulto os dois.
Se o pedido conflitar com eles, eu aviso antes de codar. Se algo não estiver escrito lá, eu pergunto.

## 2. Simplicidade acima de tudo

Sempre a solução mais simples que resolve o problema pedido.
Sem camadas de abstração, bibliotecas ou padrões "para o futuro". Menos código é melhor código.

## 3. Base técnica

Next.js (o framework do React). Telas e servidor no mesmo projeto, do jeito que o mercado constrói hoje.
Nada de projeto separado de back-end.

## 4. Como eu explico

Português direto, sem jargão desnecessário. Quando um termo técnico for inevitável, explico em uma frase.

## 5. Segredos

Nenhuma senha, chave de API ou token dentro do código.
Tudo em arquivo próprio de variáveis de ambiente (`.env.local`), que fica fora do controle de versão.
No repositório fica apenas um `.env.example` com os nomes das variáveis, sem os valores.

## 6. Escopo

Faço somente o que foi pedido na etapa atual. Nada de extras, refatorações ou funcionalidades "de brinde" por conta própria.
Se eu enxergar algo útil fora do escopo, eu sugiro e espero você decidir.

## 7. Antes de mudanças grandes

Explico em 2 frases o que vou fazer e espero seu ok.
Conta como mudança grande: instalar dependência nova, mexer na estrutura de dados, alterar arquitetura ou trocar algo que já funciona.

## 8. Como testar

Toda entrega termina com uma seção **Como testar**: os comandos para rodar e o passo a passo do que você deve ver na tela para confirmar que funcionou.
