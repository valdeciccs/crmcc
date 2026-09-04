"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "../lib/supabase.js";
import { usuarioAtivo } from "../lib/usuarios.js";
import { CORES_DE_ETAPA } from "../lib/constantes.js";

const SEM_ACESSO = "Seu acesso não está mais ativo. Entre de novo.";

// O motivo real (código do banco, tabela faltando, nome do arquivo de
// migração) vai SÓ para o terminal do servidor. Na tela vai uma frase neutra:
// quem usa o sistema não precisa — nem deve — saber como o banco é por dentro.
function mensagemDeFalha(error, verbo) {
  console.error(`Falha ao ${verbo} etapa:`, error.code, error.message);

  if (error.code === "PGRST205") {
    console.error(
      "A tabela 'etapas' não existe. Rode banco/04-etapas.sql no painel do Supabase."
    );
    return "O cadastro de etapas está indisponível no momento. Avise quem administra o sistema.";
  }

  return `Não foi possível ${verbo} a etapa. Tente de novo.`;
}

// Regras de cada campo. Devolve um objeto com as mensagens de erro
// (vazio quer dizer que está tudo certo).
function validar({ nome, cor, ordem }) {
  const erros = {};

  if (!nome) {
    erros.nome = "Escreva o nome da etapa.";
  } else if (nome.length > 30) {
    erros.nome = "O nome pode ter no máximo 30 caracteres.";
  }

  // A cor vem da paleta fechada do design.md; nada além disso entra.
  if (!CORES_DE_ETAPA.some((opcao) => opcao.valor === cor)) {
    erros.cor = "Escolha uma das quatro cores.";
  }

  if (!Number.isInteger(ordem) || ordem < 0 || ordem > 999) {
    erros.ordem = "A ordem é um número inteiro de 0 a 999.";
  }

  return erros;
}

function lerFormulario(dadosDoFormulario) {
  return {
    nome: (dadosDoFormulario.get("nome") || "").trim(),
    cor: (dadosDoFormulario.get("cor") || "").trim(),
    ordem: Number(dadosDoFormulario.get("ordem")),
  };
}

// Nome já usado por outra etapa? A comparação ignora maiúsculas e minúsculas,
// senão dava para ter "Proposta" e "proposta" como etapas diferentes.
// A conferência é feita aqui, e não numa busca do banco, porque no banco os
// sinais % e _ valem como curinga e estragariam nomes que os contenham.
async function nomeJaUsado(nome, excetoId) {
  const { data } = await supabase.from("etapas").select("id, nome");

  return (data || []).some(
    (etapa) => etapa.id !== excetoId && etapa.nome.toLowerCase() === nome.toLowerCase()
  );
}

export async function criarEtapa(_estadoAnterior, dadosDoFormulario) {
  if (!(await usuarioAtivo())) return { erros: { geral: SEM_ACESSO } };

  const { nome, cor, ordem } = lerFormulario(dadosDoFormulario);

  const erros = validar({ nome, cor, ordem });
  if (Object.keys(erros).length > 0) return { erros };

  if (await nomeJaUsado(nome)) {
    return { erros: { nome: "Já existe uma etapa com esse nome." } };
  }

  const { error } = await supabase.from("etapas").insert({ nome, cor, ordem });

  if (error) {
    return { erros: { geral: mensagemDeFalha(error, "criar") } };
  }

  revalidatePath("/", "layout");
  return { salvo: Date.now() };
}

// Renomear uma etapa renomeia nos contatos junto: quem estava em "proposta"
// passa a estar em "orçamento", sem ninguém ficar órfão.
export async function editarEtapa(_estadoAnterior, dadosDoFormulario) {
  if (!(await usuarioAtivo())) return { erros: { geral: SEM_ACESSO } };

  const id = Number(dadosDoFormulario.get("id"));
  const { nome, cor, ordem } = lerFormulario(dadosDoFormulario);

  if (!id) {
    return { erros: { geral: "Etapa não identificada. Recarregue a página." } };
  }

  const erros = validar({ nome, cor, ordem });
  if (Object.keys(erros).length > 0) return { erros };

  const { data: atual, error: erroAoLer } = await supabase
    .from("etapas")
    .select("nome")
    .eq("id", id)
    .maybeSingle();

  if (erroAoLer) {
    return { erros: { geral: mensagemDeFalha(erroAoLer, "salvar") } };
  }
  if (!atual) {
    return { erros: { geral: "Essa etapa não existe mais. Recarregue a página." } };
  }

  // Conferido ANTES de mexer nos contatos: sem isso, um nome repetido juntaria
  // os contatos de duas etapas diferentes na mesma.
  if (nome !== atual.nome && (await nomeJaUsado(nome, id))) {
    return { erros: { nome: "Já existe uma etapa com esse nome." } };
  }

  // Os contatos vão primeiro. Se a segunda parte falhar, é só repetir a
  // edição: a primeira não terá mais o que mudar e o conserto se completa.
  if (nome !== atual.nome) {
    const { error } = await supabase
      .from("contatos")
      .update({ etapa: nome })
      .eq("etapa", atual.nome);

    if (error) {
      return { erros: { geral: mensagemDeFalha(error, "renomear") } };
    }
  }

  const { error } = await supabase.from("etapas").update({ nome, cor, ordem }).eq("id", id);

  if (error) {
    return { erros: { geral: mensagemDeFalha(error, "salvar") } };
  }

  revalidatePath("/", "layout");
  return { salvo: Date.now() };
}

export async function excluirEtapa(_estadoAnterior, dadosDoFormulario) {
  if (!(await usuarioAtivo())) return { erro: SEM_ACESSO };

  const id = Number(dadosDoFormulario.get("id"));
  if (!id) {
    return { erro: "Etapa não identificada. Recarregue a página." };
  }

  const { data: etapa, error: erroAoLer } = await supabase
    .from("etapas")
    .select("nome")
    .eq("id", id)
    .maybeSingle();

  if (erroAoLer) {
    return { erro: mensagemDeFalha(erroAoLer, "apagar") };
  }
  if (!etapa) {
    return { erro: "Essa etapa não existe mais. Recarregue a página." };
  }

  // Sem etapa nenhuma não dá para cadastrar contato.
  const { count: quantasEtapas } = await supabase
    .from("etapas")
    .select("id", { count: "exact", head: true });

  if (quantasEtapas <= 1) {
    return { erro: "Deixe pelo menos uma etapa no funil." };
  }

  // Contato órfão não teria cor nem lugar no funil, então a etapa só sai vazia.
  // Se a contagem falhar, não apaga: melhor barrar do que deixar órfão.
  const { count: quantosContatos, error: erroDaContagem } = await supabase
    .from("contatos")
    .select("id", { count: "exact", head: true })
    .eq("etapa", etapa.nome);

  if (erroDaContagem) {
    return { erro: "Não foi possível conferir os contatos dessa etapa. Tente de novo." };
  }

  if (quantosContatos > 0) {
    return {
      erro:
        quantosContatos === 1
          ? "Essa etapa tem 1 contato. Mova esse contato antes de apagar."
          : `Essa etapa tem ${quantosContatos} contatos. Mova esses contatos antes de apagar.`,
    };
  }

  const { error } = await supabase.from("etapas").delete().eq("id", id);

  if (error) {
    return { erro: mensagemDeFalha(error, "apagar") };
  }

  revalidatePath("/", "layout");
  return { excluido: Date.now() };
}
