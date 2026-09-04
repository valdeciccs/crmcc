"use client";

import Link from "next/link";
import { useActionState } from "react";
import { entrar } from "../acoes-sessao.js";

export default function FormularioLogin() {
  const [estado, enviar, entrando] = useActionState(entrar, {});

  return (
    <form action={enviar} noValidate className="cartao" style={{ padding: "28px" }}>
      <div style={{ marginBottom: "18px" }}>
        <label className="rotulo" htmlFor="usuario">
          Usuário
        </label>
        <input
          className="campo"
          id="usuario"
          name="usuario"
          type="text"
          autoComplete="username"
          autoFocus
        />
      </div>

      <div>
        <label className="rotulo" htmlFor="senha">
          Senha
        </label>
        <input
          className="campo"
          id="senha"
          name="senha"
          type="password"
          autoComplete="current-password"
        />
      </div>

      {estado.erro && (
        <p className="aviso-erro" style={{ margin: "20px 0 0" }}>
          {estado.erro}
        </p>
      )}

      <button
        className="botao"
        type="submit"
        disabled={entrando}
        style={{ marginTop: "24px", width: "100%" }}
      >
        {entrando ? "Entrando..." : "Entrar"}
      </button>

      <p className="link-alternativo">
        Não tem cadastro? <Link href="/registrar">Criar conta</Link>
      </p>
    </form>
  );
}
