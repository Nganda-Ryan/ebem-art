import { db } from "@/lib/db";

/** All labels (admin forms + explorer) */
export async function getAllLabels() {
  return db.label.findMany({
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true },
  });
}

export type LabelOption = Awaited<ReturnType<typeof getAllLabels>>[number];
