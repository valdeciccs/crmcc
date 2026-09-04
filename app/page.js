import { redirect } from "next/navigation";
import { supabase } from "../lib/supabase.js";
import { usuarioAtivo } from "../lib/usuarios.js";
import { listarEtapas } from "../lib/etapas.js";
import Shell from "./shell.js";
import PainelFunil from "./painel-funil.js";

// Os números mudam a cada cadastro, então a página é sempre montada na hora.
export const dynamic = "force-dynamic";

export default async function PaginaDashboard() {
  // Conta apagada ou recusada perde o acesso na hora, mesmo com cookie válido.
  const sessao = await usuarioAtivo();
  if (!sessao) redirect("/sair");

  // Só a etapa de cada contato: é tudo que o painel precisa para contar.
  const [{ data: contatos, error }, etapas] = await Promise.all([
    supabase.from("contatos").select("etapa"),
    listarEtapas(),
  ]);

  return (
    <Shell
      sessao={sessao}
      atual="dashboard"
      titulo="Dashboard"
      apoio="Onde está cada negócio agora, em números."
    >
      {error ? (
        <p className="aviso-erro">Não foi possível carregar os números.</p>
      ) : (
        <PainelFunil contatos={contatos} etapas={etapas} />
      )}
    </Shell>
  );
}
