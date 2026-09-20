"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { COLORS } from "@/constants/colors";

export type ImageUploadHandle = {
  /** True if at least one image is selected (local or already remote). */
  hasFiles: () => boolean;
  /** Upload pending local files, return final URL list. */
  ensureUploaded: () => Promise<string[]>;
};

type ImageUploadProps = {
  /** Field name (used by forms that still read hidden inputs after upload). */
  name: string;
  folder?: "profile" | "artworks";
  hint?: string;
  multiple?: boolean;
  max?: number;
  defaultValues?: string[];
};

type LocalItem = {
  id: string;
  kind: "local";
  file: File;
  preview: string;
};

type RemoteItem = {
  id: string;
  kind: "remote";
  url: string;
};

type Item = LocalItem | RemoteItem;

async function uploadFile(
  file: File,
  folder: "profile" | "artworks"
): Promise<string> {
  const fd = new FormData();
  fd.set("file", file);
  fd.set("folder", folder);

  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = (await res.json()) as { url?: string; error?: string };

  if (!res.ok || !json.url) {
    throw new Error(json.error ?? "Échec du téléversement.");
  }
  return json.url;
}

export const ImageUpload = forwardRef<ImageUploadHandle, ImageUploadProps>(
  function ImageUpload(
    {
      name,
      folder = "artworks",
      hint,
      multiple = false,
      max = 5,
      defaultValues = [],
    },
    ref
  ) {
    const [items, setItems] = useState<Item[]>(() =>
      defaultValues.map((url) => ({
        id: url,
        kind: "remote" as const,
        url,
      }))
    );
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const replaceIdRef = useRef<string | null>(null);
    const itemsRef = useRef(items);
    itemsRef.current = items;

    useEffect(() => {
      return () => {
        for (const item of itemsRef.current) {
          if (item.kind === "local") URL.revokeObjectURL(item.preview);
        }
      };
    }, []);

    useImperativeHandle(ref, () => ({
      hasFiles: () => itemsRef.current.length > 0,
      ensureUploaded: async () => {
        setError(null);
        const current = itemsRef.current;
        if (current.length === 0) return [];

        const needsUpload = current.some((i) => i.kind === "local");
        if (!needsUpload) {
          return current.map((i) => (i.kind === "remote" ? i.url : i.preview));
        }

        setUploading(true);
        try {
          const urls: string[] = [];
          const nextItems: Item[] = [];

          for (const item of current) {
            if (item.kind === "remote") {
              urls.push(item.url);
              nextItems.push(item);
              continue;
            }
            const url = await uploadFile(item.file, folder);
            URL.revokeObjectURL(item.preview);
            urls.push(url);
            nextItems.push({ id: url, kind: "remote", url });
          }

          setItems(nextItems);
          itemsRef.current = nextItems;
          return urls;
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Échec du téléversement. Veuillez réessayer.";
          setError(message);
          throw new Error(message);
        } finally {
          setUploading(false);
        }
      },
    }));

    function addFiles(files: FileList | null) {
      if (!files || files.length === 0) return;
      setError(null);

      const incoming = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (incoming.length === 0) {
        setError("Format non supporté. Utilisez une image JPEG, PNG ou WebP.");
        return;
      }

      const replaceId = replaceIdRef.current;
      replaceIdRef.current = null;

      if (replaceId) {
        const file = incoming[0];
        const preview = URL.createObjectURL(file);
        setItems((prev) =>
          prev.map((item) => {
            if (item.id !== replaceId) return item;
            if (item.kind === "local") URL.revokeObjectURL(item.preview);
            return { id: crypto.randomUUID(), kind: "local", file, preview };
          })
        );
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      const newItems: LocalItem[] = incoming.map((file) => ({
        id: crypto.randomUUID(),
        kind: "local",
        file,
        preview: URL.createObjectURL(file),
      }));

      setItems((prev) => {
        if (!multiple) {
          for (const item of prev) {
            if (item.kind === "local") URL.revokeObjectURL(item.preview);
          }
          return newItems.slice(0, 1);
        }
        return [...prev, ...newItems].slice(0, max);
      });

      if (inputRef.current) inputRef.current.value = "";
    }

    function removeItem(id: string) {
      setItems((prev) => {
        const target = prev.find((i) => i.id === id);
        if (target?.kind === "local") URL.revokeObjectURL(target.preview);
        return prev.filter((i) => i.id !== id);
      });
    }

    function openPicker(replaceId?: string) {
      replaceIdRef.current = replaceId ?? null;
      inputRef.current?.click();
    }

    const canAddMore = multiple ? items.length < max : items.length === 0;
    const srcOf = (item: Item) =>
      item.kind === "local" ? item.preview : item.url;

    return (
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple={multiple}
          className="hidden"
          disabled={uploading}
          onChange={(e) => addFiles(e.target.files)}
        />

        {items.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative h-28 w-28 overflow-hidden rounded-xl-md"
                style={{ border: `1px solid ${COLORS.border}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={srcOf(item)}
                  alt="Aperçu"
                  className="h-full w-full object-cover"
                />
                {item.kind === "remote" && (
                  <input type="hidden" name={name} value={item.url} />
                )}
                <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/55 p-1">
                  <button
                    type="button"
                    onClick={() => openPicker(item.id)}
                    disabled={uploading}
                    className="flex-1 py-0.5 font-mono text-[9px] tracking-wider text-white"
                  >
                    CHANGER
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={uploading}
                    className="flex-1 py-0.5 font-mono text-[9px] tracking-wider text-white"
                  >
                    RETIRER
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {canAddMore && (
          <button
            type="button"
            onClick={() => openPicker()}
            disabled={uploading}
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl-md px-4 py-6 text-center transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              border: `1px dashed ${COLORS.border}`,
              background: COLORS.bgCard,
            }}
          >
            <span
              className="font-mono text-xs tracking-widest"
              style={{ color: COLORS.terra }}
            >
              {multiple ? "+ AJOUTER DES PHOTOS" : "+ CHOISIR UNE PHOTO"}
            </span>
            <span className="text-xs" style={{ color: COLORS.muted }}>
              Aperçu local — envoi à la soumission · JPEG, PNG ou WebP — 8 Mo max
            </span>
          </button>
        )}

        {uploading && (
          <p className="mt-2 text-xs" style={{ color: COLORS.muted }}>
            Téléversement en cours…
          </p>
        )}

        {error && (
          <p className="mt-2 text-xs" style={{ color: "#991B1B" }}>
            {error}
          </p>
        )}
        {hint && (
          <p className="mt-2 text-xs" style={{ color: COLORS.muted }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);
