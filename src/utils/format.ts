export function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat("es-ES", { year: "numeric", month: "long", day: "2-digit" }).format(d);
}

export function sortByDateDesc<T extends { date: string }>(items: T[]) {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : -1));
}
