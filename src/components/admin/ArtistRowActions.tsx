"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  Ban,
  ShieldCheck,
  EyeOff,
  Eye,
  Plus,
} from "lucide-react";
import { ArtistFormDrawer, type ArtistFormValues } from "./ArtistFormDrawer";
import { ConfirmActionDrawer } from "./ConfirmActionDrawer";
import { IconActionButton } from "./IconActionButton";
import {
  deleteArtist,
  setArtistBanned,
  setArtistPublished,
} from "@/modules/artists/actions";

type ArtistRowActionsProps = {
  artist: ArtistFormValues & {
    id: string;
    published: boolean;
    banned?: boolean;
    hasUser?: boolean;
  };
};

export function ArtistRowActions({ artist }: ArtistRowActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [banOpen, setBanOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-0.5">
        <IconActionButton
          label="Éditer"
          icon={Pencil}
          onClick={() => setEditOpen(true)}
        />
        <IconActionButton
          label={artist.published ? "Désactiver (retirer du storefront)" : "Activer (publier sur le storefront)"}
          icon={artist.published ? EyeOff : Eye}
          onClick={() => setPublishOpen(true)}
        />
        {artist.hasUser !== false && (
          <IconActionButton
            label={artist.banned ? "Débloquer le compte" : "Bloquer le compte"}
            icon={artist.banned ? ShieldCheck : Ban}
            variant="warning"
            onClick={() => setBanOpen(true)}
          />
        )}
        <IconActionButton
          label="Supprimer"
          icon={Trash2}
          variant="danger"
          onClick={() => setDeleteOpen(true)}
        />
      </div>

      <ArtistFormDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={artist}
      />

      <ConfirmActionDrawer
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer l'artiste"
        description={`Supprimer définitivement « ${artist.name} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        variant="danger"
        onConfirm={async () => {
          const result = await deleteArtist(artist.id);
          if (!result.ok) throw new Error(result.error);
          router.refresh();
        }}
      />

      <ConfirmActionDrawer
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title={artist.published ? "Désactiver l'artiste" : "Activer l'artiste"}
        description={
          artist.published
            ? `Retirer « ${artist.name} » du storefront ?`
            : `Publier « ${artist.name} » sur le storefront ?`
        }
        confirmLabel={artist.published ? "Désactiver" : "Activer"}
        variant="warning"
        onConfirm={async () => {
          const result = await setArtistPublished(artist.id, !artist.published);
          if (!result.ok) throw new Error(result.error);
          router.refresh();
        }}
      />

      <ConfirmActionDrawer
        open={banOpen}
        onOpenChange={setBanOpen}
        title={artist.banned ? "Débloquer le compte" : "Bloquer le compte"}
        description={
          artist.banned
            ? `Réactiver le compte lié à « ${artist.name} » ?`
            : `Bloquer le compte lié à « ${artist.name} » ? L'artiste ne pourra plus se connecter.`
        }
        confirmLabel={artist.banned ? "Débloquer" : "Bloquer"}
        variant="danger"
        onConfirm={async () => {
          const result = await setArtistBanned(artist.id, !artist.banned);
          if (!result.ok) throw new Error(result.error);
          router.refresh();
        }}
      />
    </>
  );
}

type NewArtistButtonProps = {
  className?: string;
};

export function NewArtistButton({ className }: NewArtistButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        title="Nouvel artiste"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        }
      >
        <Plus className="h-4 w-4" />
        Nouvel artiste
      </button>
      <ArtistFormDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
