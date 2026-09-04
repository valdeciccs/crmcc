import Anthropic from "@anthropic-ai/sdk";

// Só roda no servidor: a chave nunca chega ao navegador.
const MODELO = "claude-sonnet-4-6";

// Falhas de configuração e de conta viram sempre este texto na tela.
// O motivo real fica só no terminal do servidor, para quem administra.
const INDISPONIVEL = "O gerador de mensagens está indisponível no momento. Tente mais tarde.";

const INSTRUCOES = `Você escreve mensagens curtas de acompanhamento (follow-up) para um CRM brasileiro.

Tom: profissional, caloroso e direto. Português do Brasil.

Regras:
- No máximo 4 frases.
- Entregue a mensagem pronta para enviar: sem assunto de e-mail, sem assinatura e sem colchetes para preencher depois.
- Use as anotações para ser específico sobre o que já foi conversado.
- Nunca invente fatos que não estejam nas anotações.
- Se não houver anotações, escreva algo simples e adequado à etapa do funil.
- Sem emojis e sem formatação (nada de negrito, listas ou títulos).
- Responda apenas com a mensagem, mais nada.`;

const ETAPAS = {
  novo: "acabou de entrar na base; ainda não houve conversa",
  "em contato": "já houve conversa, negócio em andamento",
  proposta: "recebeu uma proposta e está avaliando",
  cliente: "já é cliente",
};

function montarPedido(contato, anotacoes) {
  const historico =
    anotacoes.length > 0
      ? anotacoes
          .map((a) => `- ${new Date(a.criado_em).toLocaleDateString("pt-BR")}: ${a.texto}`)
          .join("\n")
      : "(sem anotações registradas)";

  return `Escreva o follow-up para este contato.

Nome: ${contato.nome}
Etapa do funil: ${contato.etapa} (${ETAPAS[contato.etapa] || ""})

Anotações, da mais recente para a mais antiga:
${historico}`;
}

export async function escreverFollowUp(contato, anotacoes) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY ausente no .env.local");
    return { erro: INDISPONIVEL };
  }

  const cliente = new Anthropic();

  try {
    const resposta = await cliente.messages.create({
      model: MODELO,
      max_tokens: 1000,
      system: INSTRUCOES,
      messages: [{ role: "user", content: montarPedido(contato, anotacoes) }],
    });

    if (resposta.stop_reason === "refusal") {
      return { erro: "A IA não conseguiu escrever essa mensagem. Tente de novo." };
    }

    const texto = resposta.content
      .filter((bloco) => bloco.type === "text")
      .map((bloco) => bloco.text)
      .join("")
      .trim();

    if (!texto) {
      return { erro: "A IA não devolveu nenhuma mensagem. Tente de novo." };
    }

    return { mensagem: texto };
  } catch (erro) {
    // O detalhe técnico fica no terminal; na tela vai só o aviso simples.
    if (erro instanceof Anthropic.AuthenticationError) {
      console.error("Chave da Anthropic inválida:", erro.message);
      return { erro: INDISPONIVEL };
    }
    // Sem crédito não adianta tentar de novo: vale dizer o que resolve.
    if (erro instanceof Anthropic.BadRequestError && /credit balance/i.test(erro.message || "")) {
      console.error("Conta da Anthropic sem creditos:", erro.message);
      return { erro: INDISPONIVEL };
    }
    if (erro instanceof Anthropic.RateLimitError) {
      console.error("Limite de uso da Anthropic:", erro.message);
      return { erro: "A IA está ocupada no momento. Tente daqui a pouco." };
    }
    console.error("Falha ao gerar follow-up:", erro?.message || erro);
    return { erro: "Não foi possível gerar o follow-up agora. Tente de novo." };
  }
}
