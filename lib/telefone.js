// Vai formatando o telefone enquanto a pessoa digita: 11 -> (11) 98877-1020.
// Corta em 11 dígitos, então não dá para digitar número gigante.
export function aplicarMascaraTelefone(valor) {
  const d = String(valor).replace(/\D/g, "").slice(0, 11);

  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// Confere se é um telefone brasileiro de verdade e devolve no padrão
// "(11) 98877-1020". Devolve null se não for válido.
export function normalizarTelefone(bruto) {
  let digitos = String(bruto).replace(/\D/g, "");

  // Tira o código do Brasil, se a pessoa tiver digitado
  if (digitos.startsWith("55") && (digitos.length === 12 || digitos.length === 13)) {
    digitos = digitos.slice(2);
  }

  // Fixo tem 10 dígitos (DDD + 8), celular tem 11 (DDD + 9)
  if (digitos.length !== 10 && digitos.length !== 11) return null;

  const ddd = digitos.slice(0, 2);
  if (Number(ddd) < 11) return null;

  const primeiroDigito = digitos[2];
  if (digitos.length === 11 && primeiroDigito !== "9") return null;
  if (digitos.length === 10 && !"2345".includes(primeiroDigito)) return null;

  const meio = digitos.length === 11 ? digitos.slice(2, 7) : digitos.slice(2, 6);
  return `(${ddd}) ${meio}-${digitos.slice(-4)}`;
}
