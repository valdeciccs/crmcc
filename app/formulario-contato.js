"use client";

import { useActionState, useEffect, useState } from "react";
import { criarContato } from "./acoes.js";
import { aplicarMascaraTelefone } from "../lib/telefone.js";

export default function FormularioContato() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [estado, enviar, enviando] = useActionState(criarContato, {});

  // Campos mexidos depois do último envio: o aviso some assim que a pessoa corrige.
  const [corrigidos, setCorrigidos] = useState({});
  const erroDe = (campo) => (corrigidos[campo] ? null : (estado.erros || {})[campo]);

  useEffect(() => {
    setCorrigidos({});
    // Só limpa quando salva. Se deu erro, o que foi digitado continua na tela.
    if (estado.salvo) {
      setNome("");
      setEmail("");
      setTelefone("");
    }
  }, [estado]);

  function aoDigitar(campo, guardar) {
    return (valor) => {
      guardar(valor);
      setCorrigidos((antes) => ({ ...antes, [campo]: true }));
    };
  }

  const mudarNome = aoDigitar("nome", setNome);
  const mudarEmail = aoDigitar("email", setEmail);
  const mudarTelefone = aoDigitar("telefone", setTelefone);

  return (
    <form action={enviar} noValidate className="cartao" style={{ padding: "28px" }}>
      <h2 style={{ fontSize: "18px", marginBottom: "22px" }}>Novo contato</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "18px",
        }}
      >
        <div>
          <label className="rotulo" htmlFor="nome">
            Nome
          </label>
          <input
            className={`campo ${erroDe("nome") ? "campo-invalido" : ""}`}
            id="nome"
            name="nome"
            type="text"
            maxLength={80}
            autoComplete="off"
            value={nome}
            onChange={(e) => mudarNome(e.target.value)}
          />
          {erroDe("nome") && <p className="erro-campo">{erroDe("nome")}</p>}
        </div>

        <div>
          <label className="rotulo" htmlFor="email">
            Email
          </label>
          <input
            className={`campo ${erroDe("email") ? "campo-invalido" : ""}`}
            id="email"
            name="email"
            type="email"
            maxLength={120}
            placeholder="nome@empresa.com.br"
            autoComplete="off"
            value={email}
            onChange={(e) => mudarEmail(e.target.value)}
          />
          {erroDe("email") && <p className="erro-campo">{erroDe("email")}</p>}
        </div>

        <div>
          <label className="rotulo" htmlFor="telefone">
            Telefone
          </label>
          <input
            className={`campo ${erroDe("telefone") ? "campo-invalido" : ""}`}
            id="telefone"
            name="telefone"
            type="text"
            inputMode="numeric"
            placeholder="(11) 98877-1020"
            autoComplete="off"
            value={telefone}
            onChange={(e) => mudarTelefone(aplicarMascaraTelefone(e.target.value))}
          />
          {erroDe("telefone") && <p className="erro-campo">{erroDe("telefone")}</p>}
        </div>
      </div>

      {estado.erros?.geral && (
        <p className="aviso-erro" style={{ margin: "20px 0 0" }}>
          {estado.erros.geral}
        </p>
      )}

      <button className="botao" type="submit" disabled={enviando} style={{ marginTop: "24px" }}>
        {enviando ? "Salvando..." : "Salvar contato"}
      </button>
    </form>
  );
}
