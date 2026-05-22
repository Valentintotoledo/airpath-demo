"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, MapPin, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useUI } from "@/lib/ui-context";
import type { L10n } from "@/data/mock";

const TOUR_KEY = "airpath.tourSeen";

type TourStep = { target: string | null; title: L10n; body: L10n };

const STEPS: TourStep[] = [
  {
    target: '[data-tour="career"]',
    title: { es: "Tu ruta de carrera FAA", en: "Your FAA career path" },
    body: {
      es: "De PPL a piloto de aerolínea, paso a paso. Cada etapa se desbloquea al completar la anterior: siempre sabés dónde estás y qué sigue.",
      en: "From PPL to airline pilot, step by step. Each stage unlocks when you finish the previous one — you always know where you are and what's next.",
    },
  },
  {
    target: '[data-tour="nav-academy"]',
    title: { es: "AirPath Academy", en: "AirPath Academy" },
    body: {
      es: "5 cursos avalados por la FAA: video, lecturas, diagramas y evaluaciones, alineados a FAA Part 141. Acá se forma de verdad.",
      en: "5 FAA-backed courses: video, readings, diagrams and assessments, aligned to FAA Part 141. Real training lives here.",
    },
  },
  {
    target: '[data-tour="nav-written"]',
    title: { es: "Simulador de examen Written", en: "Written exam simulator" },
    body: {
      es: "Banco de preguntas randomizado estilo Sheppard Air. 5 tipos de pregunta, con tiempo y reporte por pregunta. Llegás al checkride sin sorpresas.",
      en: "Sheppard Air-style randomized question bank. 5 question types, timed, with per-question feedback. You reach the checkride with no surprises.",
    },
  },
  {
    target: '[data-tour="nav-certificates"]',
    title: { es: "Certificados verificables", en: "Verifiable certificates" },
    body: {
      es: "Cada certificado lleva un código único. Una escuela o empleador puede validarlo públicamente en segundos. Cero papeles truchos.",
      en: "Every certificate carries a unique code. A school or employer can validate it publicly in seconds. Zero fake paperwork.",
    },
  },
  {
    target: '[data-tour="nav-marketplace"]',
    title: { es: "Marketplace de aviación", en: "Aviation marketplace" },
    body: {
      es: "Aeronaves para time building, instructores FAA, escuelas y vuelos charter. Todo lo que necesita tu carrera, en un mismo lugar.",
      en: "Aircraft for time building, FAA instructors, schools and charter flights. Everything your career needs, in one place.",
    },
  },
  {
    target: '[data-tour="nav-bookings"]',
    title: { es: "Reservas tipo Turo", en: "Turo-style bookings" },
    body: {
      es: "Solicitás una aeronave o instructor y el dueño aprueba. Nada de reservas automáticas: control total para ambas partes.",
      en: "You request an aircraft or instructor and the owner approves. No automatic bookings — full control for both sides.",
    },
  },
  {
    target: '[data-tour="role-switcher"]',
    title: { es: "Cambiá de rol", en: "Switch roles" },
    body: {
      es: "Mirá la plataforma como estudiante, instructor, escuela, propietario, admin y más. Un mismo ecosistema, siete perspectivas.",
      en: "View the platform as a student, instructor, school, owner, admin and more. One ecosystem, seven perspectives.",
    },
  },
  {
    target: '[data-tour="assistant"]',
    title: { es: "Tu copiloto IA", en: "Your AI copilot" },
    body: {
      es: "Preguntale lo que necesites sobre licencias, cursos, costos o tu progreso. Respuestas al instante, en español o inglés.",
      en: "Ask it anything about licenses, courses, costs or your progress. Instant answers, in Spanish or English.",
    },
  },
];

