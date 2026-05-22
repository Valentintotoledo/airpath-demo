"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Film, Rocket, X } from "lucide-react";
import { useUI } from "@/lib/ui-context";
import { useI18n } from "@/lib/i18n";
import { Logo } from "@/components/brand/logo";

const KEY = "airpath.welcomeChoice";

export function WelcomeGate() {
  const { startTrailer, startTour, trailerMode } = useUI();
  const { lang } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (trailerMode) return;
    if (pathname !== "/dashboard") return;
    if (window.sessionStorage.getItem(KEY)) return;
    const t = window.setTimeout(() => setOpen(true), 350);
    return () => window.clearTimeout(t);
  }, [pathname, trailerMode]);

  function chooseTrailer() {
    window.sessionStorage.setItem(KEY, "trailer");
    setOpen(false);
    window.setTimeout(() => startTrailer(), 220);
  }

  function chooseExplore() {
    window.sessionStorage.setItem(KEY, "explore");
    setOpen(false);
    window.setTimeout(() => startTour(), 450);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-neutral-950/85 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-hairline bg-surface p-6 shadow-2xl sm:p-8"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 size-72 glow-purple opacity-50"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-20 size-72 glow-gold opacity-25"
            />
            <button
              onClick={chooseExplore}
              aria-label="Cerrar"
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-hairline bg-surface-2 text-content-muted transition hover:text-content"
            >
              <X className="size-4" />
            </button>

            <div className="relative text-center">
              <Logo size="md" />
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-500/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold-ink">
                <span className="size-1.5 rounded-full bg-accent-400" />
                {lang === "es" ? "Bienvenido a la demo" : "Welcome to the demo"}
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-content sm:text-3xl">
                {lang === "es"
                  ? "¿Cómo querés explorar AirPath?"
                  : "How do you want to explore AirPath?"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-content-muted">
                {lang === "es"
                  ? "Elegí cómo arrancar. Podés ver una demo cinematográfica de 90 segundos o saltar directo al panel."
                  : "Pick how to start. Watch a cinematic 90-second demo or jump straight to the panel."}
              </p>
            </div>

            <div className="relative mt-7 grid gap-3 sm:grid-cols-2">
              <button
                onClick={chooseTrailer}
                className="group relative overflow-hidden rounded-2xl border border-accent-500/45 bg-gradient-to-br from-accent-500/20 via-accent-500/[0.07] to-transparent p-5 text-left transition hover:-translate-y-0.5 hover:border-accent-500/70 hover:from-accent-500/30"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-neutral-950 shadow-lg">
                  <Film className="size-6" />
                </span>
                <p className="mt-3 text-base font-extrabold text-content">
                  {lang === "es" ? "Ver demo automática" : "Watch the auto-play demo"}
                </p>
                <p className="mt-1 text-sm leading-snug text-content-muted">
                  {lang === "es"
                    ? "Recorrido cinematográfico que te muestra cada módulo. Ideal para una primera mirada."
                    : "Cinematic walkthrough showing every module. Perfect for a first look."}
                </p>
                <span className="mt-4 inline-flex w-full items-center justify-between gap-1.5 rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-extrabold text-neutral-950 transition group-hover:bg-accent-400">
                  {lang === "es" ? "Reproducir demo · 90s" : "Play demo · 90s"}
                  <ChevronRight className="size-4" />
                </span>
              </button>

              <button
                onClick={chooseExplore}
                className="group relative overflow-hidden rounded-2xl border border-primary-500/40 bg-gradient-to-br from-primary-600/18 via-primary-600/[0.05] to-transparent p-5 text-left transition hover:-translate-y-0.5 hover:border-primary-500/70 hover:from-primary-600/28"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg">
                  <Rocket className="size-6" />
                </span>
                <p className="mt-3 text-base font-extrabold text-content">
                  {lang === "es" ? "Explorar por mi cuenta" : "Explore on my own"}
                </p>
                <p className="mt-1 text-sm leading-snug text-content-muted">
                  {lang === "es"
                    ? "Vas directo al panel y te lanzamos el tour guiado para que ubiques cada sección."
                    : "Jump straight to the panel — we'll run the guided tour so you find every section."}
                </p>
                <span className="mt-4 inline-flex w-full items-center justify-between gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-extrabold text-white transition group-hover:bg-primary-500">
                  {lang === "es" ? "Entrar al panel" : "Enter the panel"}
                  <ChevronRight className="size-4" />
                </span>
              </button>
            </div>

            <p className="relative mt-5 text-center text-[11px] text-content-muted">
              {lang === "es"
                ? "Esto es una previsualización · datos de ejemplo · sin registro real"
                : "This is a preview · sample data · no real signup"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
