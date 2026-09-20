import type { FooterColumn, NavLink } from "@/types/landing";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "A propos", href: "/#a-propos" },
  { label: "Explorer", href: "/explorer" },
  { label: "Artistes", href: "/artistes" },
  { label: "Actualité", href: "/#actualite" },
  { label: "S'inscrire", href: "/inscription" },
  { label: "Contact", href: "/#newsletter" },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Explorer",
    links: [
      { label: "Collection", href: "/explorer" },
      { label: "Artistes", href: "/artistes" },
      { label: "Sculptures", href: "/explorer" },
      { label: "Peintures", href: "/explorer" },
      { label: "Par Région", href: "/explorer" },
    ],
  },
  {
    title: "Participer",
    links: [
      { label: "Ateliers", href: "/#ateliers" },
      { label: "Devenir Artiste", href: "/inscription" },
      { label: "Espace Artiste", href: "/connexion" },
      { label: "Soumettre une œuvre", href: "/artiste/oeuvres" },
      { label: "Presse", href: "#" },
      { label: "Contact", href: "/#newsletter" },
    ],
  },
];
