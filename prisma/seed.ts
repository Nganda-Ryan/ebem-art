import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const LABELS = [
  { slug: "peinture", name: "Peinture" },
  { slug: "sculpture", name: "Sculpture" },
  { slug: "contemporain", name: "Contemporain" },
  { slug: "abstrait", name: "Abstrait" },
  { slug: "figuratif", name: "Figuratif" },
  { slug: "memoire", name: "Mémoire" },
  { slug: "acrylique", name: "Acrylique" },
  { slug: "argile", name: "Argile" },
] as const;

async function upsertLabels() {
  const map = new Map<string, { id: string; slug: string; name: string }>();
  for (const label of LABELS) {
    const row = await prisma.label.upsert({
      where: { slug: label.slug },
      update: { name: label.name },
      create: label,
    });
    map.set(row.slug, row);
  }
  return map;
}

async function main() {
  const labels = await upsertLabels();
  console.log(`✅ ${labels.size} labels prêts`);

  const demoArtist = await prisma.artist.upsert({
    where: { slug: "jean-pierre-bekolo" },
    update: {
      labels: {
        set: [
          { slug: "peinture" },
          { slug: "contemporain" },
          { slug: "figuratif" },
        ],
      },
    },
    create: {
      slug: "jean-pierre-bekolo",
      name: "Jean-Pierre Bekolo",
      bio: "Artiste plasticien camerounais, connu pour ses peintures vibrantes inspirées de la culture urbaine de Douala.",
      city: "Douala",
      discipline: "Peinture",
      published: true,
      labels: {
        connect: [
          { slug: "peinture" },
          { slug: "contemporain" },
          { slug: "figuratif" },
        ],
      },
    },
  });

  console.log(`✅ Artiste de démo : ${demoArtist.name}`);

  const demoArtwork = await prisma.artwork.upsert({
    where: { slug: "thread-of-hope" },
    update: {
      labels: {
        set: [
          { slug: "peinture" },
          { slug: "contemporain" },
          { slug: "acrylique" },
          { slug: "memoire" },
        ],
      },
    },
    create: {
      slug: "thread-of-hope",
      title: "Thread of Hope",
      description:
        "Toile acrylique mêlant traditions camerounaises et esthétique contemporaine. Les fils dorés symbolisent la connexion entre passé et futur.",
      medium: "Acrylique sur toile",
      year: 2024,
      priceCents: 150000,
      currency: "XAF",
      status: "AVAILABLE",
      published: true,
      imageUrls: [],
      artistId: demoArtist.id,
      labels: {
        connect: [
          { slug: "peinture" },
          { slug: "contemporain" },
          { slug: "acrylique" },
          { slug: "memoire" },
        ],
      },
    },
  });

  console.log(`✅ Oeuvre de démo : ${demoArtwork.title}`);
  console.log("\n🎉 Seed terminé avec succès !");
  console.log("\nPour créer l'admin, lancez :");
  console.log(
    '  npx auth create-admin --email admin@ebem-art.com --name "Admin EBEM" --role admin',
  );
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
