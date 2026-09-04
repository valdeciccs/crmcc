// Gera o hash de uma senha (para a tabela usuarios) e um segredo de sessão.
// A senha é digitada aqui, vira hash na hora e não é gravada em lugar nenhum.
// Uso: node --no-warnings scripts/gerar-senha.mjs
import { createInterface } from "node:readline/promises";
import { randomBytes } from "node:crypto";
import { gerarHash } from "../lib/senha.js";

const leitor = createInterface({ input: process.stdin, output: process.stdout });

console.log("\n--- Gerador de senha do CRM ---");
console.log("O que você digitar aparece na tela (você está na sua máquina).");
console.log("A senha não é gravada, não vai para o histórico e não sai daqui.\n");

const senha = await leitor.question("Senha que você quer usar: ");
const repetida = await leitor.question("Digite de novo:           ");
leitor.close();

if (senha !== repetida) {
  console.error("\nAs duas senhas não são iguais. Rode o comando de novo.\n");
  process.exit(1);
}
if (senha.length < 8) {
  console.error("\nUse pelo menos 8 caracteres. Rode o comando de novo.\n");
  process.exit(1);
}

console.log("\n=== Hash da senha ===");
console.log("Vai na coluna senha_hash da tabela usuarios, no Supabase:\n");
console.log(gerarHash(senha));

console.log("\n=== Segredo de sessão (só se você ainda não tiver um) ===");
console.log("Vai no arquivo .env.local:\n");
console.log(`CRM_SEGREDO_SESSAO=${randomBytes(32).toString("hex")}`);
console.log("");
