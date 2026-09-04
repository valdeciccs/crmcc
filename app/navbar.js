import Link from "next/link";
import { sair } from "./acoes-sessao.js";

// Barra fixa das telas internas. "Usuários" só aparece para o admin.
export default function Navbar({ sessao, atual }) {
  return (
    <nav className="navbar">
      <div className="navbar-conteudo">
        <div className="navbar-links">
          <span className="navbar-marca">Meu CRM</span>
          <Link className={`navbar-link ${atual === "contatos" ? "ativo" : ""}`} href="/">
            Contatos
          </Link>
          {sessao.papel === "admin" && (
            <Link className={`navbar-link ${atual === "usuarios" ? "ativo" : ""}`} href="/usuarios">
              Usuários
            </Link>
          )}
        </div>

        <div className="navbar-links">
          <span className="navbar-quem">{sessao.usuario}</span>
          <form action={sair}>
            <button className="botao-texto" type="submit">
              Sair
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
