export function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || !Number.isFinite(d.getTime())) {
    return "Fecha no disponible";
  }
  // Date normaliza fechas imposibles, por ejemplo el 30 de febrero.
  if (
    d.getFullYear() !== Number(iso.slice(0, 4)) ||
    d.getMonth() + 1 !== Number(iso.slice(5, 7)) ||
    d.getDate() !== Number(iso.slice(8, 10))
  ) {
    return "Fecha no disponible";
  }
  return new Intl.DateTimeFormat("es-ES", { year: "numeric", month: "long", day: "2-digit" }).format(d);
}

export function sortByDateDesc<T extends { date: string }>(items: T[]) {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : -1));
}
