import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import type Stripe from "stripe";

/**
 * Fulfill an order after Stripe confirms payment.
 * Idempotent: checks for duplicate event ID before side-effects.
 */
export async function fulfillOrder(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  if (!session.metadata?.orderId) {
    console.warn("Webhook received without orderId in metadata:", session.id);
    return;
  }

  const orderId = session.metadata.orderId;

  // Check idempotency - StripeEvent with this event.id must not exist yet
  const existing = await db.stripeEvent.findUnique({ where: { id: event.id } });
  if (existing) {
    // Already processed - respond 200, do nothing
    return;
  }

  // Record the event + fulfill in a transaction
  await db.$transaction(async (tx: Prisma.TransactionClient) => {
    // Insert event (will fail on duplicate - idempotent guard)
    await tx.stripeEvent.create({
      data: { id: event.id, type: event.type },
    });

    // Mark order as PAID
    await tx.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    // Mark all artworks in this order as SOLD
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (order) {
      const artworkIds = order.items.map(
        (item: { artworkId: string }) => item.artworkId
      );
      await tx.artwork.updateMany({
        where: { id: { in: artworkIds } },
        data: { status: "SOLD" },
      });

      // Update order email from Stripe session
      if (session.customer_details?.email) {
        await tx.order.update({
          where: { id: orderId },
          data: { email: session.customer_details.email },
        });
      }
    }
  });
}

/**
 * Handle expired/abandoned checkout sessions.
 * Release RESERVED artwork back to AVAILABLE.
 */
export async function handleExpiredSession(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  if (!session.metadata?.orderId) return;

  const orderId = session.metadata.orderId;

  const existing = await db.stripeEvent.findUnique({ where: { id: event.id } });
  if (existing) return;

  await db.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.stripeEvent.create({
      data: { id: event.id, type: event.type },
    });

    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (order && order.status === "PENDING") {
      const artworkIds = order.items.map(
        (item: { artworkId: string }) => item.artworkId
      );
      await tx.artwork.updateMany({
        where: { id: { in: artworkIds } },
        data: { status: "AVAILABLE" },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });
    }
  });
}
