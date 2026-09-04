"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "../lib/supabase.js";
import { conferirSenha, gerarHash } from "../lib/senha.js";
import { criarSessao } from "../lib/sessao.js";
import { NOME_DO_COOKIE, DIAS_DE_SESSAO } from "../lib/constantes.js";

const FORMATO_DE_USUARIO = /^[a-zA-Z0-9._-]{3,30}$/;

// Na tela vai sempre o mesmo texto neutro; o motivo real (código do banco,
// tabela faltando, configuração) fica no terminal do servidor.
function mensagemDeFalha() {
  return "Não foi possível concluir agora. Tente de novo.";
}

// Teto de tamanho: sem isso, um envio gigante faria o servidor gastar
// processamento à toa embaralhando a senha.
const MAX_USUARIO = 30;
const MAX_SENHA = 200;

export async function entrar(_estadoAnterior, dadosDoFormulario) {
  const usuario = (dadosDoFormulario.get("usuario") || "").trim();
  const senha = dadosDoFormulario.get("senha") || "";

  if (!process.env.CRM_SEGREDO_SESSAO) {
    console.error("CRM_SEGREDO_SESSAO ausente no .env.local");
    return { erro: "Não foi possível entrar agora. Tente de novo." };
  }

  if (usuario.length > MAX_USUARIO || senha.length > MAX_SENHA) {
    return { erro: "Usuário ou senha inválidos." };
  }

  const { data: cadastro, error } = await supabase
    .from("usuarios")
    .select("usuario, senha_hash, papel, situacao")
    .eq("usuario", usuario)
    .maybeSingle();

  if (error) {
    console.error("Falha ao consultar usuarios:", error.code, error.message);
    return { erro: mensagemDeFalha() };
  }

  // Confere a senha mesmo quando o usuário não existe, para o tempo de
  // resposta não denunciar quais usuários existem.
  const hashParaConferir = cadastro?.senha_hash || "0".repeat(32) + ":" + "0".repeat(128);
  const senhaConfere = conferirSenha(senha, hashParaConferir);

  if (!cadastro || !senhaConfere) {
    return { erro: "Usuário ou senha inválidos." };
  }
  if (cadastro.situacao === "pendente") {
    return { erro: "Seu cadastro está aguardando aprovação do administrador." };
  }
  if (cadastro.situacao !== "aprovado") {
    return { erro: "Seu cadastro não foi aprovado. Procure o administrador." };
  }

  const armazem = await cookies();
  armazem.set(
    NOME_DO_COOKIE,
    await criarSessao({ usuario: cadastro.usuario, papel: cadastro.papel }, DIAS_DE_SESSAO),
    {
      httpOnly: true, // o JavaScript da página não enxerga o cookie
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: DIAS_DE_SESSAO * 24 * 60 * 60,
    }
  );

  redirect("/");
}

export async function registrar(_estadoAnterior, dadosDoFormulario) {
  const usuario = (dadosDoFormulario.get("usuario") || "").trim();
  const senha = dadosDoFormulario.get("senha") || "";
  const repetida = dadosDoFormulario.get("repetir_senha") || "";

  const erros = {};

  if (!usuario) {
    erros.usuario = "Escolha um nome de usuário.";
  } else if (!FORMATO_DE_USUARIO.test(usuario)) {
    erros.usuario = "Use de 3 a 30 caracteres, apenas letras, números, ponto, hífen ou _.";
  }

  if (!senha) {
    erros.senha = "Escolha uma senha.";
  } else if (senha.length < 8) {
    erros.senha = "A senha precisa ter pelo menos 8 caracteres.";
  } else if (senha.length > MAX_SENHA) {
    erros.senha = `A senha pode ter no máximo ${MAX_SENHA} caracteres.`;
  }

  if (senha && repetida !== senha) {
    erros.repetir_senha = "As duas senhas não são iguais.";
  }

  if (Object.keys(erros).length > 0) return { erros };

  const { data: existente } = await supabase
    .from("usuarios")
    .select("id")
    .eq("usuario", usuario)
    .maybeSingle();

  if (existente) {
    return { erros: { usuario: "Esse nome de usuário já está em uso." } };
  }

  // Todo cadastro novo nasce comum e pendente. Só o admin aprova.
  const { error } = await supabase.from("usuarios").insert({
    usuario,
    senha_hash: gerarHash(senha),
    papel: "comum",
    situacao: "pendente",
  });

  if (error) {
    console.error("Falha ao inserir usuario:", error.code, error.message);
    return { erros: { geral: mensagemDeFalha() } };
  }

  return { enviado: Date.now() };
}

export async function sair() {
  const armazem = await cookies();
  armazem.delete(NOME_DO_COOKIE);
  redirect("/login");
}
