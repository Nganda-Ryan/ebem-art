import { z } from "zod";

/** Schema for initiating checkout from the cart (one or more artworks) */
export const checkoutSchema = z.object({
  artworkIds: z.array(z.string().min(1)).min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
