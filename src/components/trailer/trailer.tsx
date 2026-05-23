"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Pause, Play, RotateCcw, SkipForward, X } from "lucide-react";
import { useUI } from "@/lib/ui-context";
import { cn } from "@/lib/cn";

export type TrailerScene = {
  view?: string;
  selector?: string;
  click?: boolean;
  position?: "center" | "top";
  chapter: string;
  title: string;
  body: string;
  duration: number;
  cta?: { label: string; href: string };
  isFinal?: boolean;
};

const WA_HREF =
  "https://wa.me/5491139375146?text=" +
  encodeURIComponent("Vi el demo de AirPath, quiero arrancar");

// AirPath gold — used for ring, highlight, accents in the trailer.
const ACCENT = "#c9a23c";

const SCENES: TrailerScene[] = [
  {
    position: "center",
    chapter: "AIRPATH",
    title: "Tu carrera en aviación, despegada.",
    body: "El ecosistema que une formación FAA, aeronaves, instructores y escuelas en una sola plataforma. Demo de previsualización.",
    duration: 5500,
  },
  {
    view: "/dashboard",
    position: "top",
    chapter: "INICIO",
    title: "Tu cabina de mando",
    body: "Una sola vista para ver tu progreso, tu ruta de carrera FAA y todo lo que tenés a mano — adaptada al rol que estés usando.",
    duration: 6500,
  },
  {
    view: "/dashboard",
    selector: '[data-tour="career"]',
    position: "top",
    chapter: "RUTA DE CARRERA",
    title: "PPL → IR → CPL → Aerolínea",
    body: "Etapas gamificadas que se desbloquean al completar la anterior. Siempre sabés dónde estás y qué sigue.",
    duration: 7000,
  },
  {
    view: "/dashboard",
    selector: '[data-tour="nav-academy"]',
    click: true,
    position: "top",
    chapter: "ACADEMY",
    title: "5 cursos avalados FAA",
    body: "PPL, IR, CPL, CFI y Conversión. Alineados a FAA Part 141 — acá se forma de verdad, con video, lecturas y evaluaciones.",
    duration: 7500,
  },
  {
    view: "/academy",
    position: "top",
    chapter: "CATÁLOGO",
    title: "Modular y verificable",
    body: "Cada curso con módulos, banco de preguntas randomizado y certificado con código único al finalizar.",
    duration: 6800,
  },
  {
    view: "/academy",
    selector: '[data-tour="nav-written"]',
    click: true,
    position: "top",
    chapter: "EXAMEN WRITTEN",
    title: "Simulacro estilo Sheppard Air",
    body: "Banco randomizado con 5 mecánicas: multiple choice, V/F, identificación visual, ordenamiento y cálculos.",
    duration: 7500,
  },
  {
    view: "/written",
    selector: '[data-tour="nav-marketplace"]',
    click: true,
    position: "top",
    chapter: "MARKETPLACE",
    title: "Aviación en un solo lugar",
    body: "Aeronaves N para time building, instructores FAA, escuelas en USA, AR, CO y MX, y vuelos charter con empty legs.",
    duration: 7500,
  },
  {
    view: "/marketplace",
    position: "top",
    chapter: "RESERVAS",
    title: "Modelo tipo Turo",
    body: "Solicitás una aeronave o instructor — el dueño aprueba. Control total para ambas partes, sin reservas automáticas.",
    duration: 7000,
  },
  {
    view: "/marketplace",
    selector: '[data-tour="nav-certificates"]',
    click: true,
    position: "top",
    chapter: "CERTIFICADOS",
    title: "Verificación pública por código",
    body: "Cada certificado lleva un código único. Una escuela o empleador lo valida en /verify en segundos.",
    duration: 7500,
  },
  {
    view: "/admin",
    position: "top",
    chapter: "ADMIN",
    title: "Métricas en vivo del ecosistema",
    body: "USD 184k de ingresos este mes, 6.842 usuarios activos, 14 validaciones pendientes — todo bajo control.",
    duration: 7500,
  },
  {
    view: "/dashboard",
    selector: '[data-tour="role-switcher"]',
    position: "top",
    chapter: "MULTI-ROL",
    title: "7 perspectivas, un ecosistema",
    body: "Estudiante, Instructor FAA, Escuela, Propietario, Admin, Mecánico y Empleador. Cada uno con su dashboard.",
    duration: 7000,
  },
  {
    view: "/dashboard",
    selector: '[data-tour="assistant"]',
    position: "top",
    chapter: "COPILOTO IA",
    title: "Un asistente que sabe de aviación",
    body: "Preguntale licencias, regulaciones FAR/AIM, costos o cómo va tu progreso. Responde como un instructor senior.",
    duration: 7000,
  },
  {
    position: "center",
    chapter: "TERMINAMOS",
    title: "Recorriste AirPath en 90 segundos.",
    body: "Seguí explorando la plataforma a tu ritmo o, si te gustó, hablemos.",
    duration: 14000,
    isFinal: true,
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

  useEffect(() => {
    elapsedRef.current = 0;
    sceneStartRef.current = Date.now();
    setRect(null);
  }, [i]);

  useEffect(() => {
    if (!trailerMode) {
      setI(0);
      setPaused(false);
      elapsedRef.current = 0;
      setRect(null);
      setCursorXY(null);
    }
  }, [trailerMode]);

  useEffect(() => {
    if (!trailerMode) return;
    const scene = SCENES[i];
    if (scene.view && pathname !== scene.view) router.push(scene.view);
  }, [i, trailerMode, pathname, router]);

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

  const exit = useCallback(() => {
    endTrailer();
    if (pathname !== "/dashboard") router.push("/dashboard");
  }, [endTrailer, pathname, router]);

  const next = useCallback(() => setI((n) => (n + 1) % SCENES.length), []);
  const prev = useCallback(
    () => setI((n) => (n - 1 + SCENES.length) % SCENES.length),
    [],
  );

  useEffect(() => {
    if (!trailerMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") exit();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [trailerMode, exit, next, prev]);

  if (!trailerMode) return null;

  const scene = SCENES[i];
  const isCenter = scene.position === "center";
  const showCursor = Boolean(scene.selector && rect && cursorXY);
  const progressPct = ((i + 1) / SCENES.length) * 100;

  return (
    <>
      {/* Dim layer */}
      <AnimatePresence>
        {isCenter ? (
          <motion.div
            key={`center-dim-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none fixed inset-0 bg-[#0A0A0B]/95"
            style={{ zIndex: 9989 }}
          />
        ) : (
          <motion.div
            key={`dim-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none fixed inset-0"
            style={{
              zIndex: 9989,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.85) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Top progress bar */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-1 bg-white/8"
        style={{ zIndex: 9994 }}
      >
        <motion.div
          className="h-full"
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: ACCENT,
            boxShadow: `0 0 14px ${ACCENT}AA`,
          }}
        />
      </div>

      {/* Top status bar: chapter pill + counter + dots */}
      <div
        className="pointer-events-none fixed inset-x-0 top-3 flex items-center justify-between px-4 sm:px-6"
        style={{ zIndex: 9994 }}
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/85 px-3 py-1 font-mono text-[10px] font-extrabold uppercase tracking-[0.22em] text-white backdrop-blur-md"
          >
            <span
              className="size-1.5 animate-pulse rounded-full"
              style={{ background: ACCENT }}
            />
            {scene.chapter}
          </span>
          <span className="hidden font-mono text-[10px] tracking-widest text-white/60 sm:inline">
            {String(i + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
          </span>
        </div>
        <div className="hidden gap-1 sm:flex">
          {SCENES.map((_, idx) => (
            <div
              key={idx}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: idx === i ? 22 : 8,
                background: idx <= i ? ACCENT : "rgba(255,255,255,0.22)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Highlight ring */}
      <AnimatePresence>
        {rect && !isCenter && (
          <motion.div
            key={`ring-${i}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none fixed rounded-2xl"
            style={{
              top: rect.top - 8,
              left: rect.left - 8,
              width: rect.width + 16,
              height: rect.height + 16,
              zIndex: 9991,
              boxShadow: `0 0 0 3px ${ACCENT}, 0 0 50px 8px ${ACCENT}66, inset 0 0 0 1px rgba(255,255,255,0.1)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Virtual cursor */}
      {showCursor && cursorXY && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0"
          style={{ zIndex: 9992 }}
          animate={{ x: cursorXY.x, y: cursorXY.y }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={clickPulse > 0 ? { scale: [1, 0.72, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 opacity-40 blur-md"
            key={`halo-${clickPulse}`}
          />
          <motion.div
            animate={clickPulse > 0 ? { scale: [1, 0.72, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-white bg-[#1D4ED8] shadow-lg"
            key={`dot-${clickPulse}`}
          />
          <AnimatePresence>
            {clickPulse > 0 && (
              <motion.div
                key={`ring-cur-${clickPulse}`}
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                style={{ borderColor: "#1D4ED8" }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Caption — top or center */}
      <AnimatePresence mode="wait">
        {isCenter ? (
          <motion.div
            key={`center-cap-${i}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-0 flex items-center justify-center px-6"
            style={{ zIndex: 9993 }}
          >
            <div className="pointer-events-auto max-w-4xl text-center">
              <div
                className="mb-6 inline-block font-mono text-[11px] font-extrabold uppercase tracking-[0.32em]"
                style={{ color: ACCENT }}
              >
                {scene.chapter}
              </div>
              <h1 className="mb-6 text-[52px] font-black leading-[0.95] tracking-tight text-white md:text-[78px] lg:text-[100px]">
                {scene.title}
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/70 md:text-xl">
                {scene.body}
              </p>

              {scene.isFinal && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                >
                  <button
                    onClick={exit}
                    className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-7 py-4 text-base font-extrabold text-neutral-950 shadow-2xl transition hover:bg-white/90 sm:text-lg"
                  >
                    Seguir explorando por mi cuenta
                    <ArrowRight className="size-5" />
                  </button>
                  <a
                    href={WA_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={exit}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-4 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/[0.10]"
                  >
                    Quiero arrancar
                    <ArrowRight className="size-4" />
                  </a>
                </motion.div>
              )}

              {scene.cta && !scene.isFinal && (
                <motion.a
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  href={scene.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={exit}
                  className="mt-10 inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-lg font-extrabold text-neutral-950 transition hover:scale-105"
                  style={{
                    background: ACCENT,
                    boxShadow: `0 20px 60px -10px ${ACCENT}AA`,
                  }}
                >
                  {scene.cta.label}
                  <ArrowRight className="size-5" />
                </motion.a>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`top-cap-${i}`}
            initial={{ opacity: 0, y: -22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-x-0 top-16 flex justify-center px-4 sm:top-20 sm:px-6"
            style={{ zIndex: 9993 }}
          >
            <div
              className="pointer-events-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-black/85 p-5 backdrop-blur-md sm:p-7 lg:p-8"
              style={{ boxShadow: `0 30px 80px -20px ${ACCENT}55` }}
            >
              <div
                className="mb-3 font-mono text-[10px] font-extrabold uppercase tracking-[0.28em] sm:text-[11px]"
                style={{ color: ACCENT }}
              >
                {scene.chapter}
              </div>
              <h2 className="mb-3 text-[26px] font-black leading-[1.05] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-[44px]">
                {scene.title}
              </h2>
              <p className="text-base leading-relaxed text-white/75 sm:text-[17px] md:text-lg">
                {scene.body}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big Next button bottom center */}
      {!isCenter && (
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={next}
          className="fixed bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/85 px-6 py-3 text-sm font-extrabold text-white backdrop-blur-md transition hover:scale-105 sm:text-base"
          style={{ zIndex: 9994, boxShadow: `0 12px 40px -10px ${ACCENT}66` }}
        >
          Siguiente
          <ArrowRight className="size-4" />
        </motion.button>
      )}

      {/* Controls bottom right */}
      <div
        className="fixed bottom-6 right-4 z-[9994] flex items-center gap-1 rounded-full border border-white/10 bg-black/85 px-2 py-1.5 backdrop-blur-md sm:right-6"
      >
        <button
          onClick={() => setPaused((p) => !p)}
          title="Pausa (espacio)"
          className="grid size-9 place-items-center rounded-full text-white transition hover:bg-white/10"
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
        <button
          onClick={next}
          title="Siguiente (→)"
          className="grid size-9 place-items-center rounded-full text-white transition hover:bg-white/10"
        >
          <SkipForward className="size-4" />
        </button>
        <button
          onClick={() => setI(0)}
          title="Reiniciar"
          className="grid size-9 place-items-center rounded-full text-white transition hover:bg-white/10"
        >
          <RotateCcw className="size-4" />
        </button>
        <span className="mx-0.5 h-5 w-px bg-white/15" />
        <button
          onClick={exit}
          title="Salir (Esc)"
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-white transition hover:bg-white/10",
          )}
        >
          <X className="size-3.5" />
          Salir
        </button>
      </div>
    </>
  );
}
