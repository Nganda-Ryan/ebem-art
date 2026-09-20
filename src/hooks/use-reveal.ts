"use client";

import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let revealed = false;

    const markVisible = () => {
      el.querySelectorAll(".reveal:not(.visible)").forEach((node) => {
        node.classList.add("visible");
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        revealed = true;
        markVisible();
        observer.disconnect();
      },
      { threshold: 0.1 },
    );

    observer.observe(el);

    const mutations = new MutationObserver(() => {
      if (revealed) markVisible();
    });
    mutations.observe(el, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return ref;
}
