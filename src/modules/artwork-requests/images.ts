/** Build catalog imageUrls from typed authenticity photos */
export function composeArtworkImageUrls(input: {
  frontImageUrl: string;
  detailImageUrls?: string[] | null;
  contextImageUrl?: string | null;
}): string[] {
  return [
    input.frontImageUrl,
    ...(input.detailImageUrls ?? []),
    ...(input.contextImageUrl ? [input.contextImageUrl] : []),
  ];
}

export const PACKAGING_OPTIONS = [
  { value: "ROULEE", label: "Roulée (toiles)" },
  { value: "CHASSIS", label: "Sur châssis" },
  { value: "CAISSE_BOIS", label: "Caisse bois" },
] as const;

export type PackagingValue = (typeof PACKAGING_OPTIONS)[number]["value"];

export const PACKAGING_LABELS: Record<string, string> = {
  ROULEE: "Roulée (toiles)",
  CHASSIS: "Sur châssis",
  CAISSE_BOIS: "Caisse bois",
};
