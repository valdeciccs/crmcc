import Link from "next/link";

// Os cinco cadastros mais recentes, cada um levando para a página do contato.
export default function UltimosContatos({ contatos, etapas }) {
  return (
    <div className="cartao bloco">
      <h2 className="bloco-titulo">Últimos contatos</h2>

      {contatos.length === 0 ? (
        <p className="vazio" style={{ margin: 0, fontSize: "15px" }}>
          Nenhum contato cadastrado ainda. Comece pela área de Contatos.
        </p>
      ) : (
        <ul className="lista-recentes">
          {contatos.map((contato) => {
            // A etapa pode ter sido renomeada noutra aba: sem cor, cai no cinza.
            const cor =
              etapas.find((etapa) => etapa.nome === contato.etapa)?.cor || "cinza";

            return (
              <li key={contato.id}>
                <div className="recente-quem">
                  <Link className="nome-recente" href={`/contatos/${contato.id}`}>
                    {contato.nome}
                  </Link>
                  <p className="recente-apoio">
                    {contato.email ? `${contato.email} · ` : ""}
                    cadastrado {contato.tempo}
                  </p>
                </div>

                <span className={`etiqueta cor-${cor}`}>{contato.etapa}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
