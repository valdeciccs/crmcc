import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "../../lib/supabase.js";
import { usuarioAtivo } from "../../lib/usuarios.js";
import { listarEtapas } from "../../lib/etapas.js";
import { tempoDesde } from "../../lib/data.js";
import Shell from "../shell.js";
import Kanban from "../kanban.js";

// Os cartões mudam de coluna a cada arrasto, então a página é montada na hora.
export const dynamic = "force-dynamic";
export const metadata = { title: "Funil — Meu CRM" };

export default async function PaginaFunil() {
  // Conta apagada ou recusada perde o acesso na hora, mesmo com cookie válido.
  const sessao = await usuarioAtivo();
  if (!sessao) redirect("/sair");

  // O cartão mostra só nome, email e há quanto tempo: é tudo que ele precisa.
  const [{ data: contatos, error }, etapas] = await Promise.all([
    supabase
      .from("contatos")
      .select("id, nome, email, etapa, criado_em")
      .order("criado_em", { ascending: false })
      .order("id", { ascending: false }),
    listarEtapas(),
  ]);

  // "há 7 dias" é calculado aqui, no servidor, para o texto não mudar entre
  // a montagem da página e o que aparece na tela.
  const cartoes = (contatos || []).map((contato) => ({
    ...contato,
    tempo: tempoDesde(contato.criado_em),
  }));

  return (
    <Shell
      sessao={sessao}
      atual="funil"
      titulo="Funil"
      alturaCheia
      apoio="Arraste o contato para outra coluna para mover o negócio de etapa. Clique no nome para abrir a página dele."
      acao={
        <Link className="botao" href="/contatos">
          Novo contato
        </Link>
      }
    >
      {error ? (
        <p className="aviso-erro">Não foi possível carregar os contatos.</p>
      ) : etapas.length === 0 ? (
        <div className="cartao vazio" style={{ padding: "28px" }}>
          Nenhuma etapa cadastrada ainda. Crie a primeira em Etapas.
        </div>
      ) : (
        <Kanban contatos={cartoes} etapas={etapas} />
      )}
    </Shell>
  );
}
