"use client";

import { useActionState, useEffect, useState } from "react";
import { criarEtapa } from "../acoes-etapas.js";
import { CORES_DE_ETAPA } from "../../lib/constantes.js";

export default function FormularioEtapa({ proximaOrdem }) {
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("cinza");
  const [ordem, setOrdem] = useState(String(proximaOrdem));
  const [estado, enviar, enviando] = useActionState(criarEtapa, {});

  const erros = estado.erros || {};

  useEffect(() => {
    // Só limpa quando salva. Se deu erro, o que foi digitado continua na tela.
    if (estado.salvo) {
      setNome("");
      setCor("cinza");
      // O número seguinte ao que acabou de ser usado, para ir emendando.
      setOrdem(String((Number(ordem) || 0) + 1));
    }
  }, [estado]);

  return (
    <form
      action={enviar}
      noValidate
      className="cartao"
      style={{ padding: "28px", maxWidth: "760px" }}
    >
      <h2 style={{ fontSize: "18px", marginBottom: "22px" }}>Nova etapa</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "18px",
        }}
      >
        <div>
          <label className="rotulo" htmlFor="nome-etapa">
            Nome
          </label>
          <input
            className={`campo ${erros.nome ? "campo-invalido" : ""}`}
            id="nome-etapa"
            name="nome"
            type="text"
            maxLength={30}
            autoComplete="off"
            placeholder="negociação"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          {erros.nome && <p className="erro-campo">{erros.nome}</p>}
        </div>

        <div>
          <label className="rotulo" htmlFor="cor-etapa">
            Cor
          </label>
          <select
            className={`campo ${erros.cor ? "campo-invalido" : ""}`}
            id="cor-etapa"
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
          <label className="rotulo" htmlFor="ordem-etapa">
            Ordem
          </label>
          <input
            className={`campo ${erros.ordem ? "campo-invalido" : ""}`}
            id="ordem-etapa"
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

      <p style={{ margin: "16px 0 0", fontSize: "14px", color: "var(--texto-apoio)" }}>
        Prévia: <span className={`etiqueta cor-${cor}`}>{nome || "nome da etapa"}</span>
      </p>

      {erros.geral && (
        <p className="aviso-erro" style={{ margin: "20px 0 0" }}>
          {erros.geral}
        </p>
      )}

      <button className="botao" type="submit" disabled={enviando} style={{ marginTop: "24px" }}>
        {enviando ? "Salvando..." : "Criar etapa"}
      </button>
    </form>
  );
}
