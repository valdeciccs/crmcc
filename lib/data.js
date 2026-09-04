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
