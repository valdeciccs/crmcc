"use server";

import { revalidatePath } from "next/cache";
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

  const resultado = await escreverFollowUp(contato, anotacoes);
  if (resultado.erro) return resultado;

  // A mensagem fica guardada com a data, para reler depois.
  const { error: erroAoGuardar } = await supabase
    .from("follow_ups")
    .insert({ contato_id: contatoId, texto: resultado.mensagem });

  if (erroAoGuardar) {
    // A mensagem já está escrita: melhor entregar com um aviso do que perder.
    console.error("Falha ao guardar follow-up:", erroAoGuardar.code, erroAoGuardar.message);
    return {
      ...resultado,
      aviso: "A mensagem foi escrita, mas não deu para guardar no histórico.",
    };
  }

  // O histórico aparece na página do contato: a tela se atualiza sozinha.
  revalidatePath("/", "layout");
  return resultado;
}
