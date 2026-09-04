"use client";

import { Fragment, useState } from "react";
import PainelAnotacoes from "./painel-anotacoes.js";
import FollowUp from "./follow-up.js";
import SeletorEtapa from "./seletor-etapa.js";

export default function ListaContatos({ contatos, etapas }) {
  // Qual linha está aberta e o que ela mostra: "anotacoes" ou "followup".
  const [aberto, setAberto] = useState(null);

  function alternar(id, modo) {
    setAberto((antes) => (antes?.id === id && antes.modo === modo ? null : { id, modo }));
  }

  return (
    <div className="cartao" style={{ overflowX: "auto" }}>
      <table className="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Etapa</th>
            <th>Anotações</th>
            <th>Follow-up</th>
          </tr>
        </thead>
        <tbody>
          {contatos.map((contato) => {
            const anotacoes = contato.anotacoes || [];
            const modoAberto = aberto?.id === contato.id ? aberto.modo : null;

            return (
              <Fragment key={contato.id}>
                <tr>
                  <td style={{ fontWeight: 700 }}>{contato.nome}</td>
                  <td className={contato.email ? undefined : "vazio"}>
                    {contato.email || "—"}
                  </td>
                  <td className={contato.telefone ? "mono" : "vazio"}>
                    {contato.telefone || "—"}
                  </td>
                  <td>
                    <SeletorEtapa contato={contato} etapas={etapas} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="botao-texto"
                      aria-expanded={modoAberto === "anotacoes"}
                      onClick={() => alternar(contato.id, "anotacoes")}
                    >
                      {modoAberto === "anotacoes" ? (
                        "Fechar"
                      ) : (
                        <>
                          Ver <span className="mono">({anotacoes.length})</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="botao-texto"
                      aria-expanded={modoAberto === "followup"}
                      onClick={() => alternar(contato.id, "followup")}
                    >
                      {modoAberto === "followup" ? "Fechar" : "Gerar"}
                    </button>
                  </td>
                </tr>

                {modoAberto && (
                  <tr>
                    <td colSpan={6} className="linha-aberta">
                      {modoAberto === "anotacoes" ? (
                        <PainelAnotacoes contato={contato} anotacoes={anotacoes} />
                      ) : (
                        <FollowUp contato={contato} gerarAoAbrir />
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
