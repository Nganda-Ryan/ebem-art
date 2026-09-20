"use client";

import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { MOCK_TESTIMONIALS } from "@/data/mock";
import { TestimonialCard } from "@/components/landing/testimonial-card";
import { useReveal } from "@/hooks/use-reveal";

export function Temoignages() {
  const ref = useReveal();
  const labels = SECTION_LABELS.temoignages;

  return (
    <section
      id="temoignages"
      ref={ref}
      className="py-10 md:py-14"
      style={{ background: COLORS.bgAlt, borderTop: `1px solid ${COLORS.border}` }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-12">
        <div className="reveal mb-12">
          <span className="font-mono text-xs tracking-widest" style={{ color: COLORS.terra }}>
            {labels.code}
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl" style={{ color: COLORS.ink }}>
            {labels.title}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {MOCK_TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              testimonial={testimonial}
              revealDelay={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
