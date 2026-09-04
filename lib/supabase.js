import { createClient } from "@supabase/supabase-js";

// Conexão com o banco no Supabase.
// Usa a chave secreta, então SÓ pode ser importado em código de servidor
// (Server Components, Server Actions, Route Handlers) — nunca no navegador.

const url = process.env.SUPABASE_URL;
const chave = process.env.SUPABASE_SECRET_KEY;

if (!url || !chave) {
  throw new Error(
    "Faltam SUPABASE_URL ou SUPABASE_SECRET_KEY no arquivo .env.local"
  );
}

export const supabase = createClient(url, chave);
