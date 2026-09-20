"use client";

import { useState } from "react";
import { AdminDrawer } from "./AdminDrawer";

type ConfirmActionDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => Promise<void> | void;
};

export function ConfirmActionDrawer({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
  onConfirm,
}: ConfirmActionDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  const confirmClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : variant === "warning"
        ? "bg-amber-600 hover:bg-amber-700 text-white"
        : "bg-gray-900 hover:bg-gray-700 text-white";

  return (
    <AdminDrawer
      open={open}
      onOpenChange={(next) => {
        if (!loading) {
          setError(null);
          onOpenChange(next);
        }
      }}
      title={title}
      description={description}
      footer={
        <div className="flex flex-col gap-2">
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleConfirm}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 ${confirmClass}`}
            >
              {loading ? "En cours…" : confirmLabel}
            </button>
          </div>
        </div>
      }
    >
      <p className="text-sm text-gray-600">
        Cette action sera appliquée immédiatement.
      </p>
    </AdminDrawer>
  );
}
