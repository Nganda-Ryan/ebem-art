"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, GlobeLock, Pencil, Plus, Trash2 } from "lucide-react";
import {
  ArticleFormDrawer,
  type ArticleFormValues,
} from "./ArticleFormDrawer";
import { ConfirmActionDrawer } from "./ConfirmActionDrawer";
import { IconActionButton } from "./IconActionButton";
import { deleteArticle, setArticlePublished } from "@/modules/articles/actions";

type ArticleRowActionsProps = {
  article: ArticleFormValues & { id: string; published: boolean };
};

export function ArticleRowActions({ article }: ArticleRowActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-0.5">
        <IconActionButton
          label="Éditer"
          icon={Pencil}
          onClick={() => setEditOpen(true)}
        />
        <IconActionButton
          label={article.published ? "Dépublier" : "Publier"}
          icon={article.published ? GlobeLock : Globe}
          variant={article.published ? "warning" : "success"}
          onClick={() => setPublishOpen(true)}
        />
        <IconActionButton
          label="Supprimer"
          icon={Trash2}
          variant="danger"
          onClick={() => setDeleteOpen(true)}
        />
      </div>

      <ArticleFormDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={article}
      />

      <ConfirmActionDrawer
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer l'article"
        description={`Supprimer définitivement « ${article.title} » ?`}
        confirmLabel="Supprimer"
        variant="danger"
        onConfirm={async () => {
          const result = await deleteArticle(article.id);
          if (!result.ok) throw new Error(result.error);
          router.refresh();
        }}
      />

      <ConfirmActionDrawer
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title={article.published ? "Dépublier l'article" : "Publier l'article"}
        description={
          article.published
            ? `Retirer « ${article.title} » du site public ?`
            : `Publier « ${article.title} » sur le site ?`
        }
        confirmLabel={article.published ? "Dépublier" : "Publier"}
        variant={article.published ? "warning" : "default"}
        onConfirm={async () => {
          const result = await setArticlePublished(article.id, !article.published);
          if (!result.ok) throw new Error(result.error);
          router.refresh();
        }}
      />
    </>
  );
}

export function NewArticleButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        title="Nouvel article"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        <Plus className="h-4 w-4" />
        Nouvel article
      </button>
      <ArticleFormDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
