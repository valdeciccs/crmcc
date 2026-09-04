import { redirect } from "next/navigation";
import { supabase } from "../lib/supabase.js";
import { usuarioAtivo } from "../lib/usuarios.js";
import { listarEtapas } from "../lib/etapas.js";
import { tempoDesde } from "../lib/data.js";
import Shell from "./shell.js";
import PainelFunil from "./painel-funil.js";
import GraficoFunil from "./grafico-funil.js";
import UltimosContatos from "./ultimos-contatos.js";

// Os números mudam a cada cadastro, então a página é sempre montada na hora.
export const dynamic = "force-dynamic";

export default async function PaginaDashboard() {
  // Conta apagada ou recusada perde o acesso na hora, mesmo com cookie válido.
  const sessao = await usuarioAtivo();
  if (!sessao) redirect("/sair");

  // Uma consulta só serve as três partes da tela: os números, o gráfico e a
  // lista dos recentes. Já vem na ordem do mais novo para o mais antigo.
  const [{ data: contatos, error }, etapas] = await Promise.all([
    supabase
      .from("contatos")
      .select("id, nome, email, etapa, criado_em")
      .order("criado_em", { ascending: false })
      .order("id", { ascending: false }),
    listarEtapas(),
  ]);

  const todos = contatos || [];
  const recentes = todos.slice(0, 5).map((contato) => ({
    ...contato,
    tempo: tempoDesde(contato.criado_em),
  }));

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
        <>
          <PainelFunil contatos={todos} etapas={etapas} />

          {/* Gráfico e recentes lado a lado; em tela estreita, um sob o outro */}
          <div className="dashboard-duplo">
            <GraficoFunil contatos={todos} etapas={etapas} />
            <UltimosContatos contatos={recentes} etapas={etapas} />
          </div>
        </>
      )}
    </Shell>
  );
}
