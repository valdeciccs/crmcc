import FormularioRegistro from "./formulario-registro.js";

export const metadata = { title: "Criar conta — Meu CRM" };

export default function PaginaDeRegistro() {
  return (
    <main style={{ maxWidth: "420px", margin: "0 auto", padding: "96px 24px" }}>
      <h1 style={{ fontSize: "34px" }}>Criar conta</h1>
      <p
        style={{
          marginTop: "10px",
          marginBottom: "32px",
          fontSize: "17px",
          color: "var(--texto-apoio)",
        }}
      >
        Seu cadastro fica aguardando a aprovação do administrador.
      </p>

      <FormularioRegistro />
    </main>
  );
}
