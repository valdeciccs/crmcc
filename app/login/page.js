import FormularioLogin from "./formulario-login.js";

export const metadata = { title: "Entrar — Meu CRM" };

export default function PaginaDeLogin() {
  return (
    <main className="tela-entrada">
      <div className="caixa-entrada">
        <p className="marca-entrada">Meu CRM</p>

        <h1 style={{ fontSize: "30px" }}>Entrar</h1>
        <p
          style={{
            marginTop: "10px",
            marginBottom: "28px",
            fontSize: "16px",
            color: "var(--texto-apoio)",
          }}
        >
          Entre para acessar seus contatos.
        </p>

        <FormularioLogin />
      </div>
    </main>
  );
}
