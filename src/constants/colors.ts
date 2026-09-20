export const COLORS = {
  bg: "#F7F3EE",
  bgAlt: "#EDE7DC",
  bgCard: "#FFFFFF",
  border: "#DDD5C8",
  ink: "#1A1410",
  inkMid: "#4A3D30",
  muted: "#9E8E7A",
  terra: "#C55C2E",
  terraHover: "#A84A22",
  gold: "#B07D20",
  goldLight: "#C9922A",
} as const;

export type ColorToken = keyof typeof COLORS;
