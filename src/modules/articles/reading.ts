/** Approximate reading time from body length (~200 words / minute). */
export function readingMinutes(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatArticleDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .toLocaleUpperCase("fr-FR");
}
