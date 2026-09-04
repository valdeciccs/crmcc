// Os números do funil. Conta a partir da mesma lista que a página já buscou,
// então não custa nenhuma consulta a mais e nunca fica fora de sincronia.
export default function PainelFunil({ contatos, etapas }) {
  const porEtapa = {};
  for (const contato of contatos) {
    porEtapa[contato.etapa] = (porEtapa[contato.etapa] || 0) + 1;
  }

  return (
    <div className="painel-funil">
      <div className="painel-item">
        <p className="painel-numero">{contatos.length}</p>
        <p className="painel-rotulo">Total de contatos</p>
      </div>

      {etapas.map((etapa) => (
        <div className="painel-item" key={etapa.id}>
          <p className={`painel-numero cor-${etapa.cor}`}>{porEtapa[etapa.nome] || 0}</p>
          <p className="painel-rotulo">{etapa.nome}</p>
        </div>
      ))}
    </div>
  );
}
