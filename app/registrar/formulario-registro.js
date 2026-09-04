"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registrar } from "../acoes-sessao.js";

export default function FormularioRegistro() {
  const [estado, enviar, enviando] = useActionState(registrar, {});
  const erros = estado.erros || {};

  if (estado.enviado) {
    return (
      <div className="cartao" style={{ padding: "28px" }}>
        <h2 style={{ fontSize: "18px" }}>Cadastro enviado</h2>
        <p style={{ margin: "10px 0 0", fontSize: "16px", color: "var(--texto-apoio)" }}>
          Assim que o administrador aprovar, você poderá entrar com esse usuário e senha.
        </p>
        <p style={{ margin: "20px 0 0", fontSize: "16px" }}>
          <Link href="/login">Ir para a tela de entrar</Link>
        </p>
      </div>
    );
  }

  return (
    <form action={enviar} noValidate className="cartao" style={{ padding: "28px" }}>
      <div style={{ marginBottom: "18px" }}>
        <label className="rotulo" htmlFor="usuario">
          Usuário
        </label>
        <input
          className={`campo ${erros.usuario ? "campo-invalido" : ""}`}
          id="usuario"
          name="usuario"
          type="text"
          maxLength={30}
          autoComplete="username"
          autoFocus
        />
        {erros.usuario && <p className="erro-campo">{erros.usuario}</p>}
      </div>

      <div style={{ marginBottom: "18px" }}>
        <label className="rotulo" htmlFor="senha">
          Senha
        </label>
        <input
          className={`campo ${erros.senha ? "campo-invalido" : ""}`}
          id="senha"
          name="senha"
          type="password"
          autoComplete="new-password"
        />
        {erros.senha && <p className="erro-campo">{erros.senha}</p>}
      </div>

      <div>
        <label className="rotulo" htmlFor="repetir_senha">
          Repetir a senha
        </label>
        <input
          className={`campo ${erros.repetir_senha ? "campo-invalido" : ""}`}
          id="repetir_senha"
          name="repetir_senha"
          type="password"
          autoComplete="new-password"
        />
        {erros.repetir_senha && <p className="erro-campo">{erros.repetir_senha}</p>}
      </div>

      {erros.geral && (
        <p className="aviso-erro" style={{ margin: "20px 0 0" }}>
          {erros.geral}
        </p>
      )}

      <button
        className="botao"
        type="submit"
        disabled={enviando}
        style={{ marginTop: "24px", width: "100%" }}
      >
        {enviando ? "Enviando..." : "Criar conta"}
      </button>

      <p className="link-alternativo">
        Já tem cadastro? <Link href="/login">Entrar</Link>
      </p>
    </form>
  );
}
