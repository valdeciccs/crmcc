"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { mudarEtapaContato } from "./acoes.js";
import SeletorEtapa from "./seletor-etapa.js";

// Uma coluna por etapa, um cartão por contato. Arrastar o cartão para outra
// coluna já salva a etapa nova. Em tela estreita, onde arrastar não funciona
// no toque, o próprio cartão traz o seletor de etapa.
export default function Kanban({ contatos, etapas }) {
  const [estado, mudar] = useActionState(mudarEtapaContato, {});
  // Enquanto o servidor responde, o cartão já aparece na coluna nova.
  const [movidos, setMovidos] = useState({});
  const [arrastando, setArrastando] = useState(null);
  const [alvo, setAlvo] = useState(null);

  // Veio resposta: quem manda de novo é o que está no banco.
  useEffect(() => {
    if (estado.salvo || estado.erro) setMovidos({});
  }, [estado]);

  function etapaDe(contato) {
    return movidos[contato.id] || contato.etapa;
  }

  function soltar(evento, etapa) {
    evento.preventDefault();
    setAlvo(null);
    setArrastando(null);

    const id = Number(evento.dataTransfer.getData("text/plain"));
    const contato = contatos.find((procurado) => procurado.id === id);

    // Soltou fora, ou soltou na coluna de onde saiu: não há o que salvar.
    if (!contato || etapaDe(contato) === etapa) return;

    setMovidos((antes) => ({ ...antes, [id]: etapa }));

    const dados = new FormData();
    dados.set("id", String(id));
    dados.set("etapa", etapa);
    startTransition(() => mudar(dados));
  }

  return (
    <>
      {estado.erro && <p className="aviso-erro">{estado.erro}</p>}

      <div className="kanban">
        {etapas.map((etapa) => {
          const daColuna = contatos.filter((contato) => etapaDe(contato) === etapa.nome);

          return (
            <section
              key={etapa.id}
              className={`coluna ${alvo === etapa.nome ? "coluna-alvo" : ""}`}
              // Sem o preventDefault o navegador não deixa soltar nada aqui.
              onDragOver={(evento) => {
                evento.preventDefault();
                setAlvo(etapa.nome);
              }}
              onDrop={(evento) => soltar(evento, etapa.nome)}
            >
              <header className="topo-coluna">
                <span className={`ponto-etapa cor-${etapa.cor}`} aria-hidden="true" />
                <h2 className="nome-coluna">{etapa.nome}</h2>
                <span className="mono contagem-coluna">{daColuna.length}</span>
              </header>

              {/* Cartões demais rolam aqui dentro, e não na tela inteira. */}
              <div className="cartoes">
                {daColuna.length === 0 ? (
                  <p className="coluna-vazia">Arraste um contato para cá.</p>
                ) : (
                  daColuna.map((contato) => (
                    <article
                      key={contato.id}
                      className={`cartao-contato ${arrastando === contato.id ? "arrastando" : ""}`}
                      draggable
                      onDragStart={(evento) => {
                        setArrastando(contato.id);
                        evento.dataTransfer.setData("text/plain", String(contato.id));
                        evento.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnd={() => {
                        setArrastando(null);
                        setAlvo(null);
                      }}
                    >
                      {/* draggable={false} para o link não roubar o arrasto */}
                      <Link
                        className="nome-cartao"
                        href={`/contatos/${contato.id}`}
                        draggable={false}
                      >
                        {contato.nome}
                      </Link>

                      <p className={`email-cartao ${contato.email ? "" : "vazio"}`}>
                        {contato.email || "sem email"}
                      </p>
                      <p className="mono tempo-cartao">{contato.tempo}</p>

                      {/* No toque não dá para arrastar: o seletor faz o mesmo. */}
                      <div className="etapa-do-cartao">
                        <SeletorEtapa
                          key={etapaDe(contato)}
                          contato={{ ...contato, etapa: etapaDe(contato) }}
                          etapas={etapas}
                        />
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
