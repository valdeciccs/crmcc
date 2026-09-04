"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { mudarEtapaContato } from "./acoes.js";

// A etiqueta de etapa virou seletor: escolher já salva, sem botão nenhum.
export default function SeletorEtapa({ contato, etapas }) {
  const [etapa, setEtapa] = useState(contato.etapa);
  const [estado, mudar, mudando] = useActionState(mudarEtapaContato, {});

  // Deu errado no servidor: a tela volta a mostrar a etapa que está no banco.
  useEffect(() => {
    if (estado.erro) setEtapa(contato.etapa);
  }, [estado]);

  const cor = etapas.find((cadastrada) => cadastrada.nome === etapa)?.cor || "cinza";

  function aoMudar(evento) {
    const escolhida = evento.target.value;
    setEtapa(escolhida);

    const dados = new FormData();
    dados.set("id", String(contato.id));
    dados.set("etapa", escolhida);
    startTransition(() => mudar(dados));
  }

  return (
    <>
      <select
        className={`selecao-etapa cor-${cor}`}
        value={etapa}
        onChange={aoMudar}
        disabled={mudando}
        aria-label={`Etapa de ${contato.nome}`}
      >
        {/* A etapa do contato pode ter sumido do cadastro noutra aba. */}
        {!etapas.some((cadastrada) => cadastrada.nome === etapa) && (
          <option value={etapa}>{etapa}</option>
        )}
        {etapas.map((cadastrada) => (
          <option key={cadastrada.id} value={cadastrada.nome}>
            {cadastrada.nome}
          </option>
        ))}
      </select>

      {estado.erro && <p className="erro-campo">{estado.erro}</p>}
    </>
  );
}
