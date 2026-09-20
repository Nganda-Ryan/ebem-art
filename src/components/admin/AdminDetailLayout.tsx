import Link from "next/link";
import type { ReactNode } from "react";

type AdminDetailHeaderProps = {
  backHref: string;
  backLabel: string;
  title: string;
  subtitle?: ReactNode;
  badges?: ReactNode;
  actions?: ReactNode;
};

export function AdminDetailHeader({
  backHref,
  backLabel,
  title,
  subtitle,
  badges,
  actions,
}: AdminDetailHeaderProps) {
  return (
    <header className="border-b border-gray-200 pb-6">
      <Link
        href={backHref}
        className="mb-4 inline-flex text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        ← {backLabel}
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
          )}
          {badges && (
            <div className="mt-3 flex flex-wrap items-center gap-2">{badges}</div>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-1">{actions}</div>
        )}
      </div>
    </header>
  );
}

type AdminDetailLayoutProps = {
  header: ReactNode;
  media: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
};

/** Media-first admin detail: gallery left (large), facts + actions right */
export function AdminDetailLayout({
  header,
  media,
  children,
  aside,
}: AdminDetailLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl">
      {header}
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="min-w-0 space-y-8">
          {media}
          {children}
        </div>
        {aside && <aside className="min-w-0 space-y-4 lg:sticky lg:top-8 lg:self-start">{aside}</aside>}
      </div>
    </div>
  );
}

export function AdminMetaCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AdminMetaRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2.5 text-sm last:border-0">
      <dt className="shrink-0 text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-gray-900">{children}</dd>
    </div>
  );
}
