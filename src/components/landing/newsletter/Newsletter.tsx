"use client";

import { useState } from "react";
import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";

export function Newsletter() {
  const ref = useReveal();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const labels = SECTION_LABELS.newsletter;

  return (
    <section id="newsletter" ref={ref} className="py-10 md:py-14" style={{ background: COLORS.terra }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-12">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="reveal">
            <span className="font-mono text-xs tracking-widest text-white opacity-70">
              {labels.eyebrow}
            </span>
            <h2 className="mt-3 mb-4 font-serif text-3xl text-white md:text-4xl">
              {labels.titleBefore} <em>{labels.titleEm}</em>
            </h2>
            <p className="text-sm text-white opacity-80" style={{ lineHeight: 1.75 }}>
              {labels.description}
            </p>
          </div>

          <div className="reveal reveal-delay-1">
            {sent ? (
              <div className="border border-white/30 p-6 text-center">
                <div className="mb-2 font-serif text-2xl text-white">Merci.</div>
                <div className="text-sm text-white opacity-70">
                  Vous êtes maintenant dans la boucle.
                </div>
              </div>
            ) : (
              <form
                className="flex flex-col sm:flex-row"
                style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                onSubmit={(event) => {
                  event.preventDefault();
                  if (email.trim()) setSent(true);
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 px-5 py-4 text-sm text-white outline-none placeholder:text-white/70"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    borderRight: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
                <Button
                  type="submit"
                  variant="ink"
                  className="px-6 py-4 text-xs font-medium tracking-widest whitespace-nowrap"
                >
                  S&apos;ABONNER
                </Button>
              </form>
            )}
            <div className="mt-3 font-mono text-xs text-white opacity-60">{labels.disclaimer}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
