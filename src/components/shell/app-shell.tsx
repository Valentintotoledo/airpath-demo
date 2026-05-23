"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { BottomNav } from "./bottom-nav";
import { Assistant } from "@/components/assistant/assistant";
import { Tour } from "@/components/tour/tour";
import { WelcomeGate } from "@/components/trailer/welcome-gate";
import { useUI } from "@/lib/ui-context";

function ShellBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -left-40 -top-44 size-[440px] glow-purple opacity-30" />
      <div className="absolute -right-40 top-1/3 size-[380px] glow-gold opacity-[0.14]" />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { trailerMode } = useUI();
  return (
    <div className="relative min-h-dvh">
      <ShellBackdrop />
      <Sidebar />
      <div className="lg:pl-72">
        <Topbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:pb-14">
          {children}
        </main>
      </div>
      <BottomNav />
      {/* Assistant FAB stays mounted during trailer so the "Copiloto IA" scene
          can highlight it. The chat panel itself only opens on click. */}
      <Assistant />
      {!trailerMode && <Tour />}
      <WelcomeGate />
    </div>
  );
}
