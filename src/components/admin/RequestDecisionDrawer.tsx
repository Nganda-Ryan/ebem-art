"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gavel } from "lucide-react";
import { AdminDrawer } from "./AdminDrawer";
import { IconActionButton } from "./IconActionButton";
import {
  approveArtistRequest,
  rejectArtistRequest,
} from "@/modules/artist-requests/actions";
import {
  approveArtworkRequest,
  rejectArtworkRequest,
} from "@/modules/artwork-requests/actions";

type RequestKind = "artist" | "artwork";

type RequestDecisionDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  kind: RequestKind;
  label?: string;
};

export function RequestDecisionDrawer({
  open,
  onOpenChange,
  requestId,
  kind,
  label,
}: RequestDecisionDrawerProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "reject">("choose");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setMode("choose");
    setNote("");
    setError(null);
    setLoading(false);
  }

  async function handleApprove() {
    setLoading(true);
    setError(null);
    try {
      if (kind === "artist") {
        await approveArtistRequest(requestId);
      } else {
        await approveArtworkRequest(requestId);
      }
      onOpenChange(false);
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approbation impossible.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!note.trim()) {
      setError("Veuillez entrer un motif de rejet.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (kind === "artist") {
        await rejectArtistRequest(requestId, note.trim());
      } else {
        await rejectArtworkRequest(requestId, note.trim());
      }
      onOpenChange(false);
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rejet impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminDrawer
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
      title="Décision"
      description={
        label
          ? `Traiter la demande : ${label}`
          : kind === "artist"
            ? "Approuver ou rejeter l'inscription artiste."
            : "Approuver ou rejeter la demande d'œuvre."
      }
    >
      <div className="space-y-4">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {mode === "choose" ? (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleApprove}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading
                ? "En cours…"
                : kind === "artwork"
                  ? "Approuver (sans publier)"
                  : "Approuver"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => setMode("reject")}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Rejeter
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Motif du rejet *
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                placeholder="Expliquez la raison du rejet…"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setMode("choose")}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Retour
              </button>
              <button
                type="button"
                disabled={loading || !note.trim()}
                onClick={handleReject}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "En cours…" : "Confirmer le rejet"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminDrawer>
  );
}

type RequestDecisionButtonProps = {
  requestId: string;
  kind: RequestKind;
  label?: string;
  /** Icon-only button (default) vs labeled */
  iconOnly?: boolean;
  className?: string;
};

export function RequestDecisionButton({
  requestId,
  kind,
  label,
  iconOnly = true,
  className,
}: RequestDecisionButtonProps) {
  const [open, setOpen] = useState(false);

  if (iconOnly) {
    return (
      <>
        <IconActionButton
          label="Décider (approuver / rejeter)"
          icon={Gavel}
          variant="primary"
          onClick={() => setOpen(true)}
          className={className}
        />
        <RequestDecisionDrawer
          open={open}
          onOpenChange={setOpen}
          requestId={requestId}
          kind={kind}
          label={label}
        />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        title="Décider (approuver / rejeter)"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        }
      >
        <Gavel className="h-4 w-4" />
        Décider
      </button>
      <RequestDecisionDrawer
        open={open}
        onOpenChange={setOpen}
        requestId={requestId}
        kind={kind}
        label={label}
      />
    </>
  );
}
