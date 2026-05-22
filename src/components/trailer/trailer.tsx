"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw, SkipForward, X } from "lucide-react";
import { useUI } from "@/lib/ui-context";
import { cn } from "@/lib/cn";

export type TrailerScene = {
  view?: string;
  selector?: string;
  click?: boolean;
  position?: "center" | "bottom";
  chapter: string;
  title: string;
  body: string;
  duration: number;
  cta?: { label: string; href: string };
};

const WA_HREF =
  "https://wa.me/5491139375146?text=" +
  encodeURIComponent("Vi el demo de AirPath, quiero arrancar");

const SCENES: TrailerScene[] = [
  {
    position: "center",
    chapter: "AirPath",
    title: "Tu carrera en aviación, despegada",
    body: "El ecosistema que une formación FAA, aeronaves, instructores y escuelas en una sola plataforma. Demo de previsualización.",
    duration: 5500,
  },
  {
    view: "/dashboard",
    position: "bottom",
    chapter: "Inicio",
    title: "Tu cabina de mando",
    body: "Una sola vista para ver tu progreso, tu ruta de carrera FAA y todo lo que tenés a mano.",
    duration: 6500,
  },
  {
    view: "/dashboard",
    selector: '[data-tour="career"]',
    position: "bottom",
    chapter: "Ruta de carrera",
    title: "PPL → IR → CPL → Aerolínea",
    body: "Etapas gamificadas que se desbloquean al completar la anterior. Siempre sabés dónde estás y qué sigue.",
    duration: 7000,
  },
  {
    view: "/dashboard",
    selector: '[data-tour="nav-academy"]',
    click: true,
    position: "bottom",
    chapter: "Academy",
    title: "5 cursos avalados FAA",
    body: "PPL, IR, CPL, CFI y Conversión. Alineados a FAA Part 141. Acá se forma de verdad.",
    duration: 7500,
  },
  {
    view: "/academy",
    position: "bottom",
    chapter: "Catálogo",
    title: "Video, lecturas, diagramas y evaluaciones",
    body: "Cada curso con módulos, banco de preguntas y certificado verificable al finalizar.",
    duration: 6800,
  },
  {
    view: "/academy",
    selector: '[data-tour="nav-written"]',
    click: true,
    position: "bottom",
    chapter: "Examen Written",
    title: "Simulacro estilo Sheppard Air",
    body: "Banco randomizado con 5 mecánicas: multiple choice, V/F, identificación visual, ordenamiento y cálculos.",
    duration: 7500,
  },
  {
    view: "/written",
    selector: '[data-tour="nav-marketplace"]',
    click: true,
    position: "bottom",
    chapter: "Marketplace",
    title: "Aviación en un solo lugar",
    body: "Aeronaves N para time building, instructores FAA, escuelas en USA, AR, CO y MX, y vuelos charter.",
    duration: 7500,
  },
  {
    view: "/marketplace",
    position: "bottom",
    chapter: "Reservas",
    title: "Modelo tipo Turo",
    body: "Solicitás una aeronave o instructor, el dueño aprueba. Control total para ambas partes, sin reservas automáticas.",
    duration: 7000,
  },
  {
    view: "/marketplace",
    selector: '[data-tour="nav-certificates"]',
    click: true,
    position: "bottom",
    chapter: "Certificados",
    title: "Verificación pública por código",
    body: "Cada certificado lleva un código único. Una escuela o empleador lo valida en /verify en segundos.",
    duration: 7500,
  },
  {
    view: "/admin",
    position: "bottom",
    chapter: "Admin",
    title: "Métricas y validaciones en vivo",
    body: "USD 184k de ingresos este mes, 6.842 usuarios activos, 14 validaciones pendientes. Todo el ecosistema bajo control.",
    duration: 7500,
  },
  {
    view: "/dashboard",
    selector: '[data-tour="role-switcher"]',
    position: "bottom",
    chapter: "Multi-rol",
    title: "7 perspectivas, un solo ecosistema",
    body: "Estudiante, Instructor FAA, Escuela, Propietario, Admin, Mecánico y Empleador. Cada uno con su dashboard.",
    duration: 7000,
  },
  {
    view: "/dashboard",
    selector: '[data-tour="assistant"]',
    position: "bottom",
    chapter: "Copiloto IA",
    title: "Un asistente que sabe de aviación",
    body: "Preguntale licencias, regulaciones FAR/AIM, costos, V-speeds o cómo va tu progreso. Responde como un instructor senior.",
    duration: 7000,
  },
  {
    position: "center",
    chapter: "¿Empezamos?",
    title: "Esta puede ser tu plataforma",
    body: "AirPath está listo para escalar. Si te gustó, hablemos y armamos la tuya.",
    duration: 12000,
    cta: { label: "Quiero arrancar", href: WA_HREF },
  },
];

