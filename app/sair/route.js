import { NextResponse } from "next/server";
import { NOME_DO_COOKIE } from "../../lib/constantes.js";

// Apaga o cookie e devolve para o login.
// Existe como rota (e não só como ação) porque uma página não pode apagar
// cookies: quando a conta deixa de valer, a página manda o navegador aqui.
export async function GET(pedido) {
  const resposta = NextResponse.redirect(new URL("/login", pedido.url));
  resposta.cookies.delete(NOME_DO_COOKIE);
  return resposta;
}
