import Link from "next/link";
import { sair } from "./acoes-sessao.js";

// Esqueleto de todas as telas de dentro: cabeçalho em cima, navegação à
// esquerda, conteúdo à direita. "Usuários" só aparece para o admin.
const AREAS = [
  { chave: "dashboard", rotulo: "Dashboard", href: "/" },
  { chave: "funil", rotulo: "Funil", href: "/funil" },
  { chave: "contatos", rotulo: "Contatos", href: "/contatos" },
  { chave: "etapas", rotulo: "Etapas", href: "/etapas" },
  { chave: "usuarios", rotulo: "Usuários", href: "/usuarios", soAdmin: true },
];

// "acao" é opcional: um botão que fica na mesma linha do título da área.
// "alturaCheia" prende a tela na altura da janela, para ela não rolar.
export default function Shell({ sessao, atual, titulo, apoio, acao, alturaCheia, children }) {
  const areas = AREAS.filter((area) => !area.soAdmin || sessao.papel === "admin");

  return (
    <div className={`shell ${alturaCheia ? "altura-fixa" : ""}`}>
      <header className="cabecalho">
        <span className="marca">Meu CRM</span>

        <div className="cabecalho-direita">
          <span className="quem">{sessao.usuario}</span>
          <form action={sair}>
            <button className="botao-texto" type="submit">
              Sair
            </button>
          </form>
        </div>
      </header>

      <aside className="lateral">
        <nav className="nav">
          {areas.map((area) => (
            <Link
              key={area.chave}
              className={`nav-item ${atual === area.chave ? "ativo" : ""}`}
              href={area.href}
              aria-current={atual === area.chave ? "page" : undefined}
            >
              {area.rotulo}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="conteudo">
        <div className="conteudo-interno">
          <div className="cabecalho-area">
            <h1 className="titulo-area">{titulo}</h1>
            {acao}
          </div>
          <p className="apoio-area">{apoio}</p>
          {children}
        </div>
      </main>
    </div>
  );
}
