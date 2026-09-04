import { cookies } from "next/headers";
import { supabase } from "./supabase.js";
import { lerSessao } from "./sessao.js";
import { NOME_DO_COOKIE } from "./constantes.js";

// Quem o cookie diz que está logado. Não garante que a conta ainda existe.
export async function sessaoAtual() {
  const armazem = await cookies();
  return lerSessao(armazem.get(NOME_DO_COOKIE)?.value);
}

// Quem está logado DE VERDADE: confere no banco que a conta ainda existe e
// continua aprovada. É isto que faz "recusar" e "excluir" terem efeito
// imediato, em vez de valerem só quando o cookie vencer.
export async function usuarioAtivo() {
  const sessao = await sessaoAtual();
  if (!sessao) return null;

  const { data } = await supabase
    .from("usuarios")
    .select("id, usuario, papel, situacao")
    .eq("usuario", sessao.usuario)
    .maybeSingle();

  if (!data || data.situacao !== "aprovado") return null;
  return data;
}

// Igual ao anterior, mas exige que seja administrador.
export async function exigirAdmin() {
  const usuario = await usuarioAtivo();
  if (!usuario || usuario.papel !== "admin") return null;
  return usuario;
}
