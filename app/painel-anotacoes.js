"use client";

import { useActionState, useEffect, useState } from "react";
import { criarAnotacao } from "./acoes.js";
import Anotacao from "./anotacao.js";

// Na lista de contatos o título diz de quem é a anotação. Na página do
// contato o nome já está no alto da tela, então o título sai.
export default function PainelAnotacoes({ contato, anotacoes, comTitulo = true }) {
  const [texto, setTexto] = useState("");
  const [estado, enviar, enviando] = useActionState(criarAnotacao, {});

  useEffect(() => {
    if (estado.salvo) setTexto("");
  }, [estado]);

  return (
    <div style={{ maxWidth: "640px" }}>
      {comTitulo && (
        <h3 style={{ fontSize: "15px", marginBottom: "16px" }}>
          Anotações de {contato.nome}
        </h3>
      )}

      {anotacoes.length === 0 ? (
        <p className="vazio" style={{ margin: "0 0 20px", fontSize: "15px" }}>
          Nenhuma anotação ainda. Escreva a primeira abaixo.
        </p>
      ) : (
        <ul className="lista-anotacoes">
          {anotacoes.map((anotacao) => (
            <Anotacao key={anotacao.id} anotacao={anotacao} />
          ))}
        </ul>
      )}

      <form action={enviar} noValidate>
        <input type="hidden" name="contato_id" value={contato.id} />

        <label className="rotulo" htmlFor={`anotacao-${contato.id}`}>
          Nova anotação
        </label>
        <textarea
          className={`campo campo-texto ${estado.erro ? "campo-invalido" : ""}`}
          id={`anotacao-${contato.id}`}
          name="texto"
          rows={3}
          maxLength={2000}
          placeholder="O que foi conversado?"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        {estado.erro && <p className="erro-campo">{estado.erro}</p>}

        <button className="botao" type="submit" disabled={enviando} style={{ marginTop: "14px" }}>
          {enviando ? "Salvando..." : "Salvar anotação"}
        </button>
      </form>
    </div>
  );
}
