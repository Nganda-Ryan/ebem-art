import { NextResponse } from "next/server";
import { searchCatalog } from "@/modules/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  try {
    const results = await searchCatalog(q);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { artworks: [], artists: [], error: "Recherche indisponible." },
      { status: 500 }
    );
  }
}
