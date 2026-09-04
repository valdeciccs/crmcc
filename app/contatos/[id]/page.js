import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "../../../lib/supabase.js";
import { usuarioAtivo } from "../../../lib/usuarios.js";
import { listarEtapas } from "../../../lib/etapas.js";
import { formatarDataHora, tempoDesde } from "../../../lib/data.js";
import Shell from "../../shell.js";
import SeletorEtapa from "../../seletor-etapa.js";
import PainelAnotacoes from "../../painel-anotacoes.js";
import PainelFollowUps from "../../painel-follow-ups.js";

// Etapa, anotações e follow-ups mudam aqui mesmo: a página é montada na hora.
export const dynamic = "force-dynamic";
export const metadata = { title: "Contato — Meu CRM" };

export default async function PaginaContato({ params }) {
  // Conta apagada ou recusada perde o acesso na hora, mesmo com cookie válido.
  const sessao = await usuarioAtivo();
  if (!sessao) redirect("/sair");

  const { id } = await params;
  const numero = Number(id);

  // Tudo do contato numa consulta só: dados, anotações e follow-ups.
  const [busca, etapas] = await Promise.all([
    Number.isInteger(numero) && numero > 0
      ? supabase
          .from("contatos")
          .select("*, anotacoes(id, texto, criado_em), follow_ups(id, texto, criado_em)")
          .eq("id", numero)
          .order("criado_em", { referencedTable: "anotacoes", ascending: false })
          .order("criado_em", { referencedTable: "follow_ups", ascending: false })
          .maybeSingle()
      : { data: null },
    listarEtapas(),
  ]);

  // Falha de banco não é o mesmo que contato inexistente: o motivo real fica
  // no terminal do servidor, senão some sem deixar rastro.
  if (busca.error) {
    console.error("Falha ao carregar contato:", busca.error.code, busca.error.message);
  }

  const contato = busca.data;

  // Contato apagado (ou endereço digitado errado): avisa e mostra a saída.
  if (!contato) {
    return (
      <Shell
        sessao={sessao}
        atual="contatos"
        titulo="Contato não encontrado"
        apoio="Esse contato não existe mais, ou o endereço está errado."
      >
        <div className="cartao vazio" style={{ padding: "28px" }}>
          <p style={{ margin: "0 0 16px" }}>
            Pode ter sido apagado por alguém, ou o link está quebrado.
          </p>
          <Link className="botao" href="/contatos">
            Voltar para Contatos
          </Link>
        </div>
      </Shell>
    );
  }

  const anotacoes = contato.anotacoes || [];
  const followUps = contato.follow_ups || [];

  return (
    <Shell
      sessao={sessao}
      atual="contatos"
      titulo={contato.nome}
      apoio={`Seu contato ${tempoDesde(contato.criado_em)}, desde ${formatarDataHora(contato.criado_em)}.`}
    >
      <Link className="link-voltar" href="/contatos">
        ← Todos os contatos
      </Link>

      <div className="cartao ficha">
        <div className="ficha-linha">
          <span className="ficha-rotulo">Email</span>
          <span className={contato.email ? undefined : "vazio"}>{contato.email || "—"}</span>
        </div>
        <div className="ficha-linha">
          <span className="ficha-rotulo">Telefone</span>
          <span className={contato.telefone ? "mono" : "vazio"}>{contato.telefone || "—"}</span>
        </div>
        <div className="ficha-linha">
          <span className="ficha-rotulo">Etapa</span>
          <SeletorEtapa contato={contato} etapas={etapas} />
        </div>
      </div>

      <section className="secao">
        <h2 className="secao-titulo">
          Anotações <span className="mono">({anotacoes.length})</span>
        </h2>
        <PainelAnotacoes contato={contato} anotacoes={anotacoes} comTitulo={false} />
      </section>

      <section className="secao">
        <h2 className="secao-titulo">
          Follow-ups <span className="mono">({followUps.length})</span>
        </h2>
        <PainelFollowUps contato={contato} followUps={followUps} />
      </section>
    </Shell>
  );
}
