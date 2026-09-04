import FormularioRegistro from "./formulario-registro.js";

export const metadata = { title: "Criar conta — Meu CRM" };

export default function PaginaDeRegistro() {
  return (
    <main className="tela-entrada">
      <div className="caixa-entrada">
        <p className="marca-entrada">Meu CRM</p>

        <h1 style={{ fontSize: "30px" }}>Criar conta</h1>
        <p
          style={{
            marginTop: "10px",
            marginBottom: "28px",
            fontSize: "16px",
            color: "var(--texto-apoio)",
          }}
        >
          Seu cadastro fica aguardando a aprovação do administrador.
        </p>

        <FormularioRegistro />
      </div>
    </main>
  );
}
