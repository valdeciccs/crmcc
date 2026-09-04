import { redirect } from "next/navigation";
import { supabase } from "../../lib/supabase.js";
import { usuarioAtivo } from "../../lib/usuarios.js";
import { listarEtapas } from "../../lib/etapas.js";
import Shell from "../shell.js";
import FormularioContato from "../formulario-contato.js";
import ListaContatos from "../lista-contatos.js";

// A lista muda a cada cadastro, então a página é sempre montada na hora.
export const dynamic = "force-dynamic";
export const metadata = { title: "Contatos — Meu CRM" };

export default async function PaginaContatos() {
  // Conta apagada ou recusada perde o acesso na hora, mesmo com cookie válido.
  const sessao = await usuarioAtivo();
  if (!sessao) redirect("/sair");

  // Traz cada contato já com o histórico de anotações dele.
  const [{ data: contatos, error }, etapas] = await Promise.all([
    supabase
      .from("contatos")
      .select("*, anotacoes(id, texto, criado_em)")
      .order("criado_em", { ascending: false })
      .order("id", { ascending: false })
      .order("criado_em", { referencedTable: "anotacoes", ascending: false }),
    listarEtapas(),
  ]);

  return (
    <Shell
      sessao={sessao}
      atual="contatos"
      titulo="Contatos"
      apoio="Cadastre um contato novo e veja todo mundo que já está na base."
    >
      <FormularioContato etapas={etapas} />

      <h2 style={{ fontSize: "16px", margin: "48px 0 16px" }}>
        Lista {!error && <span className="mono">({contatos.length})</span>}
      </h2>

      {error ? (
        <p className="aviso-erro">Não foi possível carregar os contatos.</p>
      ) : contatos.length === 0 ? (
        <div className="cartao vazio" style={{ padding: "28px" }}>
          Nenhum contato cadastrado ainda.
        </div>
      ) : (
        <ListaContatos contatos={contatos} etapas={etapas} />
      )}
    </Shell>
  );
}
