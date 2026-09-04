// A sessão vive num cookie assinado: o cookie diz quem entrou, com que papel
// e até quando, e leva uma assinatura que só o servidor consegue produzir.
// Sem tabela de sessões — e ninguém consegue forjar um cookie sem o segredo.
const TEXTO = new TextEncoder();

async function chaveDeAssinatura() {
  const segredo = process.env.CRM_SEGREDO_SESSAO;
  if (!segredo) return null;

  return crypto.subtle.importKey(
    "raw",
    TEXTO.encode(segredo),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function paraHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function deHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// base64url: guarda o conteúdo do cookie sem caracteres problemáticos
function paraBase64Url(texto) {
  let binario = "";
  for (const b of TEXTO.encode(texto)) binario += String.fromCharCode(b);
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function deBase64Url(base64) {
  const binario = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array([...binario].map((c) => c.charCodeAt(0)));
  return new TextDecoder().decode(bytes);
}

export async function criarSessao({ usuario, papel }, dias = 7) {
  const chave = await chaveDeAssinatura();
  if (!chave) throw new Error("Falta CRM_SEGREDO_SESSAO no .env.local");

  const conteudo = paraBase64Url(
    JSON.stringify({ usuario, papel, expiraEm: Date.now() + dias * 24 * 60 * 60 * 1000 })
  );
  const assinatura = await crypto.subtle.sign("HMAC", chave, TEXTO.encode(conteudo));
  return `${conteudo}.${paraHex(assinatura)}`;
}

export async function lerSessao(cookie) {
  if (!cookie) return null;

  const partes = cookie.split(".");
  if (partes.length !== 2) return null;

  const [conteudo, assinatura] = partes;
  if (!/^[0-9a-f]+$/.test(assinatura)) return null;

  // Sem segredo configurado, ninguém está logado — cai no login em vez de quebrar.
  const chave = await chaveDeAssinatura();
  if (!chave) return null;

  const valida = await crypto.subtle.verify(
    "HMAC",
    chave,
    deHex(assinatura),
    TEXTO.encode(conteudo)
  );
  if (!valida) return null;

  try {
    const dados = JSON.parse(deBase64Url(conteudo));
    if (!dados.usuario || !dados.papel) return null;
    if (!Number(dados.expiraEm) || Number(dados.expiraEm) < Date.now()) return null;
    return { usuario: dados.usuario, papel: dados.papel };
  } catch {
    return null;
  }
}
