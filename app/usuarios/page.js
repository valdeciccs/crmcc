import { redirect } from "next/navigation";
import { supabase } from "../../lib/supabase.js";
import { usuarioAtivo } from "../../lib/usuarios.js";
import Shell from "../shell.js";
import ListaUsuarios from "./lista-usuarios.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Usuários — Meu CRM" };

export default async function PaginaDeUsuarios() {
  // Segunda tranca, conferida no banco: conta ativa e papel de admin.
  const admin = await usuarioAtivo();
  if (!admin) redirect("/sair");
  if (admin.papel !== "admin") redirect("/");

  const { data: usuarios, error } = await supabase
    .from("usuarios")
    .select("id, usuario, papel, situacao, criado_em")
    .order("criado_em", { ascending: false });

  const pendentes = (usuarios || []).filter((u) => u.situacao === "pendente");

  const apoio = (
    <>
      Quem se cadastra entra como pendente e só acessa o sistema depois que você aprova.
      {pendentes.length > 0 && (
        <>
          {" "}
          No momento há <span className="mono">{pendentes.length}</span> aguardando.
        </>
      )}
    </>
  );

  return (
    <Shell sessao={admin} atual="usuarios" titulo="Usuários" apoio={apoio}>
      {error ? (
        <p className="aviso-erro">Não foi possível carregar os usuários.</p>
      ) : (
        <ListaUsuarios usuarios={usuarios} euId={admin.id} />
      )}
    </Shell>
  );
}
