import { supabase } from "../lib/supabase.js";
import { redirect } from "next/navigation";
import { usuarioAtivo } from "../lib/usuarios.js";
import FormularioContato from "./formulario-contato.js";
import ListaContatos from "./lista-contatos.js";
import Navbar from "./navbar.js";
import PainelFunil from "./painel-funil.js";

// A lista muda a cada cadastro, então a página é sempre montada na hora.
export const dynamic = "force-dynamic";

export default async function PaginaInicial() {
  // Conta apagada ou recusada perde o acesso na hora, mesmo com cookie válido.
  const sessao = await usuarioAtivo();
  if (!sessao) redirect("/sair");

  // Traz cada contato já com o histórico de anotações dele.
  const { data: contatos, error } = await supabase
    .from("contatos")
    .select("*, anotacoes(id, texto, criado_em)")
    .order("criado_em", { ascending: false })
    .order("id", { ascending: false })
    .order("criado_em", { referencedTable: "anotacoes", ascending: false });

  return (
    <>
      <Navbar sessao={sessao} atual="contatos" />

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 style={{ fontSize: "32px" }}>Contatos</h1>
        <p
          style={{
            marginTop: "12px",
            marginBottom: "32px",
            fontSize: "17px",
            color: "var(--texto-apoio)",
          }}
        >
          Contatos e oportunidades de negócio em um lugar só.
        </p>

        {!error && <PainelFunil contatos={contatos} />}

        <FormularioContato />

        <h2 style={{ fontSize: "18px", margin: "48px 0 18px" }}>
          Lista{contatos ? ` (${contatos.length})` : ""}
        </h2>

        {error ? (
          <p className="aviso-erro">Não foi possível carregar os contatos.</p>
        ) : contatos.length === 0 ? (
          <div className="cartao vazio" style={{ padding: "28px" }}>
            Nenhum contato cadastrado ainda.
          </div>
        ) : (
          <ListaContatos contatos={contatos} />
        )}
      </main>
    </>
  );
}
