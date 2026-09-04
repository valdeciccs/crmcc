import { NextResponse } from "next/server";
import { lerSessao } from "./lib/sessao.js";
import { NOME_DO_COOKIE } from "./lib/constantes.js";

// Telas que qualquer pessoa pode abrir sem estar logada
const PUBLICAS = ["/login", "/registrar"];

// Porteiro do sistema: roda antes de qualquer página, dado ou ação.
// Sem sessão válida, tudo cai no login.
export async function middleware(pedido) {
  const sessao = await lerSessao(pedido.cookies.get(NOME_DO_COOKIE)?.value);
  const caminho = pedido.nextUrl.pathname;
  const ehPublica = PUBLICAS.includes(caminho);

  if (!sessao && !ehPublica) {
    return NextResponse.redirect(new URL("/login", pedido.url));
  }
  if (sessao && ehPublica) {
    return NextResponse.redirect(new URL("/", pedido.url));
  }
  // Área de administração: só admin
  if (sessao && caminho.startsWith("/usuarios") && sessao.papel !== "admin") {
    return NextResponse.redirect(new URL("/", pedido.url));
  }
  return NextResponse.next();
}

export const config = {
  // Tudo, menos os arquivos internos do Next e o ícone do site
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
