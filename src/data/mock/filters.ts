export const FILTER_REGIONS = [
  "Tous",
  "Littoral",
  "Centre",
  "Ouest",
  "Nord",
  "Est",
  "Sud",
] as const;

export const FILTER_STYLES = ["Tous", "Peinture", "Sculpture"] as const;

export const HERO_STATS = [
  { n: "127", label: "Artistes", sub: "sur la plateforme", animated: true },
  { n: "842", label: "Œuvres", sub: "disponibles", animated: false },
  { n: "23", label: "Régions", sub: "représentées", animated: false },
] as const;
