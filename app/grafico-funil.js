// A distribuição do funil em barras. Sem biblioteca de gráfico: cada barra é
// uma div com a largura em porcentagem, na cor da etapa. A maior etapa ocupa
// a barra inteira e as outras aparecem em proporção a ela.
export default function GraficoFunil({ contatos, etapas }) {
  const porEtapa = {};
  for (const contato of contatos) {
    porEtapa[contato.etapa] = (porEtapa[contato.etapa] || 0) + 1;
  }

  // O 1 evita dividir por zero quando todas as etapas estão vazias.
  const maior = Math.max(1, ...etapas.map((etapa) => porEtapa[etapa.nome] || 0));

  return (
    <div className="cartao bloco">
      <h2 className="bloco-titulo">Distribuição do funil</h2>

      {etapas.length === 0 ? (
        <p className="vazio" style={{ margin: 0, fontSize: "15px" }}>
          Nenhuma etapa cadastrada ainda. Crie a primeira em Etapas.
        </p>
      ) : contatos.length === 0 ? (
        <p className="vazio" style={{ margin: 0, fontSize: "15px" }}>
          Sem contatos ainda, não há distribuição para mostrar.
        </p>
      ) : (
        etapas.map((etapa) => {
          const quantos = porEtapa[etapa.nome] || 0;

          return (
            <div className="linha-grafico" key={etapa.id}>
              <span className="mono rotulo-grafico">{etapa.nome}</span>
              <div className="trilho">
                <div
                  className={`barra cor-${etapa.cor}`}
                  style={{ width: `${(quantos / maior) * 100}%` }}
                />
              </div>
              <span className="mono valor-grafico">{quantos}</span>
            </div>
          );
        })
      )}
    </div>
  );
}
