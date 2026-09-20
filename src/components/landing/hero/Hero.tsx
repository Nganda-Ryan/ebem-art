"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { COLORS } from "@/constants/colors";
import { HERO } from "@/constants/landing";
import { HERO_STATS } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/use-count-up";

/**
 * Split hero + discreet carousel (museum / Apple product pattern):
 * reading plane left | sharp slides right + dots for control.
 */
export function Hero() {
  const count = useCountUp(HERO.artistCountTarget);
  const ticker = [...HERO.tickerItems, ...HERO.tickerItems];
  const [active, setActive] = useState(0);
  const slides = HERO.slides;

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, HERO.slideIntervalMs);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <section className="flex min-h-[100svh] flex-col bg-[#0C0A08]">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Artwork carousel */}
        <div className="relative order-1 min-h-[44vh] w-full lg:order-2 lg:min-h-0 lg:flex-1">
          {slides.map((slide, index) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover transition-opacity duration-700 ease-out"
              style={{
                objectPosition: slide.position,
                opacity: active === index ? 1 : 0,
                zIndex: active === index ? 1 : 0,
              }}
              sizes="(max-width: 1024px) 100vw, 56vw"
            />
          ))}

          {/* Discreet slide dots - bottom of image */}
          <div
            className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
            role="tablist"
            aria-label="Diaporama hero"
          >
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-label={`Image ${index + 1}`}
                onClick={() => setActive(index)}
                className="transition-all duration-300"
                style={{
                  width: active === index ? 22 : 7,
                  height: 7,
                  borderRadius: 999,
                  background:
                    active === index
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.35)",
                  border: "none",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Copy */}
        <div className="order-2 flex w-full flex-col justify-center bg-[#0C0A08] px-6 py-10 md:px-12 md:py-14 lg:order-1 lg:w-[44%] lg:justify-end lg:pb-14 lg:pt-28 xl:w-[40%]">
          <h1
            className="mb-5 max-w-[12ch] leading-[0.95]"
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--serif)",
              fontSize: "clamp(2.75rem, 6vw, 5rem)",
            }}
          >
            {HERO.titleLines[0]}
            <br />
            <em style={{ color: "#FFFFFF" }}>{HERO.titleLines[1]}</em>
            <br />
            {HERO.titleLines[2]}
          </h1>

          <p
            className="mb-7 max-w-md text-base md:text-lg"
            style={{
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.75,
              fontFamily: "var(--sans)",
            }}
          >
            {HERO.description}
          </p>

          {/* Metrics higher - visible in first viewport */}
          <div
            className="mb-8 grid grid-cols-3 border"
            style={{ borderColor: "rgba(255,255,255,0.14)" }}
          >
            {HERO_STATS.map((stat, index) => (
              <div
                key={stat.label}
                className="p-4 md:p-5"
                style={{
                  borderRight:
                    index < HERO_STATS.length - 1
                      ? "1px solid rgba(255,255,255,0.14)"
                      : "none",
                }}
              >
                <div
                  className="mb-1 text-2xl md:text-3xl"
                  style={{ color: "#FFFFFF", fontFamily: "var(--serif)" }}
                >
                  {stat.animated ? String(count) : stat.n}
                </div>
                <div
                  className="mb-0.5 text-[10px] font-medium tracking-wider md:text-xs"
                  style={{ color: COLORS.terra, fontFamily: "var(--sans)" }}
                >
                  {stat.label}
                </div>
                <div
                  className="text-[10px] md:text-xs"
                  style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--sans)" }}
                >
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs - always same row */}
          <div className="flex flex-nowrap items-center gap-3">
            <Button
              variant="terra"
              className="shrink-0 whitespace-nowrap px-5 py-3.5 text-xs font-medium tracking-wider sm:px-8 sm:text-sm"
              style={{ fontFamily: "var(--sans)" }}
              onClick={() => {
                window.location.assign("/explorer");
              }}
            >
              {HERO.primaryCta}
            </Button>
            <button
              type="button"
              className="shrink-0 whitespace-nowrap px-5 py-3.5 text-xs font-medium tracking-wider transition-colors sm:px-8 sm:text-sm"
              style={{
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.45)",
                background: "transparent",
                fontFamily: "var(--sans)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#FFFFFF";
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
                e.currentTarget.style.background = "transparent";
              }}
              onClick={() => {
                document.getElementById("artistes")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {HERO.secondaryCta}
            </button>
          </div>
        </div>
      </div>

      <div
        className="ticker-wrap border-t py-3"
        style={{ borderColor: "rgba(255,255,255,0.1)", background: "#0C0A08" }}
      >
        <div
          className="ticker-content text-xs tracking-widest"
          style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--sans)" }}
        >
          {ticker.map((item, index) => (
            <span key={`${item}-${index}`} className="mx-6">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
