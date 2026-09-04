"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "../lib/supabase.js";
import { exigirAdmin } from "../lib/usuarios.js";

// Muda a situação de um cadastro. Só o admin consegue — a checagem é feita
// aqui no servidor, contra o banco, nunca confiando no que veio da tela.
async function mudarSituacao(dadosDoFormulario, novaSituacao) {
  const admin = await exigirAdmin();
  if (!admin) {
    return { erro: "Apenas o administrador pode fazer isso." };
  }

  const id = Number(dadosDoFormulario.get("id"));
  if (!id) {
    return { erro: "Usuário não identificado. Recarregue a página." };
  }
  if (id === admin.id) {
    return { erro: "Você não pode alterar o seu próprio cadastro." };
  }

  const { error } = await supabase
    .from("usuarios")
    .update({ situacao: novaSituacao })
    .eq("id", id);

  if (error) {
    return { erro: "Não foi possível salvar. Tente de novo." };
  }

  revalidatePath("/usuarios");
  return { salvo: Date.now() };
}

export async function aprovarUsuario(_estadoAnterior, dadosDoFormulario) {
  return mudarSituacao(dadosDoFormulario, "aprovado");
}

export async function recusarUsuario(_estadoAnterior, dadosDoFormulario) {
  return mudarSituacao(dadosDoFormulario, "recusado");
}
