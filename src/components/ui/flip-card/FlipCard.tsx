"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

export type FlipCardProps = {
  front: ReactNode;
  back: ReactNode;
  axis?: "x" | "y";
  flipOnClick?: boolean;
  draggable?: boolean;
  dragDistance?: number;
  tilt?: boolean;
  tiltMax?: number;
  glare?: boolean;
  glareOpacity?: number;
  hoverScale?: number;
  perspective?: number;
  stiffness?: number;
  damping?: number;
  width?: number | string;
  height?: number | string;
  radius?: number;
  background?: string;
  color?: string;
  shadow?: boolean;
  shadowColor?: string;
  shadowOpacity?: number;
  className?: string;
  style?: CSSProperties;
  onFlipChange?: (flipped: boolean) => void;
};

function toCssSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export function FlipCard({
  front,
  back,
  axis = "y",
  flipOnClick = true,
  draggable = false,
  dragDistance = 80,
  tilt = false,
  tiltMax = 12,
  glare = false,
  glareOpacity = 0.22,
  hoverScale = 1,
  perspective = 1100,
  stiffness = 170,
  damping = 20,
  width = "100%",
  height = "100%",
  radius = 0,
  background = "#27272a",
  color = "#f5f5f5",
  shadow = false,
  shadowColor = "#000000",
  shadowOpacity = 0.45,
  className,
  style,
  onFlipChange,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const dragFlipped = useRef(false);

  const springConfig = { stiffness, damping, mass: 0.4 };

  /** Single scene transform: flip + tilt live on the same node (no static shell). */
  const flipRotation = useSpring(0, springConfig);
  const tiltX = useSpring(0, springConfig);
  const tiltY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareVisible = useSpring(0, springConfig);

  const rotateX = useTransform([flipRotation, tiltX], ([flip, tx]) =>
    axis === "x" ? Number(flip) + Number(tx) : Number(tx),
  );
  const rotateY = useTransform([flipRotation, tiltY], ([flip, ty]) =>
    axis === "y" ? Number(flip) + Number(ty) : Number(ty),
  );

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${glareOpacity}), transparent 55%)`,
  );

  useEffect(() => {
    flipRotation.set(flipped ? 180 : 0);
  }, [flipped, flipRotation]);

  const toggleFlip = useCallback(() => {
    setFlipped((current) => {
      const next = !current;
      onFlipChange?.(next);
      return next;
    });
  }, [onFlipChange]);

  const resetTilt = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
    glareVisible.set(0);
    scale.set(1);
  }, [glareVisible, scale, tiltX, tiltY]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = rootRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    if (tilt) {
      tiltX.set((0.5 - py) * tiltMax * 2);
      tiltY.set((px - 0.5) * tiltMax * 2);
    }

    if (glare) {
      glareX.set(px * 100);
      glareY.set(py * 100);
      glareVisible.set(1);
    }

    if (!draggable || dragDistance <= 0 || !pointerStart.current || dragFlipped.current) {
      return;
    }

    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    if (Math.hypot(dx, dy) >= dragDistance) {
      dragFlipped.current = true;
      toggleFlip();
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    dragFlipped.current = false;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;

    if (!start || dragFlipped.current) {
      dragFlipped.current = false;
      return;
    }

    const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    const clickThreshold = 6;

    if (draggable && dragDistance > 0 && distance >= dragDistance) {
      toggleFlip();
      return;
    }

    if (flipOnClick && distance <= clickThreshold) {
      toggleFlip();
    }
  };

  const handlePointerEnter = () => {
    scale.set(hoverScale);
  };

  const handlePointerLeave = () => {
    pointerStart.current = null;
    dragFlipped.current = false;
    resetTilt();
  };

  /** Outer face — solid fill so no static plate shows behind the image. */
  const faceShellStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: radius,
    background,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform: "translateZ(0.1px)",
    WebkitTransform: "translateZ(0.1px)",
    overflow: "hidden",
  };

  const renderGlare = () =>
    glare ? (
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          pointerEvents: "none",
          background: glareBackground,
          opacity: glareVisible,
          mixBlendMode: "soft-light",
        }}
      />
    ) : null;

  return (
    <div
      ref={rootRef}
      className={className}
      role={flipOnClick ? "button" : undefined}
      tabIndex={flipOnClick ? 0 : undefined}
      aria-pressed={flipOnClick ? flipped : undefined}
      onKeyDown={(event) => {
        if (!flipOnClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleFlip();
        }
      }}
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      style={{
        width: toCssSize(width),
        height: toCssSize(height),
        perspective: `${perspective}px`,
        color,
        cursor: flipOnClick || draggable ? "pointer" : undefined,
        outline: "none",
        background: "transparent",
        borderRadius: radius,
        // Allow tilt/shadow to escape the cell without a static clip frame.
        overflow: "visible",
        ...style,
      }}
    >
      <motion.div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          background: "transparent",
          borderRadius: radius,
          rotateX: tilt || axis === "x" ? rotateX : 0,
          rotateY: tilt || axis === "y" ? rotateY : 0,
          scale,
          boxShadow: shadow
            ? `0 18px 40px ${withAlpha(shadowColor, shadowOpacity)}`
            : undefined,
        }}
      >
        <div style={faceShellStyle}>
          {front}
          {renderGlare()}
        </div>
        <div
          style={{
            ...faceShellStyle,
            transform:
              axis === "y"
                ? "rotateY(180deg) translateZ(0.1px)"
                : "rotateX(180deg) translateZ(0.1px)",
            WebkitTransform:
              axis === "y"
                ? "rotateY(180deg) translateZ(0.1px)"
                : "rotateX(180deg) translateZ(0.1px)",
          }}
        >
          <div style={{ color, height: "100%" }}>{back}</div>
          {renderGlare()}
        </div>
      </motion.div>
    </div>
  );
}

function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return `rgba(0,0,0,${alpha})`;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default FlipCard;
