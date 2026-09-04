"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import PainelAnotacoes from "./painel-anotacoes.js";
import FollowUp from "./follow-up.js";
import SeletorEtapa from "./seletor-etapa.js";

// A busca ignora acento e maiúscula: "jose" acha "José".
function achatar(texto) {
  return (texto || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

// E ignora a pontuação do telefone: "11988" acha "(11) 98877-1020".
function soDigitos(texto) {
  return (texto || "").replace(/\D/g, "");
}

export default function ListaContatos({ contatos, etapas, comBusca = false }) {
  // Qual linha está aberta e o que ela mostra: "anotacoes" ou "followup".
  const [aberto, setAberto] = useState(null);
  const [busca, setBusca] = useState("");

  function alternar(id, modo) {
    setAberto((antes) => (antes?.id === id && antes.modo === modo ? null : { id, modo }));
  }

  const procurado = achatar(busca.trim());
  const digitos = soDigitos(busca);

  const visiveis = procurado
    ? contatos.filter(
        (contato) =>
          achatar(contato.nome).includes(procurado) ||
          achatar(contato.email).includes(procurado) ||
          (digitos.length > 0 && soDigitos(contato.telefone).includes(digitos))
      )
    : contatos;

  return (
    <>
      {comBusca && (
        <div className="busca-contatos">
          <label className="rotulo" htmlFor="busca-contato">
            Buscar contato
          </label>
          <input
            className="campo"
            id="busca-contato"
            type="search"
            placeholder="Nome, email ou telefone"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
          {procurado && (
            <p className="resultado-busca">
              <span className="mono">
                {visiveis.length} de {contatos.length}
              </span>{" "}
              {contatos.length === 1 ? "contato" : "contatos"}
            </p>
          )}
        </div>
      )}

      {visiveis.length === 0 ? (
        <div className="cartao vazio" style={{ padding: "28px" }}>
          Nenhum contato encontrado para “{busca.trim()}”.
        </div>
      ) : (
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
              {visiveis.map((contato) => {
                const anotacoes = contato.anotacoes || [];
                const modoAberto = aberto?.id === contato.id ? aberto.modo : null;

                return (
                  <Fragment key={contato.id}>
                    <tr>
                      <td>
                        {/* O nome é a porta de entrada da página do contato. */}
                        <Link className="nome-contato" href={`/contatos/${contato.id}`}>
                          {contato.nome}
                        </Link>
                      </td>
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
      )}
    </>
  );
}
