// Mostra a data do banco no jeito brasileiro: "03/09/2026 às 17:29".
// O fuso é fixo para o servidor e o navegador escreverem exatamente igual.
const FORMATO = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

export function formatarDataHora(iso) {
  const partes = FORMATO.formatToParts(new Date(iso));
  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]));
  return `${p.day}/${p.month}/${p.year} às ${p.hour}:${p.minute}`;
}

// Há quanto tempo a pessoa é contato, a partir da data de cadastro.
// Só é chamado no servidor, para o texto não mudar entre a montagem e a tela.
export function tempoDesde(iso) {
  const dias = Math.floor((Date.now() - new Date(iso)) / 86400000);

  if (dias <= 0) return "hoje";
  if (dias === 1) return "há 1 dia";
  if (dias < 30) return `há ${dias} dias`;

  const meses = Math.floor(dias / 30);
  if (meses === 1) return "há 1 mês";
  if (meses < 12) return `há ${meses} meses`;

  const anos = Math.floor(dias / 365);
  return anos <= 1 ? "há 1 ano" : `há ${anos} anos`;
}
