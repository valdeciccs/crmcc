import { redirect } from "next/navigation";
import { supabase } from "../../lib/supabase.js";
import { usuarioAtivo } from "../../lib/usuarios.js";
import { listarEtapas } from "../../lib/etapas.js";
import Shell from "../shell.js";
import FormularioEtapa from "./formulario-etapa.js";
import ListaEtapas from "./lista-etapas.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Etapas — Meu CRM" };

export default async function PaginaDeEtapas() {
  // Conta apagada ou recusada perde o acesso na hora, mesmo com cookie válido.
  const sessao = await usuarioAtivo();
  if (!sessao) redirect("/sair");

  const [etapas, { data: contatos }] = await Promise.all([
    listarEtapas(),
    supabase.from("contatos").select("etapa"),
  ]);

  // Quantos contatos há em cada etapa: é o que decide se ela pode ser apagada.
  const usoDaEtapa = {};
  for (const contato of contatos || []) {
    usoDaEtapa[contato.etapa] = (usoDaEtapa[contato.etapa] || 0) + 1;
  }

  return (
    <Shell
      sessao={sessao}
      atual="etapas"
      titulo="Etapas"
      apoio="As etapas do seu funil. A ordem é a que aparece no Dashboard e nos seletores; renomear uma etapa leva os contatos dela junto."
    >
      <FormularioEtapa proximaOrdem={(etapas[etapas.length - 1]?.ordem || 0) + 1} />

      <h2 style={{ fontSize: "16px", margin: "48px 0 16px" }}>
        Cadastradas <span className="mono">({etapas.length})</span>
      </h2>

      <ListaEtapas etapas={etapas} usoDaEtapa={usoDaEtapa} />
    </Shell>
  );
}
