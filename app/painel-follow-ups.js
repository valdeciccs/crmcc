"use client";

import { useActionState, useState } from "react";
import { gerarFollowUp } from "./acoes-ia.js";
import { formatarDataHora } from "../lib/data.js";

// Os follow-ups já escritos para este contato, do mais novo para o mais antigo,
// e o botão que pede um novo. Cada um fica guardado no banco com a data.
export default function PainelFollowUps({ contato, followUps }) {
  const [estado, gerar, gerando] = useActionState(gerarFollowUp, {});
  // Qual item acabou de ser copiado: { id, situacao }.
  const [copia, setCopia] = useState(null);

  async function copiar(item) {
    try {
      await navigator.clipboard.writeText(item.texto);
      setCopia({ id: item.id, situacao: "feito" });
      setTimeout(() => setCopia(null), 2000);
    } catch {
      // Alguns navegadores bloqueiam a cópia automática.
      setCopia({ id: item.id, situacao: "falhou" });
    }
  }

  return (
    <>
      <form action={gerar}>
        <input type="hidden" name="contato_id" value={contato.id} />
        <button className="botao" type="submit" disabled={gerando}>
          {gerando
            ? "Escrevendo..."
            : followUps.length > 0
              ? "Gerar outro follow-up"
              : "Gerar follow-up"}
        </button>
      </form>

      {gerando && (
        <p className="escrevendo" aria-live="polite">
          A IA está escrevendo a mensagem...
        </p>
      )}

      {!gerando && estado.erro && <p className="erro-campo">{estado.erro}</p>}
      {!gerando && estado.aviso && <p className="erro-campo">{estado.aviso}</p>}

      {followUps.length === 0 ? (
        <p className="vazio" style={{ marginTop: "20px", fontSize: "15px" }}>
          Nenhum follow-up gerado ainda. A IA escreve a partir das anotações acima.
        </p>
      ) : (
        <ul className="lista-followups">
          {followUps.map((item) => (
            <li key={item.id}>
              <div className="cabecalho-anotacao">
                <p className="data-anotacao">{formatarDataHora(item.criado_em)}</p>
                <div className="acoes-anotacao">
                  <button type="button" className="botao-texto" onClick={() => copiar(item)}>
                    {copia?.id === item.id && copia.situacao === "feito"
                      ? "Copiado!"
                      : "Copiar"}
                  </button>
                </div>
              </div>

              <p className="texto-anotacao">{item.texto}</p>

              {copia?.id === item.id && copia.situacao === "falhou" && (
                <p className="erro-campo">
                  Seu navegador não deixou copiar. Selecione o texto e copie com Ctrl+C.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
