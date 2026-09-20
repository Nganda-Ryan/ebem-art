-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "artistName" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "birthPlace" TEXT,
ADD COLUMN     "culturalStatus" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profilePhotoUrl" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "artistPriceCents" INTEGER,
ADD COLUMN     "depthCm" DOUBLE PRECISION,
ADD COLUMN     "framed" BOOLEAN DEFAULT false,
ADD COLUMN     "heightCm" DOUBLE PRECISION,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "packaging" TEXT,
ADD COLUMN     "technique" TEXT,
ADD COLUMN     "titleTranslation" TEXT,
ADD COLUMN     "weightKg" DOUBLE PRECISION,
ADD COLUMN     "widthCm" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "_ArtistLabels" ADD CONSTRAINT "_ArtistLabels_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ArtistLabels_AB_unique";

-- AlterTable
ALTER TABLE "_ArtworkLabels" ADD CONSTRAINT "_ArtworkLabels_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ArtworkLabels_AB_unique";

-- CreateTable
CREATE TABLE "ArtistRequest" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "birthPlace" TEXT,
    "artistName" TEXT,
    "culturalStatus" TEXT,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "profilePhotoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "artistId" TEXT,

    CONSTRAINT "ArtistRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtworkRequest" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "title" TEXT NOT NULL,
    "titleTranslation" TEXT,
    "description" TEXT,
    "medium" TEXT,
    "technique" TEXT,
    "year" INTEGER,
    "priceCents" INTEGER NOT NULL,
    "artistPriceCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'XAF',
    "imageUrls" TEXT[],
    "workStatus" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "heightCm" DOUBLE PRECISION,
    "widthCm" DOUBLE PRECISION,
    "depthCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "framed" BOOLEAN DEFAULT false,
    "packaging" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artistId" TEXT NOT NULL,
    "artworkId" TEXT,

    CONSTRAINT "ArtworkRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArtistRequest" ADD CONSTRAINT "ArtistRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistRequest" ADD CONSTRAINT "ArtistRequest_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkRequest" ADD CONSTRAINT "ArtworkRequest_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkRequest" ADD CONSTRAINT "ArtworkRequest_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE SET NULL ON UPDATE CASCADE;
