"use client";

import { useActionState, useEffect, useState } from "react";
import { aprovarUsuario, recusarUsuario } from "../acoes-usuarios.js";
import { formatarDataHora } from "../../lib/data.js";

const CLASSE_DA_SITUACAO = {
  pendente: "etiqueta-pendente",
  aprovado: "etiqueta-aprovado",
  recusado: "etiqueta-recusado",
};

export default function LinhaUsuario({ usuario, souEu }) {
  const [confirmando, setConfirmando] = useState(false);
  const [aprovacao, aprovar, aprovando] = useActionState(aprovarUsuario, {});
  const [recusa, recusar, recusando] = useActionState(recusarUsuario, {});

  const erro = aprovacao.erro || recusa.erro;

  // Recusou: volta a linha para o estado normal.
  useEffect(() => {
    if (recusa.salvo) setConfirmando(false);
  }, [recusa]);

  return (
    <tr>
      <td style={{ fontWeight: 700 }}>
        {usuario.usuario}
        {souEu && <span className="vazio" style={{ fontWeight: 400 }}> (você)</span>}
      </td>
      <td>{usuario.papel === "admin" ? "Administrador" : "Comum"}</td>
      <td>
        <span className={`etiqueta ${CLASSE_DA_SITUACAO[usuario.situacao]}`}>
          {usuario.situacao}
        </span>
      </td>
      <td className="vazio">{formatarDataHora(usuario.criado_em)}</td>
      <td>
        {souEu ? (
          <span className="vazio">—</span>
        ) : confirmando ? (
          <form action={recusar} className="acoes-anotacao">
            <input type="hidden" name="id" value={usuario.id} />
            <button className="botao botao-pequeno botao-perigo" type="submit" disabled={recusando}>
              {recusando ? "Recusando..." : "Confirmar recusa"}
            </button>
            <button type="button" className="botao-texto" onClick={() => setConfirmando(false)}>
              Cancelar
            </button>
          </form>
        ) : (
          <div className="acoes-anotacao">
            {usuario.situacao !== "aprovado" && (
              <form action={aprovar}>
                <input type="hidden" name="id" value={usuario.id} />
                <button className="botao botao-pequeno" type="submit" disabled={aprovando}>
                  {aprovando ? "Aprovando..." : "Aprovar"}
                </button>
              </form>
            )}
            {usuario.situacao !== "recusado" && (
              <button
                type="button"
                className="botao-texto perigo"
                onClick={() => setConfirmando(true)}
              >
                Recusar
              </button>
            )}
          </div>
        )}
        {erro && <p className="erro-campo">{erro}</p>}
      </td>
    </tr>
  );
}
