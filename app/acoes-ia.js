"use server";

import { supabase } from "../lib/supabase.js";
import { usuarioAtivo } from "../lib/usuarios.js";
import { escreverFollowUp } from "../lib/ia.js";

export async function gerarFollowUp(_estadoAnterior, dadosDoFormulario) {
  // Confere no banco que a conta ainda existe e está aprovada.
  if (!(await usuarioAtivo())) {
    return { erro: "Seu acesso não está mais ativo. Entre de novo." };
  }

  const contatoId = Number(dadosDoFormulario.get("contato_id"));
  if (!contatoId) {
    return { erro: "Contato não identificado. Recarregue a página." };
  }

  // Busca os dados no servidor, e não o que veio da tela.
  const { data: contato, error } = await supabase
    .from("contatos")
    .select("nome, etapa, anotacoes(texto, criado_em)")
    .eq("id", contatoId)
    .maybeSingle();

  if (error || !contato) {
    return { erro: "Não foi possível carregar o contato. Recarregue a página." };
  }

  const anotacoes = [...(contato.anotacoes || [])].sort(
    (a, b) => new Date(b.criado_em) - new Date(a.criado_em)
  );

  return escreverFollowUp(contato, anotacoes);
}
