"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { COLORS } from "@/constants/colors";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      height="3px"
      color={COLORS.terra}
      options={{ showSpinner: false }}
      shallowRouting
      startOnLoad
    >
      {children}
    </ProgressProvider>
  );
}
