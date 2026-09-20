export const HERO = {
  titleLines: ["L'Âme", "Créatrice", "du Cameroun"] as const,
  description:
    "Découvrez, collectionnez et soutenez les jeunes artistes plastiques camerounais. Une fenêtre sur une création en pleine renaissance.",
  primaryCta: "EXPLORER LA COLLECTION",
  secondaryCta: "RENCONTRER LES ARTISTES",
  slides: [
    {
      src: "/images/hero-gallery.jpg",
      alt: "Galerie d'art camerounaise",
      position: "center center",
    },
    {
      src: "/images/vase1.jpg",
      alt: "Céramique contemporaine camerounaise",
      position: "center center",
    },
    {
      src: "/images/vase2.jpg",
      alt: "Œuvre artisanale - collection Mboa Arts",
      position: "center center",
    },
  ] as const,
  tickerItems: [
    "✦ SCULPTURE",
    "✦ PEINTURE",
    "✦ BAFOUSSAM",
    "✦ DOUALA",
    "✦ YAOUNDÉ",
    "✦ GRAVURE",
    "✦ FOUMBAN",
    "✦ ARTS TRADITIONNELS",
  ] as const,
  artistCountTarget: 127,
  slideIntervalMs: 6000,
} as const;

export const SECTION_LABELS = {
  aPropos: {
    eyebrow: "À PROPOS",
    promoter: {
      name: "Eric Bem",
      role: "Fondateur · Mboa Arts",
      location: "Douala, Cameroun",
      /** Prefer a real portrait in production - stock faces weaken trust (NN/g). */
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&h=1100&fit=crop&auto=format",
      alt: "Portrait d'Eric Bem, fondateur de Mboa Arts",
    },
    /** Director’s note hook - belief before facts. */
    quote:
      "Une génération crée. Elle mérite une vitrine à la hauteur de son geste.",
    mission: {
      label: "Mission",
      text: "Donner aux jeunes plasticiens camerounais une présence claire - et aux collectionneurs un chemin simple vers l'œuvre.",
    },
    valeur: {
      label: "Valeur",
      text: "Sélection, contexte, prix affiché. Chaque acquisition soutient directement l'artiste. Pas d'intermédiaire opaque.",
    },
    continueLabel: "Découvrir le thème du jour",
    continueHref: "#actualite",
  },
  themeDuJour: {
    title: "Découvrez nos œuvres.",
    subtitle:
      "Notre collection rassemble les créations d'une génération de plasticiens camerounais.",
    cta: "Explorer par artiste, discipline et plus",
    ctaHref: "/explorer",
    promoEyebrow: "THÈME DU JOUR",
    promoHref: "#actualite",
    img: "/images/hero-gallery.jpg",
    imgAlt: "Galerie d'art camerounaise - collection Mboa Arts",
  },
  news: {
    date: "11 SEPTEMBRE 2026",
    title: "Actualités",
    subtitle: "Mis à jour chaque matin",
    relatedLabel: "Aussi dans le thème",
    readLabel: "Lire l'article",
    artistLabel: "Auteur de l'œuvre",
  },
  explorer: {
    code: "SECTION 02",
    title: "Explorer la Collection",
  },
  ctaIntermediaire: {
    eyebrow: "PROCHAINE ÉTAPE",
    title: "Une œuvre vous attend",
    description:
      "Vous avez parcouru la collection. Passez à la galerie - une pièce concrète, un geste clair.",
    ctaLabel: "PARCOURIR LA GALERIE",
    ctaHref: "#galerie",
  },
  ateliers: {
    code: "SECTION 03",
    title: "Ateliers Pratiques",
    description:
      "Apprenez directement auprès des artistes de la plateforme. Sessions en petit groupe, dans leurs ateliers.",
  },
  galerie: {
    code: "SECTION 04",
    title: "La Galerie",
    hint: "Survole pour découvrir",
  },
  temoignages: {
    code: "SECTION 05",
    title: "Ils ont collecté",
  },
  /** Kept for unmounted components (réemploi futur). */
  zoomArtiste: {
    code: "SECTION 02",
    title: "Zoom Artiste",
  },
  themes: {
    code: "SECTION 06",
    title: "Par Thème & Style",
    description: "Glissez pour explorer les univers de la création camerounaise.",
  },
  newsletter: {
    eyebrow: "RESTEZ CONNECTÉ",
    titleBefore: "Ne manquez aucune",
    titleEm: "œuvre",
    description:
      "Chaque semaine : le thème du jour, les nouvelles acquisitions, les ateliers à venir. La lettre des amateurs d'art camerounais.",
    disclaimer: "Pas de spam. Désabonnement en 1 clic.",
  },
} as const;

export const PRICE_FILTER = {
  /** At/above cheapest work so the slider alone never empties the grid. */
  min: 100_000,
  max: 700_000,
  step: 10_000,
  defaultMax: 700_000,
} as const;
