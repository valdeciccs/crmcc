"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { gerarFollowUp } from "./acoes-ia.js";

export default function FollowUp({ contato, gerarAoAbrir = false }) {
  const [estado, gerar, gerando] = useActionState(gerarFollowUp, {});
  const [copia, setCopia] = useState("");

  // Abriu pela coluna Follow-up: já começa a escrever, sem clique extra.
  useEffect(() => {
    if (!gerarAoAbrir) return;
    const dados = new FormData();
    dados.set("contato_id", String(contato.id));
    startTransition(() => gerar(dados));
  }, []);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(estado.mensagem);
      setCopia("feito");
      setTimeout(() => setCopia(""), 2000);
    } catch {
      // Alguns navegadores bloqueiam a cópia automática.
      setCopia("falhou");
    }
  }

  return (
    <div className="bloco-followup" style={{ maxWidth: "640px" }}>
      <h3 style={{ fontSize: "15px", marginBottom: "16px" }}>
        Follow-up para {contato.nome}
      </h3>

      {gerando && (
        <p className="escrevendo" aria-live="polite">
          A IA está escrevendo a mensagem...
        </p>
      )}

      {!gerando && estado.erro && <p className="erro-campo">{estado.erro}</p>}

      {!gerando && estado.mensagem && (
        <div className="cartao mensagem-ia">
          <p className="texto-anotacao">{estado.mensagem}</p>
          <button type="button" className="botao-texto" onClick={copiar}>
            {copia === "feito" ? "Copiado!" : "Copiar mensagem"}
          </button>
          {copia === "falhou" && (
            <p className="erro-campo">
              Seu navegador não deixou copiar. Selecione o texto acima e copie com Ctrl+C.
            </p>
          )}
        </div>
      )}

      <form action={gerar} style={{ marginTop: "16px" }}>
        <input type="hidden" name="contato_id" value={contato.id} />
        <button className="botao botao-pequeno" type="submit" disabled={gerando}>
          {gerando ? "Escrevendo..." : estado.mensagem ? "Gerar outra" : "Gerar follow-up"}
        </button>
      </form>
    </div>
  );
}
