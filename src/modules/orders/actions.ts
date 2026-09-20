"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { stripe } from "@/lib/stripe";
import { checkoutSchema } from "./schemas";

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Initiate checkout from cart: create PENDING order, reserve artworks, redirect to Stripe.
 */
export async function initiateCheckout(data: { artworkIds: string[] }) {
  const parsed = checkoutSchema.parse(data);
  const artworkIds = [...new Set(parsed.artworkIds)];

  const artworks = await db.artwork.findMany({
    where: { id: { in: artworkIds } },
  });

  if (artworks.length !== artworkIds.length) {
    throw new Error("Une ou plusieurs œuvres sont introuvables.");
  }

  const unavailable = artworks.find(
    (a) => a.status !== "AVAILABLE" || !a.published
  );
  if (unavailable) {
    throw new Error(
      `« ${unavailable.title} » n'est plus disponible. Retirez-la du panier.`
    );
  }

  const currencies = new Set(artworks.map((a) => a.currency));
  if (currencies.size > 1) {
    throw new Error(
      "Le panier ne peut contenir qu'une seule devise à la fois."
    );
  }

  const totalCents = artworks.reduce((sum, a) => sum + a.priceCents, 0);
  const currency = artworks[0]!.currency.toLowerCase();

  const order = await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const newOrder = await tx.order.create({
      data: {
        email: "",
        totalCents,
        status: "PENDING",
        items: {
          create: artworks.map((artwork) => ({
            artworkId: artwork.id,
            unitPriceCents: artwork.priceCents,
            quantity: 1,
          })),
        },
      },
    });

    await tx.artwork.updateMany({
      where: { id: { in: artworkIds } },
      data: { status: "RESERVED" },
    });

    return newOrder;
  });

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: artworks.map((artwork) => ({
        price_data: {
          currency,
          product_data: {
            name: artwork.title,
            description: artwork.description ?? undefined,
            images: artwork.imageUrls.slice(0, 1),
          },
          unit_amount: artwork.priceCents,
        },
        quantity: 1,
      })),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/panier`,
      metadata: { orderId: order.id },
    });
  } catch (err) {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });
      await tx.artwork.updateMany({
        where: { id: { in: artworkIds } },
        data: { status: "AVAILABLE" },
      });
    });
    throw err instanceof Error
      ? err
      : new Error("Impossible de créer la session de paiement.");
  }

  await db.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return { url: session.url };
}

/** Cancel a PENDING order and release reserved artworks (admin) */
export async function cancelPendingOrder(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    const order = await db.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return { ok: false, error: "Commande introuvable." };
    }
    if (order.status !== "PENDING") {
      return {
        ok: false,
        error: "Seules les commandes en attente peuvent être annulées.",
      };
    }

    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.order.update({
        where: { id },
        data: { status: "FAILED" },
      });

      for (const item of order.items) {
        await tx.artwork.update({
          where: { id: item.artworkId },
          data: { status: "AVAILABLE" },
        });
      }
    });

    revalidatePath("/admin/commandes");
    revalidatePath(`/admin/commandes/${id}`);
    revalidatePath("/admin/oeuvres");
    revalidatePath("/oeuvres");
    revalidatePath("/explorer");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Annulation impossible.",
    };
  }
}
