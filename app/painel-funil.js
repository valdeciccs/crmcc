// Os números do funil. Conta a partir da mesma lista que a página já buscou,
// então não custa nenhuma consulta a mais e nunca fica fora de sincronia.
const ETAPAS = [
  { chave: "novo", rotulo: "Novo", classe: "numero-novo" },
  { chave: "em contato", rotulo: "Em contato", classe: "numero-em-contato" },
  { chave: "proposta", rotulo: "Proposta", classe: "numero-proposta" },
  { chave: "cliente", rotulo: "Cliente", classe: "numero-cliente" },
];

export default function PainelFunil({ contatos }) {
  const porEtapa = {};
  for (const contato of contatos) {
    porEtapa[contato.etapa] = (porEtapa[contato.etapa] || 0) + 1;
  }

  return (
    <div className="cartao painel-funil">
      <div className="painel-item">
        <p className="painel-numero">{contatos.length}</p>
        <p className="painel-rotulo">Total de contatos</p>
      </div>

      {ETAPAS.map((etapa) => (
        <div className="painel-item" key={etapa.chave}>
          <p className={`painel-numero ${etapa.classe}`}>{porEtapa[etapa.chave] || 0}</p>
          <p className="painel-rotulo">{etapa.rotulo}</p>
        </div>
      ))}
    </div>
  );
}
