export function formatPrice(amount: number, currency = "FCFA"): string {
  return `${amount.toLocaleString("fr-FR")} ${currency}`;
}

export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return count === 1 ? singular : plural;
}

/** Appends a suffix when count !== 1 (e.g. "S" → "ŒUVRES"). */
export function pluralSuffix(count: number, suffix = "S"): string {
  return count === 1 ? "" : suffix;
}
