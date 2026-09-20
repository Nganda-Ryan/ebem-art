export type Discipline = "Sculpture" | "Peinture";

export type Artist = {
  id: number;
  name: string;
  discipline: Discipline;
  region: string;
  city: string;
  age: number;
  bio: string;
  quote: string;
  works: number;
  sold: number;
  img: string;
  tags: string[];
};

export type Artwork = {
  id: number;
  title: string;
  artist: string;
  discipline: Discipline;
  region: string;
  price: number;
  year: number;
  img: string;
  medium: string;
};

export type Workshop = {
  id: number;
  title: string;
  artist: string;
  date: string;
  duration: string;
  price: number;
  spots: number;
  remaining: number;
  level: string;
  location: string;
  img: string;
};

export type Theme = {
  label: string;
  count: number;
  color: string;
};

export type Testimonial = {
  text: string;
  author: string;
  role: string;
  acquired: string | null;
};

export type Story = {
  category: string;
  headline: string;
  sub: string;
  duration: string;
  img: string;
  artist: string;
};

export type GalleryItem = {
  img: string;
  title: string;
  artist: string;
  price: number;
};

export type HeroStat = {
  n: string;
  label: string;
  sub: string;
  animated?: boolean;
};

export type NavLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: NavLink[];
};
