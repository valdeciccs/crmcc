import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Transforma a senha em algo irreconhecível, do jeito certo:
// - "sal": um valor aleatório por senha, para duas senhas iguais virarem hashes diferentes
// - scrypt: propositalmente lento e pesado, para dificultar tentativa em massa
export function gerarHash(senha) {
  const sal = randomBytes(16).toString("hex");
  const hash = scryptSync(senha, sal, 64).toString("hex");
  return `${sal}:${hash}`;
}

// Confere a senha digitada contra o que está guardado.
// Não existe "desembaralhar": refazemos a conta e comparamos os resultados.
export function conferirSenha(senha, guardado) {
  if (!guardado || !guardado.includes(":")) return false;

  const [sal, hash] = guardado.split(":");
  const esperado = Buffer.from(hash, "hex");
  const calculado = scryptSync(senha, sal, 64);

  if (calculado.length !== esperado.length) return false;

  // Comparação de tempo constante: não entrega pistas pelo tempo de resposta
  return timingSafeEqual(calculado, esperado);
}
