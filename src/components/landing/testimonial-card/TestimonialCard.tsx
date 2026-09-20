"use client";

import type { Testimonial } from "@/types/landing";
import { COLORS } from "@/constants/colors";

type TestimonialCardProps = {
  testimonial: Testimonial;
  revealDelay?: number;
};

export function TestimonialCard({ testimonial, revealDelay = 1 }: TestimonialCardProps) {
  return (
    <div
      className={`reveal reveal-delay-${revealDelay} p-7`}
      style={{ border: `1px solid ${COLORS.border}`, background: COLORS.bgCard }}
    >
      <div
        className="mb-4 font-serif text-5xl"
        style={{ color: COLORS.terra, opacity: 0.35, lineHeight: 1 }}
      >
        &ldquo;
      </div>
      <p
        className="mb-6 text-sm leading-relaxed"
        style={{ color: COLORS.inkMid, lineHeight: 1.8 }}
      >
        {testimonial.text}
      </p>
      <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: "1.25rem" }}>
        <div className="text-sm font-medium" style={{ color: COLORS.ink }}>
          {testimonial.author}
        </div>
        <div className="mt-0.5 font-mono text-xs" style={{ color: COLORS.muted }}>
          {testimonial.role}
        </div>
        {testimonial.acquired ? (
          <div
            className="mt-3 flex items-center gap-1 font-mono text-xs"
            style={{ color: COLORS.gold }}
          >
            <span>✦</span> A acquis : {testimonial.acquired}
          </div>
        ) : null}
      </div>
    </div>
  );
}
