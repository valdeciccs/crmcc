"use client";

import LinhaUsuario from "./linha-usuario.js";

export default function ListaUsuarios({ usuarios, euId }) {
  if (usuarios.length === 0) {
    return (
      <div className="cartao vazio" style={{ padding: "28px" }}>
        Nenhum usuário cadastrado.
      </div>
    );
  }

  return (
    <div className="cartao" style={{ overflowX: "auto" }}>
      <table className="tabela">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Papel</th>
            <th>Situação</th>
            <th>Cadastrado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <LinhaUsuario key={usuario.id} usuario={usuario} souEu={usuario.id === euId} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
