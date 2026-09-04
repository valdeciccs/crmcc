import { redirect } from "next/navigation";
import { supabase } from "../../lib/supabase.js";
import { usuarioAtivo } from "../../lib/usuarios.js";
import Navbar from "../navbar.js";
import ListaUsuarios from "./lista-usuarios.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Usuários — Meu CRM" };

export default async function PaginaDeUsuarios() {
  // Segunda tranca, conferida no banco: conta ativa e papel de admin.
  const admin = await usuarioAtivo();
  if (!admin) redirect("/sair");
  if (admin.papel !== "admin") redirect("/");

  const sessao = admin;

  const { data: usuarios, error } = await supabase
    .from("usuarios")
    .select("id, usuario, papel, situacao, criado_em")
    .order("criado_em", { ascending: false });

  const pendentes = (usuarios || []).filter((u) => u.situacao === "pendente");

  return (
    <>
      <Navbar sessao={sessao} atual="usuarios" />

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 style={{ fontSize: "32px" }}>Usuários</h1>
        <p
          style={{
            marginTop: "12px",
            marginBottom: "40px",
            fontSize: "17px",
            color: "var(--texto-apoio)",
          }}
        >
          Quem se cadastra entra como pendente e só acessa o sistema depois que você aprova.
          {pendentes.length > 0 && ` No momento há ${pendentes.length} aguardando.`}
        </p>

        {error ? (
          <p className="aviso-erro">Não foi possível carregar os usuários.</p>
        ) : (
          <ListaUsuarios usuarios={usuarios} euId={admin.id} />
        )}
      </main>
    </>
  );
}
