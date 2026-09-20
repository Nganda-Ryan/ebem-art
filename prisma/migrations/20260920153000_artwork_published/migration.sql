-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false;

-- Keep existing catalog artworks visible on the storefront
UPDATE "Artwork" SET "published" = true;
