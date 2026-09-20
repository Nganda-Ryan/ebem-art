-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArtworkLabels" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ArtistLabels" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Label_slug_key" ON "Label"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ArtworkLabels_AB_unique" ON "_ArtworkLabels"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtworkLabels_B_index" ON "_ArtworkLabels"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArtistLabels_AB_unique" ON "_ArtistLabels"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtistLabels_B_index" ON "_ArtistLabels"("B");

-- AddForeignKey
ALTER TABLE "_ArtworkLabels" ADD CONSTRAINT "_ArtworkLabels_A_fkey" FOREIGN KEY ("A") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtworkLabels" ADD CONSTRAINT "_ArtworkLabels_B_fkey" FOREIGN KEY ("B") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistLabels" ADD CONSTRAINT "_ArtistLabels_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistLabels" ADD CONSTRAINT "_ArtistLabels_B_fkey" FOREIGN KEY ("B") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;