export function Trailer() {
  const { trailerMode, endTrailer } = useUI();
  const router = useRouter();
  const pathname = usePathname();

  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [cursorXY, setCursorXY] = useState<{ x: number; y: number } | null>(null);
  const [clickPulse, setClickPulse] = useState(0);

  const sceneStartRef = useRef<number>(0);
  const elapsedRef = useRef(0);

  // Reset timing + visuals on every scene change.
  useEffect(() => {
    elapsedRef.current = 0;
    sceneStartRef.current = Date.now();
    setRect(null);
  }, [i]);

  // When trailer ends, reset to scene 0.
  useEffect(() => {
    if (!trailerMode) {
      setI(0);
      setPaused(false);
      elapsedRef.current = 0;
      setRect(null);
      setCursorXY(null);
    }
  }, [trailerMode]);

  // Navigate to scene.view if needed.
  useEffect(() => {
    if (!trailerMode) return;
    const scene = SCENES[i];
    if (scene.view && pathname !== scene.view) router.push(scene.view);
  }, [i, trailerMode, pathname, router]);

  // Measure target + virtual click (defensive two-pass).
  useEffect(() => {
    if (!trailerMode) return;
    const scene = SCENES[i];
    if (!scene.selector) {
      setRect(null);
      return;
    }
    const initialDelay = scene.view ? 480 : 200;
    const timeouts: number[] = [];

    const measure = () => {
      let found: Element | null = null;
      document.querySelectorAll(scene.selector!).forEach((el) => {
        if (!found && el.getBoundingClientRect().width > 0) found = el;
      });
      if (found) {
        const r = (found as Element).getBoundingClientRect();
        setRect(r);
        setCursorXY({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
    };

    timeouts.push(window.setTimeout(measure, initialDelay));
    timeouts.push(window.setTimeout(measure, initialDelay + 300));

    if (scene.click) {
      timeouts.push(
        window.setTimeout(() => {
          let target: HTMLElement | null = null;
          document.querySelectorAll(scene.selector!).forEach((el) => {
            if (!target && (el as HTMLElement).getBoundingClientRect().width > 0)
              target = el as HTMLElement;
          });
          if (target) {
            setClickPulse((p) => p + 1);
            (target as HTMLElement).click();
          }
        }, initialDelay + 1100),
      );
    }

    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, [i, trailerMode]);

  // Keep rect in sync on resize / scroll.
  useEffect(() => {
    if (!trailerMode) return;
    const recalc = () => {
      const sel = SCENES[i].selector;
      if (!sel) return;
      let found: Element | null = null;
      document.querySelectorAll(sel).forEach((el) => {
        if (!found && el.getBoundingClientRect().width > 0) found = el;
      });
      if (found) {
        const r = (found as Element).getBoundingClientRect();
        setRect(r);
        setCursorXY({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
    };
    window.addEventListener("resize", recalc);
    window.addEventListener("scroll", recalc, true);
    return () => {
      window.removeEventListener("resize", recalc);
      window.removeEventListener("scroll", recalc, true);
    };
  }, [i, trailerMode]);

  // Auto-advance with pause tracking.
  useEffect(() => {
    if (!trailerMode) return;
    if (paused) {
      elapsedRef.current += Date.now() - sceneStartRef.current;
      return;
    }
    sceneStartRef.current = Date.now();
    const remaining = Math.max(SCENES[i].duration - elapsedRef.current, 400);
    const t = window.setTimeout(() => {
      setI((n) => (n + 1) % SCENES.length);
    }, remaining);
    return () => window.clearTimeout(t);
  }, [i, paused, trailerMode]);

  // Keyboard shortcuts.
  useEffect(() => {
    if (!trailerMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        endTrailer();
        router.push("/login");
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.key === "ArrowRight") {
        setI((n) => (n + 1) % SCENES.length);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [trailerMode, endTrailer, router]);

  if (!trailerMode) return null;

  const scene = SCENES[i];
  const position = scene.position ?? "bottom";
  const showCursor = Boolean(scene.selector && rect && cursorXY);

  function exit() {
    endTrailer();
    router.push("/login");
  }

  return (
    <>
      {/* Top progress dots */}
      <div className="pointer-events-none fixed left-1/2 top-4 z-[9990] flex -translate-x-1/2 gap-1.5 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 backdrop-blur-md">
        {SCENES.map((_, idx) => (
          <span
            key={idx}
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              idx === i ? "w-6 bg-white" : idx < i ? "w-1.5 bg-white/70" : "w-1.5 bg-white/25",
            )}
          />
        ))}
      </div>

      {/* Highlight ring around target */}
      {rect && (
        <div
          className="pointer-events-none fixed rounded-2xl transition-all duration-500"
          style={{
            left: rect.left - 8,
            top: rect.top - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            zIndex: 9991,
            boxShadow:
              "0 0 0 2px #1D4ED8, 0 0 0 6px rgba(29,78,216,0.25), 0 0 36px 6px rgba(59,130,246,0.45)",
          }}
        />
      )}

      {/* Virtual cursor */}
      {showCursor && cursorXY && (
        <motion.div
          className="pointer-events-none fixed"
          style={{ left: 0, top: 0, zIndex: 9992 }}
          animate={{ x: cursorXY.x - 6, y: cursorXY.y - 6 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative">
            <span className="absolute -left-[10px] -top-[10px] block size-7 rounded-full bg-blue-500 opacity-30 blur-md" />
            <motion.span
              className="relative block size-3 rounded-full border-[2.5px] border-white bg-[#1D4ED8] shadow-lg"
              animate={clickPulse > 0 ? { scale: [1, 0.72, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              key={`dot-${clickPulse}`}
            />
            <AnimatePresence>
              {clickPulse > 0 && (
                <motion.span
                  key={`ring-${clickPulse}`}
                  className="absolute -left-[2px] -top-[2px] block size-4 rounded-full border-2 border-blue-400"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 2.6, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Caption */}
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          className={cn(
            "pointer-events-none fixed mx-auto w-[min(560px,calc(100vw-32px))]",
            position === "center"
              ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              : "bottom-6 left-1/2 -translate-x-1/2",
          )}
          style={{ zIndex: 9993 }}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pointer-events-auto rounded-2xl border border-white/10 bg-black/85 p-5 text-white shadow-2xl backdrop-blur-md sm:p-6">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300">
              {scene.chapter}
            </p>
            <h2 className="mt-1.5 text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">
              {scene.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-[15px]">{scene.body}</p>
            {scene.cta && (
              <a
                href={scene.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-blue-400"
              >
                {scene.cta.label}
                <span aria-hidden>→</span>
              </a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating controls (bottom right) */}
      <div
        className="pointer-events-auto fixed bottom-6 right-6 flex items-center gap-0.5 rounded-full border border-white/10 bg-black/85 px-1.5 py-1 text-white backdrop-blur-md"
        style={{ zIndex: 9994 }}
      >
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Reanudar" : "Pausa"}
          className="grid size-9 place-items-center rounded-full transition hover:bg-white/10"
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
        <button
          type="button"
          onClick={() => setI((n) => (n + 1) % SCENES.length)}
          aria-label="Siguiente"
          className="grid size-9 place-items-center rounded-full transition hover:bg-white/10"
        >
          <SkipForward className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            elapsedRef.current = 0;
            sceneStartRef.current = Date.now();
            setI(0);
          }}
          aria-label="Reiniciar"
          className="grid size-9 place-items-center rounded-full transition hover:bg-white/10"
        >
          <RotateCcw className="size-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-white/15" />
        <button
          type="button"
          onClick={exit}
          aria-label="Salir"
          className="grid size-9 place-items-center rounded-full transition hover:bg-white/10"
        >
          <X className="size-4" />
        </button>
        <span className="ml-2 mr-2 font-mono text-[11px] tabular-nums text-white/65">
          {i + 1}/{SCENES.length}
        </span>
      </div>
    </>
  );
}
