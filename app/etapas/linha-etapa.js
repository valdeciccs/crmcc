"use client";

import { useActionState, useEffect, useState } from "react";
import { editarEtapa, excluirEtapa } from "../acoes-etapas.js";
import { CORES_DE_ETAPA } from "../../lib/constantes.js";

export default function LinhaEtapa({ etapa, quantosContatos, unica }) {
  // lendo | editando | confirmando (a exclusão)
  const [modo, setModo] = useState("lendo");
  const [nome, setNome] = useState(etapa.nome);
  const [cor, setCor] = useState(etapa.cor);
  const [ordem, setOrdem] = useState(String(etapa.ordem));

  const [edicao, salvarEdicao, salvando] = useActionState(editarEtapa, {});
  const [exclusao, excluir, excluindo] = useActionState(excluirEtapa, {});

  const erros = edicao.erros || {};

  useEffect(() => {
    if (edicao.salvo) setModo("lendo");
  }, [edicao]);

  function cancelarEdicao() {
    setNome(etapa.nome);
    setCor(etapa.cor);
    setOrdem(String(etapa.ordem));
    setModo("lendo");
  }

  if (modo === "editando") {
    return (
      <tr>
        <td colSpan={5}>
          <form action={salvarEdicao} noValidate>
            <input type="hidden" name="id" value={etapa.id} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: "18px",
                maxWidth: "620px",
              }}
            >
              <div>
                <label className="rotulo" htmlFor={`nome-${etapa.id}`}>
                  Nome
                </label>
                <input
                  className={`campo ${erros.nome ? "campo-invalido" : ""}`}
                  id={`nome-${etapa.id}`}
                  name="nome"
                  type="text"
                  maxLength={30}
                  autoComplete="off"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                {erros.nome && <p className="erro-campo">{erros.nome}</p>}
              </div>

              <div>
                <label className="rotulo" htmlFor={`cor-${etapa.id}`}>
                  Cor
                </label>
                <select
                  className={`campo ${erros.cor ? "campo-invalido" : ""}`}
                  id={`cor-${etapa.id}`}
                  name="cor"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                >
                  {CORES_DE_ETAPA.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                      {opcao.rotulo}
                    </option>
                  ))}
                </select>
                {erros.cor && <p className="erro-campo">{erros.cor}</p>}
              </div>

              <div>
                <label className="rotulo" htmlFor={`ordem-${etapa.id}`}>
                  Ordem
                </label>
                <input
                  className={`campo ${erros.ordem ? "campo-invalido" : ""}`}
                  id={`ordem-${etapa.id}`}
                  name="ordem"
                  type="number"
                  min={0}
                  max={999}
                  value={ordem}
                  onChange={(e) => setOrdem(e.target.value)}
                />
                {erros.ordem && <p className="erro-campo">{erros.ordem}</p>}
              </div>
            </div>

            {quantosContatos > 0 && nome !== etapa.nome && (
              <p style={{ margin: "14px 0 0", fontSize: "14px", color: "var(--texto-apoio)" }}>
                {quantosContatos === 1
                  ? "1 contato vai junto para o nome novo."
                  : `${quantosContatos} contatos vão junto para o nome novo.`}
              </p>
            )}

            {erros.geral && (
              <p className="aviso-erro" style={{ margin: "14px 0 0" }}>
                {erros.geral}
              </p>
            )}

            <div className="acoes-anotacao" style={{ marginTop: "16px" }}>
              <button className="botao botao-pequeno" type="submit" disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button type="button" className="botao-texto" onClick={cancelarEdicao}>
                Cancelar
              </button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>
        <span className={`etiqueta cor-${etapa.cor}`}>{etapa.nome}</span>
      </td>
      <td className="vazio">
        {CORES_DE_ETAPA.find((opcao) => opcao.valor === etapa.cor)?.rotulo || etapa.cor}
      </td>
      <td className="mono">{etapa.ordem}</td>
      <td className={quantosContatos ? "mono" : "vazio mono"}>{quantosContatos}</td>
      <td>
        {modo === "confirmando" ? (
          <form action={excluir} className="acoes-anotacao">
            <input type="hidden" name="id" value={etapa.id} />
            <button className="botao botao-pequeno botao-perigo" type="submit" disabled={excluindo}>
              {excluindo ? "Apagando..." : "Confirmar exclusão"}
            </button>
            <button type="button" className="botao-texto" onClick={() => setModo("lendo")}>
              Cancelar
            </button>
          </form>
        ) : (
          <div className="acoes-anotacao">
            <button type="button" className="botao-texto" onClick={() => setModo("editando")}>
              Editar
            </button>
            {!unica && quantosContatos === 0 && (
              <button
                type="button"
                className="botao-texto perigo"
                onClick={() => setModo("confirmando")}
              >
                Apagar
              </button>
            )}
          </div>
        )}
        {exclusao.erro && <p className="erro-campo">{exclusao.erro}</p>}
      </td>
    </tr>
  );
}
