-- AlterTable ArtistRequest: storytelling bio
ALTER TABLE "ArtistRequest" ADD COLUMN "bio" TEXT;

-- AlterTable Artist: link to auth user
ALTER TABLE "Artist" ADD COLUMN "userId" TEXT;

-- AlterTable Artwork: typed photos
ALTER TABLE "Artwork" ADD COLUMN "frontImageUrl" TEXT,
ADD COLUMN "detailImageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "contextImageUrl" TEXT;

-- AlterTable ArtworkRequest: typed photos
ALTER TABLE "ArtworkRequest" ADD COLUMN "frontImageUrl" TEXT,
ADD COLUMN "detailImageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "contextImageUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Artist_userId_key" ON "Artist"("userId");

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