export function Tour() {
  const { tourOpen, startTour, endTour } = useUI();
  const { lang } = useI18n();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Auto-start on first ever visit.
  useEffect(() => {
    if (!window.localStorage.getItem(TOUR_KEY)) {
      const id = window.setTimeout(() => startTour(), 700);
      return () => window.clearTimeout(id);
    }
  }, [startTour]);

  useEffect(() => {
    if (tourOpen) setStep(0);
  }, [tourOpen]);

  const measure = useCallback(() => {
    const sel = STEPS[step]?.target;
    if (!sel) {
      setRect(null);
      return;
    }
    let found: Element | null = null;
    document.querySelectorAll(sel).forEach((el) => {
      if (!found && el.getBoundingClientRect().width > 0) found = el;
    });
    if (found) {
      (found as Element).scrollIntoView({ block: "center", behavior: "smooth" });
      window.setTimeout(() => setRect((found as Element).getBoundingClientRect()), 280);
    } else {
      setRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (!tourOpen) return;
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [tourOpen, step, measure]);

  function finish() {
    window.localStorage.setItem(TOUR_KEY, "1");
    endTour();
  }

  if (!tourOpen) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const pad = 8;

  // Tooltip placement
  const ttWidth = 340;
  let ttStyle: React.CSSProperties;
  if (rect) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const placeRight = rect.right < vw * 0.5 && rect.width < 320;
    if (placeRight) {
      ttStyle = {
        left: Math.min(rect.right + 16, vw - ttWidth - 12),
        top: Math.max(12, Math.min(rect.top, vh - 280)),
      };
    } else {
      const below = rect.bottom + 16 + 260 < vh;
      ttStyle = {
        left: Math.max(12, Math.min(rect.left + rect.width / 2 - ttWidth / 2, vw - ttWidth - 12)),
        top: below ? rect.bottom + 16 : Math.max(12, rect.top - 16 - 250),
      };
    }
  } else {
    ttStyle = { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
  }

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Spotlight / dark overlay */}
      {rect ? (
        <div
          className="pointer-events-none absolute rounded-2xl ring-2 ring-accent-400 transition-all duration-300"
          style={{
            left: rect.left - pad,
            top: rect.top - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            boxShadow: "0 0 0 9999px rgba(5,5,7,0.82)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-950/85" />
      )}

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          className="absolute w-[340px] max-w-[calc(100vw-24px)] rounded-2xl border border-hairline bg-surface p-5 shadow-2xl"
          style={ttStyle}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-600/15 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-purple-ink">
              <MapPin className="size-3.5" />
              {lang === "es" ? "Tour guiado" : "Guided tour"}
            </span>
            <button
              onClick={finish}
              aria-label="Close"
              className="grid size-7 place-items-center rounded-lg text-content-muted transition hover:bg-surface-2 hover:text-content"
            >
              <X className="size-4" />
            </button>
          </div>

          <h3 className="mt-3 text-base font-extrabold tracking-tight text-content">
            {current.title[lang]}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-content-muted">{current.body[lang]}</p>

          {/* Progress dots */}
          <div className="mt-4 flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={
                  i === step
                    ? "h-1.5 w-5 rounded-full bg-primary-500"
                    : "size-1.5 rounded-full bg-hairline"
                }
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-content-muted">
              {step + 1} / {STEPS.length}
            </span>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-hairline px-3 text-sm font-semibold text-content transition hover:bg-surface-2"
                >
                  <ArrowLeft className="size-4" />
                  {lang === "es" ? "Anterior" : "Back"}
                </button>
              )}
              {isLast ? (
                <button
                  onClick={finish}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 text-sm font-bold text-white transition hover:bg-primary-500"
                >
                  <Check className="size-4" />
                  {lang === "es" ? "Listo" : "Done"}
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 text-sm font-bold text-white transition hover:bg-primary-500"
                >
                  {lang === "es" ? "Siguiente" : "Next"}
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          </div>

          {!isLast && (
            <button
              onClick={finish}
              className="mt-3 w-full text-center text-xs font-semibold text-content-muted transition hover:text-content"
            >
              {lang === "es" ? "Saltar el tour" : "Skip the tour"}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
