"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { ConfirmActionDrawer } from "./ConfirmActionDrawer";
import { IconActionButton } from "./IconActionButton";
import { cancelPendingOrder } from "@/modules/orders/actions";

type CancelOrderButtonProps = {
  orderId: string;
};

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconActionButton
        label="Annuler la commande"
        icon={XCircle}
        variant="danger"
        onClick={() => setOpen(true)}
      />
      <ConfirmActionDrawer
        open={open}
        onOpenChange={setOpen}
        title="Annuler la commande"
        description="La commande passera en Échouée et les œuvres réservées redeviendront Disponibles."
        confirmLabel="Annuler la commande"
        variant="danger"
        onConfirm={async () => {
          const result = await cancelPendingOrder(orderId);
          if (!result.ok) throw new Error(result.error);
          router.refresh();
        }}
      />
    </>
  );
}
