/** Prefer catalog portrait, fall back to KYC profile photo */
export function artistPortraitUrl(artist: {
  portraitUrl?: string | null;
  profilePhotoUrl?: string | null;
}): string | null {
  return artist.portraitUrl || artist.profilePhotoUrl || null;
}

/** Cover image for cards / listings */
export function artworkCoverUrl(artwork: {
  imageUrls?: string[] | null;
  frontImageUrl?: string | null;
  detailImageUrls?: string[] | null;
  contextImageUrl?: string | null;
}): string | null {
  if (artwork.imageUrls?.[0]) return artwork.imageUrls[0];
  if (artwork.frontImageUrl) return artwork.frontImageUrl;
  if (artwork.detailImageUrls?.[0]) return artwork.detailImageUrls[0];
  if (artwork.contextImageUrl) return artwork.contextImageUrl;
  return null;
}

/** Full gallery in display order, deduplicated */
export function artworkGalleryUrls(artwork: {
  imageUrls?: string[] | null;
  frontImageUrl?: string | null;
  detailImageUrls?: string[] | null;
  contextImageUrl?: string | null;
}): string[] {
  const ordered = [
    artwork.frontImageUrl,
    ...(artwork.detailImageUrls ?? []),
    artwork.contextImageUrl,
    ...(artwork.imageUrls ?? []),
  ].filter((u): u is string => Boolean(u));

  return [...new Set(ordered)];
}
