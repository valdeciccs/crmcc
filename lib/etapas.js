import { supabase } from "./supabase.js";

// As etapas do funil, na ordem em que aparecem no sistema. Toda tela que
// mostra ou escolhe etapa lê daqui — não existe mais lista fixa no código.
export async function listarEtapas() {
  const { data, error } = await supabase
    .from("etapas")
    .select("id, nome, cor, ordem")
    .order("ordem", { ascending: true })
    .order("id", { ascending: true });

  // Na tela a lista fica vazia; o motivo real fica no terminal do servidor.
  if (error) console.error("Falha ao listar etapas:", error.code, error.message);

  return data || [];
}
