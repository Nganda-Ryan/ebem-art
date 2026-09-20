export type CartItem = {
  artworkId: string;
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  artistName: string;
};

export const CART_STORAGE_KEY = "ebem-art-cart";
