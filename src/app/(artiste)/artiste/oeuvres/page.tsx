import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { COLORS } from "@/constants/colors";
import { ArtworkSubmissionDrawer } from "@/components/landing/artwork-submission-form";
import { LogoutButton } from "@/components/LogoutButton";
import { getArtworkRequestsByArtistId } from "@/modules/artwork-requests";
import { getArtworksByArtistId } from "@/modules/artworks";
import { getArtistForUser } from "@/modules/artists";

export const metadata = {
  title: "Mes œuvres - Espace Artiste",
};

export const dynamic = "force-dynamic";

const REQUEST_STATUS: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  PENDING: { bg: "#FEF3C7", color: "#92400E", label: "En attente de validation" },
  APPROVED: { bg: "#D1FAE5", color: "#065F46", label: "Validée" },
  REJECTED: { bg: "#FEE2E2", color: "#991B1B", label: "Rejetée" },
};

const WORK_STATUS: Record<string, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "En réservation",
  SOLD: "Vendue",
  EXHIBITING: "En exposition physique",
};

function StatusChip({ status }: { status: string }) {
  const style = REQUEST_STATUS[status] ?? REQUEST_STATUS.PENDING;
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
}

export default async function ArtisteOeuvresPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { submitted } = await searchParams;
  const session = await getSession();

  if (!session) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="font-serif text-3xl" style={{ color: COLORS.ink }}>
          Espace Artiste
        </h1>
        <p className="mt-4 text-sm" style={{ color: COLORS.muted }}>
          Connectez-vous avec l&apos;email utilisé lors de votre inscription
          pour gérer vos œuvres.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/connexion"
            className="inline-flex items-center justify-center px-6 py-3 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
            style={{ background: COLORS.terra }}
          >
            SE CONNECTER
          </Link>
          <Link
            href="/inscription"
            className="inline-flex items-center justify-center px-6 py-3 font-mono text-xs tracking-wider transition-all"
            style={{
              color: COLORS.muted,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.bgCard,
            }}
          >
            DEVENIR ARTISTE
          </Link>
        </div>
      </div>
    );
  }

  const artist = await getArtistForUser({
    id: session.user.id,
    email: session.user.email,
  });

  if (!artist) {
    const pendingRequest = await db.artistRequest.findFirst({
      where: {
        OR: [
          { userId: session.user.id },
          { email: session.user.email },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    const isAdmin = session.user.role === "admin";
    const isPending = pendingRequest?.status === "PENDING";
    const isRejected = pendingRequest?.status === "REJECTED";

    let title = "Profil non trouvé";
    let message =
      "Votre compte n'est pas encore associé à un profil artiste. Inscrivez-vous pour rejoindre la plateforme.";

    if (isAdmin) {
      title = "Compte administrateur";
      message =
        "Vous êtes connecté avec un compte admin. Déconnectez-vous, puis reconnectez-vous avec l'email utilisé lors de votre demande d'inscription artiste.";
    } else if (isPending) {
      title = "Demande en cours d'examen";
      message =
        "Votre demande d'inscription est en cours d'examen par notre équipe. Vous pourrez soumettre vos œuvres dès qu'elle sera approuvée.";
    } else if (isRejected) {
      title = "Demande rejetée";
      message =
        "Aucun profil artiste actif n'est associé à votre compte. Contactez-nous pour plus d'informations.";
    } else if (pendingRequest?.status === "APPROVED") {
      title = "Profil non lié";
      message =
        "Votre demande a été approuvée, mais le lien avec ce compte est incomplet. Contactez l'équipe ou reconnectez-vous avec l'email de la demande.";
    }

    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="font-serif text-3xl" style={{ color: COLORS.ink }}>
          {title}
        </h1>
        <p className="mt-4 text-sm" style={{ color: COLORS.muted }}>
          {message}
        </p>
        <p className="mt-3 font-mono text-xs" style={{ color: COLORS.muted }}>
          Connecté : {session.user.email}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <LogoutButton redirectTo="/connexion" />
          {!isAdmin && !isPending && (
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center px-6 py-3 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
              style={{ background: COLORS.terra }}
            >
              DEVENIR ARTISTE
            </Link>
          )}
          {isPending && (
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
              style={{ background: COLORS.terra }}
            >
              RETOUR À L&apos;ACCUEIL
            </Link>
          )}
        </div>
      </div>
    );
  }

  const [requests, artworks] = await Promise.all([
    getArtworkRequestsByArtistId(artist.id),
    getArtworksByArtistId(artist.id),
  ]);

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl" style={{ color: COLORS.ink }}>
            Mes Œuvres
          </h1>
          <p className="mt-2 text-sm" style={{ color: COLORS.muted }}>
            Bienvenue {artist.name}. Vos œuvres apparaissent sur la plateforme
            après validation par notre équipe.
          </p>
        </div>
        <ArtworkSubmissionDrawer
          artistId={artist.id}
          artistName={artist.name}
        />
      </div>

      {submitted && (
        <div
          className="mt-8 rounded-lg px-4 py-3 text-sm"
          style={{
            background: "#D1FAE5",
            color: "#065F46",
            border: "1px solid #A7F3D0",
          }}
        >
          Votre œuvre a bien été soumise. Elle sera publiée une fois validée
          par notre équipe.
        </div>
      )}

      <div className="mt-10 grid grid-cols-3 gap-4">
        {[
          { value: artworks.length, label: "Œuvres en ligne" },
          { value: pendingCount, label: "En attente de validation" },
          { value: rejectedCount, label: "Demandes rejetées" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg p-4 text-center md:p-6"
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div className="font-serif text-3xl" style={{ color: COLORS.ink }}>
              {stat.value}
            </div>
            <div
              className="mt-1 font-mono text-[10px] tracking-widest"
              style={{ color: COLORS.muted }}
            >
              {stat.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-14 mb-6 font-serif text-2xl" style={{ color: COLORS.ink }}>
        Mes œuvres publiées
      </h2>
      {artworks.length === 0 ? (
        <p className="text-sm" style={{ color: COLORS.muted }}>
          Aucune œuvre publiée pour le moment. Soumettez votre première œuvre !
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="overflow-hidden rounded-lg"
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              {artwork.imageUrls[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artwork.imageUrls[0]}
                  alt={artwork.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-48 items-center justify-center text-xs"
                  style={{ color: COLORS.muted }}
                >
                  Pas d&apos;image
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-lg" style={{ color: COLORS.ink }}>
                    {artwork.title}
                  </h3>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: COLORS.bgAlt,
                      color: COLORS.inkMid,
                    }}
                  >
                    {WORK_STATUS[artwork.status] ?? artwork.status}
                  </span>
                </div>
                <p className="mt-1 text-sm" style={{ color: COLORS.terra }}>
                  {artwork.priceCents.toLocaleString("fr-FR")} {artwork.currency}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-14 mb-6 font-serif text-2xl" style={{ color: COLORS.ink }}>
        Mes demandes de soumission
      </h2>
      {requests.length === 0 ? (
        <p className="text-sm" style={{ color: COLORS.muted }}>
          Aucune demande soumise pour le moment.
        </p>
      ) : (
        <div
          className="overflow-hidden rounded-lg"
          style={{ border: `1px solid ${COLORS.border}` }}
        >
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between"
              style={{
                background: COLORS.bgCard,
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <div className="flex items-center gap-4">
                {req.imageUrls[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={req.imageUrls[0]}
                    alt={req.title}
                    className="h-14 w-14 rounded-md object-cover"
                  />
                ) : null}
                <div>
                  <p className="font-medium" style={{ color: COLORS.ink }}>
                    {req.title}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.muted }}>
                    {new Date(req.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  {req.status === "REJECTED" && req.adminNote && (
                    <p className="mt-1 text-xs" style={{ color: "#991B1B" }}>
                      Motif : {req.adminNote}
                    </p>
                  )}
                </div>
              </div>
              <StatusChip status={req.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
