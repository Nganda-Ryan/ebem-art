"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, step = 3, intervalMs = 16): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const id = window.setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        window.clearInterval(id);
        return;
      }
      setCount(current);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [target, step, intervalMs]);

  return count;
}
