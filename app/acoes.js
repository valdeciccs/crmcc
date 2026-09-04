"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "../lib/supabase.js";
import { normalizarTelefone } from "../lib/telefone.js";
import { usuarioAtivo } from "../lib/usuarios.js";
import { listarEtapas } from "../lib/etapas.js";

const SEM_ACESSO = "Seu acesso não está mais ativo. Entre de novo.";

const FORMATO_DE_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

// Regras de cada campo. Devolve um objeto com as mensagens de erro
// (vazio quer dizer que está tudo certo).
function validar({ nome, email, telefone }) {
  const erros = {};

  if (!nome) {
    erros.nome = "Informe o nome do contato para salvar.";
  } else if (nome.length < 2) {
    erros.nome = "O nome precisa ter pelo menos 2 letras.";
  } else if (nome.length > 80) {
    erros.nome = "O nome pode ter no máximo 80 caracteres.";
  }

  // Email é opcional, mas se vier preenchido tem que ser válido.
  if (email) {
    if (!FORMATO_DE_EMAIL.test(email)) {
      erros.email = "Email inválido. Exemplo: nome@empresa.com.br";
    } else if (email.length > 120) {
      erros.email = "O email pode ter no máximo 120 caracteres.";
    }
  }

  // Telefone é opcional, mas se vier preenchido tem que ser brasileiro.
  if (telefone && !normalizarTelefone(telefone)) {
    erros.telefone = "Telefone incompleto. Use DDD + número: (11) 98877-1020.";
  }

  return erros;
}

// Recebe o formulário, valida, grava no banco e manda as telas se atualizarem.
export async function criarContato(_estadoAnterior, dadosDoFormulario) {
  if (!(await usuarioAtivo())) return { erros: { geral: SEM_ACESSO } };

  const nome = (dadosDoFormulario.get("nome") || "").trim();
  const email = (dadosDoFormulario.get("email") || "").trim();
  const telefone = (dadosDoFormulario.get("telefone") || "").trim();
  const etapa = (dadosDoFormulario.get("etapa") || "").trim();

  const erros = validar({ nome, email, telefone });

  // A etapa é conferida contra a tabela: o que não está cadastrado não passa.
  const etapas = await listarEtapas();
  if (!etapas.some((cadastrada) => cadastrada.nome === etapa)) {
    erros.etapa = "Escolha uma das etapas cadastradas.";
  }

  if (Object.keys(erros).length > 0) {
    return { erros };
  }

  const { error } = await supabase.from("contatos").insert({
    nome,
    email: email || null,
    telefone: telefone ? normalizarTelefone(telefone) : null,
    etapa,
  });

  if (error) {
    return { erros: { geral: "Não foi possível salvar o contato. Tente de novo." } };
  }

  // A lista aparece em Contatos e no Funil, e os números no Dashboard.
  // Uma chamada só mantém as três telas em dia.
  revalidatePath("/", "layout");
  return { salvo: Date.now() };
}

// Move um contato de etapa. É o seletor que fica em cada linha da lista.
export async function mudarEtapaContato(_estadoAnterior, dadosDoFormulario) {
  if (!(await usuarioAtivo())) return { erro: SEM_ACESSO };

  const id = Number(dadosDoFormulario.get("id"));
  const etapa = (dadosDoFormulario.get("etapa") || "").trim();

  if (!id) {
    return { erro: "Contato não identificado. Recarregue a página." };
  }

  const etapas = await listarEtapas();
  if (!etapas.some((cadastrada) => cadastrada.nome === etapa)) {
    return { erro: "Essa etapa não existe mais. Recarregue a página." };
  }

  const { error } = await supabase.from("contatos").update({ etapa }).eq("id", id);

  if (error) {
    return { erro: "Não foi possível mudar a etapa. Tente de novo." };
  }

  revalidatePath("/", "layout");
  return { salvo: Date.now() };
}

// Grava uma anotação nova no histórico de um contato.
export async function criarAnotacao(_estadoAnterior, dadosDoFormulario) {
  if (!(await usuarioAtivo())) return { erro: SEM_ACESSO };

  const contatoId = Number(dadosDoFormulario.get("contato_id"));
  const texto = (dadosDoFormulario.get("texto") || "").trim();

  if (!contatoId) {
    return { erro: "Contato não identificado. Recarregue a página." };
  }
  if (!texto) {
    return { erro: "Escreva a anotação antes de salvar." };
  }
  if (texto.length > 2000) {
    return { erro: "A anotação pode ter no máximo 2000 caracteres." };
  }

  const { error } = await supabase
    .from("anotacoes")
    .insert({ contato_id: contatoId, texto });

  if (error) {
    return { erro: "Não foi possível salvar a anotação. Tente de novo." };
  }

  revalidatePath("/", "layout");
  return { salvo: Date.now() };
}

// Troca o texto de uma anotação que já existe. A data de criação não muda.
export async function editarAnotacao(_estadoAnterior, dadosDoFormulario) {
  if (!(await usuarioAtivo())) return { erro: SEM_ACESSO };

  const id = Number(dadosDoFormulario.get("id"));
  const texto = (dadosDoFormulario.get("texto") || "").trim();

  if (!id) {
    return { erro: "Anotação não identificada. Recarregue a página." };
  }
  if (!texto) {
    return { erro: "A anotação não pode ficar vazia." };
  }
  if (texto.length > 2000) {
    return { erro: "A anotação pode ter no máximo 2000 caracteres." };
  }

  const { error } = await supabase.from("anotacoes").update({ texto }).eq("id", id);

  if (error) {
    return { erro: "Não foi possível salvar a alteração. Tente de novo." };
  }

  revalidatePath("/", "layout");
  return { salvo: Date.now() };
}

// Apaga uma anotação de vez.
export async function excluirAnotacao(_estadoAnterior, dadosDoFormulario) {
  if (!(await usuarioAtivo())) return { erro: SEM_ACESSO };

  const id = Number(dadosDoFormulario.get("id"));

  if (!id) {
    return { erro: "Anotação não identificada. Recarregue a página." };
  }

  const { error } = await supabase.from("anotacoes").delete().eq("id", id);

  if (error) {
    return { erro: "Não foi possível excluir a anotação. Tente de novo." };
  }

  revalidatePath("/", "layout");
  return { excluido: Date.now() };
}
