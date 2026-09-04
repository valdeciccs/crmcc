"use client";

import LinhaEtapa from "./linha-etapa.js";

export default function ListaEtapas({ etapas, usoDaEtapa }) {
  if (etapas.length === 0) {
    return (
      <div className="cartao vazio" style={{ padding: "28px" }}>
        Nenhuma etapa cadastrada. Sem pelo menos uma, não dá para cadastrar contatos.
      </div>
    );
  }

  return (
    <div className="cartao" style={{ overflowX: "auto" }}>
      <table className="tabela">
        <thead>
          <tr>
            <th>Etapa</th>
            <th>Cor</th>
            <th>Ordem</th>
            <th>Contatos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {etapas.map((etapa) => (
            <LinhaEtapa
              key={etapa.id}
              etapa={etapa}
              quantosContatos={usoDaEtapa[etapa.nome] || 0}
              unica={etapas.length === 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
