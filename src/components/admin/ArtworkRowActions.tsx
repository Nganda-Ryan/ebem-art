"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  Ban,
  EyeOff,
  Eye,
  RotateCcw,
  Globe,
  GlobeLock,
  Plus,
} from "lucide-react";
import {
  ArtworkFormDrawer,
  type ArtistOption,
  type ArtworkFormValues,
  type LabelOption,
} from "./ArtworkFormDrawer";
import { ConfirmActionDrawer } from "./ConfirmActionDrawer";
import { IconActionButton } from "./IconActionButton";
import {
  deleteArtwork,
  setArtworkPublished,
  setArtworkStatus,
} from "@/modules/artworks/actions";

type ArtworkRowActionsProps = {
  artwork: ArtworkFormValues & {
    id: string;
    status: string;
    published: boolean;
  };
  artists: ArtistOption[];
  labels: LabelOption[];
};

export function ArtworkRowActions({
  artwork,
  artists,
  labels,
}: ArtworkRowActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [forceAvailableOpen, setForceAvailableOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  const isAvailable = artwork.status === "AVAILABLE";
  const isExhibiting = artwork.status === "EXHIBITING";
  const isLocked =
    artwork.status === "RESERVED" || artwork.status === "SOLD";

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-0.5">
        <IconActionButton
          label="Éditer"
          icon={Pencil}
          onClick={() => setEditOpen(true)}
        />
        <IconActionButton
          label={artwork.published ? "Dépublier du catalogue" : "Publier sur le catalogue"}
          icon={artwork.published ? GlobeLock : Globe}
          variant={artwork.published ? "warning" : "success"}
          onClick={() => setPublishOpen(true)}
        />
        {(isAvailable || isExhibiting) && (
          <IconActionButton
            label={isAvailable ? "Désactiver (hors vente)" : "Réactiver (disponible)"}
            icon={isAvailable ? EyeOff : Eye}
            onClick={() => setDeactivateOpen(true)}
          />
        )}
        {isAvailable && (
          <IconActionButton
            label="Bloquer l'œuvre"
            icon={Ban}
            variant="warning"
            onClick={() => setBlockOpen(true)}
          />
        )}
        {isLocked && (
          <IconActionButton
            label="Forcer Disponible"
            icon={RotateCcw}
            variant="warning"
            onClick={() => setForceAvailableOpen(true)}
          />
        )}
        <IconActionButton
          label="Supprimer"
          icon={Trash2}
          variant="danger"
          onClick={() => setDeleteOpen(true)}
        />
      </div>

      <ArtworkFormDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={artwork}
        artists={artists}
        labels={labels}
      />

      <ConfirmActionDrawer
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer l'œuvre"
        description={`Supprimer définitivement « ${artwork.title} » ?`}
        confirmLabel="Supprimer"
        variant="danger"
        onConfirm={async () => {
          const result = await deleteArtwork(artwork.id);
          if (!result.ok) throw new Error(result.error);
          router.refresh();
        }}
      />

      <ConfirmActionDrawer
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title={artwork.published ? "Dépublier l'œuvre" : "Publier l'œuvre"}
        description={
          artwork.published
            ? `Retirer « ${artwork.title} » du catalogue public ?`
            : `Publier « ${artwork.title} » sur le catalogue public ? (indépendant de l'approbation de demande)`
        }
        confirmLabel={artwork.published ? "Dépublier" : "Publier"}
        variant={artwork.published ? "warning" : "default"}
        onConfirm={async () => {
          const result = await setArtworkPublished(
            artwork.id,
            !artwork.published
          );
          if (!result.ok) throw new Error(result.error);
          router.refresh();
        }}
      />

      <ConfirmActionDrawer
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title={isAvailable ? "Désactiver l'œuvre" : "Réactiver l'œuvre"}
        description={
          isAvailable
            ? `Passer « ${artwork.title} » en Exposition (hors vente) ?`
            : `Remettre « ${artwork.title} » en Disponible ?`
        }
        confirmLabel={isAvailable ? "Désactiver" : "Réactiver"}
        variant="warning"
        onConfirm={async () => {
          const result = await setArtworkStatus(
            artwork.id,
            isAvailable ? "EXHIBITING" : "AVAILABLE"
          );
          if (!result.ok) throw new Error(result.error);
          router.refresh();
        }}
      />

      <ConfirmActionDrawer
        open={blockOpen}
        onOpenChange={setBlockOpen}
        title="Bloquer l'œuvre"
        description={`Bloquer « ${artwork.title} » (hors vente) ?`}
        confirmLabel="Bloquer"
        variant="danger"
        onConfirm={async () => {
          const result = await setArtworkStatus(artwork.id, "EXHIBITING");
          if (!result.ok) throw new Error(result.error);
          router.refresh();
        }}
      />

      <ConfirmActionDrawer
        open={forceAvailableOpen}
        onOpenChange={setForceAvailableOpen}
        title="Forcer Disponible"
        description={`« ${artwork.title} » est ${artwork.status}. Forcer le statut Disponible ?`}
        confirmLabel="Forcer"
        variant="warning"
        onConfirm={async () => {
          const result = await setArtworkStatus(artwork.id, "AVAILABLE", {
            force: true,
          });
          if (!result.ok) throw new Error(result.error);
          router.refresh();
        }}
      />
    </>
  );
}

type NewArtworkButtonProps = {
  artists: ArtistOption[];
  labels: LabelOption[];
  defaultArtistId?: string;
  className?: string;
};

export function NewArtworkButton({
  artists,
  labels,
  defaultArtistId,
  className,
}: NewArtworkButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        title="Nouvelle œuvre"
        onClick={() => setOpen(true)}
        disabled={artists.length === 0}
        className={
          className ??
          "inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        }
      >
        <Plus className="h-4 w-4" />
        Nouvelle œuvre
      </button>
      <ArtworkFormDrawer
        open={open}
        onOpenChange={setOpen}
        artists={artists}
        labels={labels}
        defaultArtistId={defaultArtistId}
      />
    </>
  );
}