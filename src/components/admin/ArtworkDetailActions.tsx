"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  EyeOff,
  Eye,
  RotateCcw,
  Globe,
  GlobeLock,
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

type ArtworkDetailActionsProps = {
  artwork: ArtworkFormValues & {
    id: string;
    status: string;
    published: boolean;
  };
  artists: ArtistOption[];
  labels: LabelOption[];
};

export function ArtworkDetailActions({
  artwork,
  artists,
  labels,
}: ArtworkDetailActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  const isAvailable = artwork.status === "AVAILABLE";
  const isExhibiting = artwork.status === "EXHIBITING";
  const isLocked =
    artwork.status === "RESERVED" || artwork.status === "SOLD";

  return (
    <>
      <div className="flex flex-wrap items-center gap-0.5">
        <IconActionButton
          label="Éditer"
          icon={Pencil}
          variant="primary"
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
        {isLocked && (
          <IconActionButton
            label="Forcer Disponible"
            icon={RotateCcw}
            variant="warning"
            onClick={() => setForceOpen(true)}
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
          router.push("/admin/oeuvres");
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
            : `Publier « ${artwork.title} » sur le catalogue public ?`
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
        open={forceOpen}
        onOpenChange={setForceOpen}
        title="Forcer Disponible"
        description={`Forcer « ${artwork.title} » en Disponible ?`}
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
