"use client";

import { useActionState, useEffect, useState } from "react";
import { editarAnotacao, excluirAnotacao } from "./acoes.js";
import { formatarDataHora } from "../lib/data.js";

export default function Anotacao({ anotacao }) {
  // lendo | editando | confirmando (a exclusão)
  const [modo, setModo] = useState("lendo");
  const [texto, setTexto] = useState(anotacao.texto);

  const [edicao, salvarEdicao, salvando] = useActionState(editarAnotacao, {});
  const [exclusao, excluir, excluindo] = useActionState(excluirAnotacao, {});

  useEffect(() => {
    if (edicao.salvo) setModo("lendo");
  }, [edicao]);

  function cancelarEdicao() {
    setTexto(anotacao.texto);
    setModo("lendo");
  }

  return (
    <li>
      <div className="cabecalho-anotacao">
        <p className="data-anotacao">{formatarDataHora(anotacao.criado_em)}</p>

        {modo === "lendo" && (
          <div className="acoes-anotacao">
            <button type="button" className="botao-texto" onClick={() => setModo("editando")}>
              Editar
            </button>
            <button
              type="button"
              className="botao-texto perigo"
              onClick={() => setModo("confirmando")}
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      {modo === "editando" && (
        <form action={salvarEdicao} noValidate>
          <input type="hidden" name="id" value={anotacao.id} />
          <textarea
            className={`campo campo-texto ${edicao.erro ? "campo-invalido" : ""}`}
            name="texto"
            rows={3}
            maxLength={2000}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          {edicao.erro && <p className="erro-campo">{edicao.erro}</p>}
          <div className="acoes-anotacao" style={{ marginTop: "12px" }}>
            <button className="botao botao-pequeno" type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" className="botao-texto" onClick={cancelarEdicao}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {modo === "confirmando" && (
        <>
          <p className="texto-anotacao">{anotacao.texto}</p>
          <form action={excluir} className="confirmacao">
            <input type="hidden" name="id" value={anotacao.id} />
            <span>Excluir esta anotação? Não dá para desfazer.</span>
            <button className="botao botao-pequeno botao-perigo" type="submit" disabled={excluindo}>
              {excluindo ? "Excluindo..." : "Sim, excluir"}
            </button>
            <button type="button" className="botao-texto" onClick={() => setModo("lendo")}>
              Cancelar
            </button>
          </form>
          {exclusao.erro && <p className="erro-campo">{exclusao.erro}</p>}
        </>
      )}

      {modo === "lendo" && <p className="texto-anotacao">{anotacao.texto}</p>}
    </li>
  );
}
