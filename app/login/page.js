import FormularioLogin from "./formulario-login.js";

export const metadata = { title: "Entrar — Meu CRM" };

export default function PaginaDeLogin() {
  return (
    <main
      style={{
        maxWidth: "420px",
        margin: "0 auto",
        padding: "96px 24px",
      }}
    >
      <h1 style={{ fontSize: "34px" }}>Meu CRM</h1>
      <p
        style={{
          marginTop: "10px",
          marginBottom: "32px",
          fontSize: "17px",
          color: "var(--texto-apoio)",
        }}
      >
        Entre para acessar seus contatos.
      </p>

      <FormularioLogin />
    </main>
  );
}
