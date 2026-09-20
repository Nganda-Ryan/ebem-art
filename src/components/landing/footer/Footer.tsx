import { COLORS } from "@/constants/colors";
import { FOOTER_COLUMNS } from "@/constants/navigation";
import { SITE } from "@/constants/site";
import { BrandMark } from "@/components/ui/brand-mark";

export function Footer() {
  return (
    <footer style={{ background: COLORS.ink }}>
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="mb-16 grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4">
              <BrandMark inverted />
            </div>
            <p
              className="mb-6 text-sm text-white opacity-50"
              style={{ lineHeight: 1.75, maxWidth: "32ch" }}
            >
              {SITE.tagline}
            </p>
            <div className="font-mono text-xs text-white opacity-30">
              © {SITE.copyrightYear} Mboa Arts. {SITE.location}.
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <div
                className="mb-5 font-mono text-xs tracking-widest"
                style={{ color: COLORS.terra }}
              >
                {column.title.toUpperCase()}
              </div>
              <div className="space-y-3">
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-white opacity-40 transition-opacity hover:opacity-80"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="font-mono text-xs text-white opacity-30">
            Fait avec amour pour l&apos;art camerounais.
          </div>
          <div className="flex gap-6">
            {SITE.socials.map((social) => (
              <a
                key={social}
                href="#"
                className="font-mono text-xs text-white opacity-40 transition-opacity hover:opacity-80"
              >
                {social.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
