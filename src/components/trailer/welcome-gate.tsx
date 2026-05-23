"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Plane, Play } from "lucide-react";
import { useUI } from "@/lib/ui-context";
import { useI18n } from "@/lib/i18n";
import { getDemoUser } from "@/data/mock";

const KEY = "airpath.welcomeChoice";
const ACCENT = "#c9a23c"; // accent-500

const MARQUEE_ES =
  " AIRPATH — FORMACIÓN AVALADA FAA · USA + ARGENTINA — LA AVIACIÓN NO ES SOLO PARA RICOS — DEMO DE PREVISUALIZACIÓN — ";
const MARQUEE_EN =
  " AIRPATH — FAA-BACKED TRAINING · USA + ARGENTINA — AVIATION IS NOT ONLY FOR THE WEALTHY — PREVIEW DEMO — ";

export function WelcomeGate() {
  const { startTrailer, startTour, trailerMode } = useUI();
  const { lang } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const user = getDemoUser("student");
  const firstName = user.name.split(" ").slice(0, 2).join(" ");

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

  const bullets =
    lang === "es"
      ? ["Academy FAA", "Marketplace de aviación", "Reservas tipo Turo", "Certificados verificables"]
      : ["FAA Academy", "Aviation marketplace", "Turo-style bookings", "Verifiable certificates"];
  const marqueeText = lang === "es" ? MARQUEE_ES : MARQUEE_EN;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[150] flex h-screen w-screen flex-col overflow-hidden bg-[#0A0A0B] text-white"
        >
          {/* Subtle grain / horizon glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(201,162,60,0.18), transparent 60%), radial-gradient(circle at 20% 0%, rgba(147,51,234,0.18), transparent 50%)",
            }}
          />

          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3.5 sm:px-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
              {lang === "es" ? "BIENVENIDO" : "WELCOME"}, {firstName.toUpperCase()}
            </span>
            <div className="flex items-center gap-2.5">
              <span
                className="grid size-7 place-items-center rounded-md text-neutral-950"
                style={{ background: ACCENT }}
              >
                <Plane className="size-4" strokeWidth={2.4} />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
                AIRPATH · {lang === "es" ? "DEMO GUIADA" : "GUIDED DEMO"}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="relative flex flex-1 items-center justify-center px-6 lg:px-12">
            <div className="w-full max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 flex items-center gap-3"
              >
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] font-extrabold uppercase tracking-[0.22em]"
                  style={{
                    background: `${ACCENT}20`,
                    borderColor: `${ACCENT}55`,
                    color: ACCENT,
                  }}
                >
                  <span
                    className="size-1.5 animate-pulse rounded-full"
                    style={{ background: ACCENT }}
                  />
                  {lang === "es" ? "DEMO GUIADA · 90 SEGUNDOS" : "GUIDED DEMO · 90 SECONDS"}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-[40px] font-black leading-[0.95] tracking-tight md:text-[60px] lg:text-[76px]"
              >
                {lang === "es" ? "Antes de empezar," : "Before you start,"}
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-[40px] font-black leading-[0.95] tracking-tight md:text-[60px] lg:text-[76px]"
                style={{ color: ACCENT }}
              >
                {lang === "es" ? "mirá lo que hace AirPath." : "see what AirPath does."}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-7 max-w-2xl text-base leading-relaxed text-white/60 lg:text-lg"
              >
                {lang === "es"
                  ? "Un recorrido automático por los módulos clave. Cero clics — la plataforma se demuestra sola. Después seguís explorando por tu cuenta."
                  : "An automatic walkthrough of the key modules. Zero clicks — the platform demonstrates itself. After that you keep exploring on your own."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="mt-7 flex flex-wrap gap-2"
              >
                {bullets.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/55"
                  >
                    · {b}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 space-y-4"
              >
                <button
                  onClick={chooseTrailer}
                  className="group relative flex w-full max-w-2xl items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left transition-transform hover:scale-[1.01]"
                  style={{
                    background: ACCENT,
                    boxShadow: `0 20px 60px -10px ${ACCENT}AA`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-full bg-black/25 text-neutral-950">
                      <Play className="size-5 fill-current" />
                    </span>
                    <span className="text-neutral-950">
                      <span className="flex items-center gap-2">
                        <span className="text-xl font-extrabold lg:text-2xl">
                          {lang === "es" ? "Ver demo guiada" : "Watch guided demo"}
                        </span>
                        <span className="rounded-full bg-neutral-950/20 px-2 py-0.5 font-mono text-[9px] font-extrabold uppercase tracking-wider">
                          {lang === "es" ? "RECOMENDADO" : "RECOMMENDED"}
                        </span>
                      </span>
                      <span className="block text-[13px] font-medium text-neutral-950/75">
                        {lang === "es"
                          ? "Auto-play · 90s · podés salir cuando quieras"
                          : "Auto-play · 90s · exit anytime"}
                      </span>
                    </span>
                  </div>
                  <ArrowRight className="size-6 text-neutral-950 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={chooseExplore}
                  className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-white/50 transition-colors hover:text-white"
                >
                  {lang === "es"
                    ? "Saltar y explorar por mi cuenta"
                    : "Skip and explore on my own"}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Marquee footer */}
          <div className="relative overflow-hidden border-t border-white/10 py-3">
            <motion.div
              className="inline-block whitespace-nowrap font-mono text-[11px] tracking-[0.18em] text-white/35"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 32, ease: "linear", repeat: Infinity }}
            >
              {(marqueeText + marqueeText).repeat(2)}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
