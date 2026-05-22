"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronRight,
  CreditCard,
  Globe2,
  GraduationCap,
  Layers,
  LogIn,
  Plane,
  PlaneTakeoff,
  PlayCircle,
  Quote,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTr } from "@/lib/i18n";
import { CAREER_STAGES } from "@/data/mock";
import { COURSES } from "@/data/academy";
import { toneGradient, toneIcon } from "@/lib/tone";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/shell/language-toggle";
import { cn } from "@/lib/cn";

type Tr = ReturnType<typeof useTr>;

/* ------------------------------------------------------------------ */
/*  Motion presets                                                      */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const tr = useTr();

  return (
    <main className="dark min-h-dvh bg-background text-content">
      <Header tr={tr} />
      <Hero tr={tr} />
      <PriceCase tr={tr} />
      <Pillars tr={tr} />
      <CareerPath tr={tr} />
      <CoursesShowcase tr={tr} />
      <NoSmoke tr={tr} />
      <Included tr={tr} />
      <Testimonials tr={tr} />
      <FinalCTA tr={tr} />
      <Footer tr={tr} />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  1 · Sticky header                                                   */
/* ------------------------------------------------------------------ */

function Header({ tr }: { tr: Tr }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-hairline bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6">
        <Link href="/" aria-label="AirPath" className="shrink-0">
          <Logo size="md" onDark />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex" leftIcon={LogIn}>
            {tr({ es: "Iniciar sesión", en: "Sign in" })}
          </Button>
          <Button href="/login" size="sm" rightIcon={ArrowRight}>
            {tr({ es: "Crear cuenta", en: "Sign up" })}
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  2 · Hero                                                            */
/* ------------------------------------------------------------------ */

function Hero({ tr }: { tr: Tr }) {
  return (
    <section className="relative -mt-16 overflow-hidden pt-16 sm:-mt-[72px] sm:pt-[72px]">
      {/* decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.14]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-background" />
        <div className="absolute -left-32 -top-24 size-[26rem] glow-purple opacity-50" />
        <div className="absolute -right-28 top-20 size-[22rem] glow-gold opacity-25" />
        <FlightArc />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:pt-24">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent-300"
          >
            <Sparkles className="size-3.5" />
            {tr({
              es: "La aviación no es solo para ricos",
              en: "Aviation isn't only for the wealthy",
            })}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-5 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]"
          >
            {tr({ es: "Tu carrera en la aviación,", en: "Your aviation career," })}{" "}
            <span className="text-gradient-gold">
              {tr({ es: "despegada", en: "cleared for takeoff" })}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
          >
            {tr({
              es: "El ecosistema que une formación FAA, aeronaves para time building, instructores y escuelas — todo en un solo lugar. De estudiante a piloto de aerolínea.",
              en: "The ecosystem that unites FAA training, aircraft for time building, instructors and flight schools — all in one place. From student to airline pilot.",
            })}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/login" size="lg" rightIcon={ArrowRight} className="sm:w-auto">
              {tr({ es: "Empezá ahora", en: "Get started" })}
            </Button>
            <Button
              href="/login"
              size="lg"
              variant="outline"
              leftIcon={PlayCircle}
              className="border-white/15 text-white hover:bg-white/5 sm:w-auto"
            >
              {tr({ es: "Ver la demo", en: "See the demo" })}
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white/55"
          >
            <ShieldCheck className="size-4 text-accent-400" />
            {tr({
              es: "Formación avalada por FAA (USA) y ANAC (Argentina)",
              en: "Training backed by FAA (USA) and ANAC (Argentina)",
            })}
          </motion.p>
        </motion.div>

        {/* hero stat strip */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-4"
        >
          {[
            { value: "5", label: tr({ es: "Cursos FAA", en: "FAA courses" }) },
            { value: "4", label: tr({ es: "Verticales del marketplace", en: "Marketplace verticals" }) },
            { value: "USD 45k", label: tr({ es: "Para tu licencia comercial", en: "To your commercial license" }) },
            { value: "100%", label: tr({ es: "Certificados verificables", en: "Verifiable certificates" }) },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur-sm"
            >
              <p className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-[13px] leading-snug text-white/55">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FlightArc() {
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-70"
      fill="none"
      aria-hidden
    >
      <circle cx="1010" cy="120" r="70" stroke="white" strokeOpacity="0.06" />
      <circle cx="1010" cy="120" r="130" stroke="white" strokeOpacity="0.05" />
      <circle cx="1010" cy="120" r="200" stroke="white" strokeOpacity="0.04" />
      <path
        d="M -40 560 Q 420 460 680 300 T 1240 30"
        stroke="url(#heroArc)"
        strokeWidth="2"
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
      <circle cx="100" cy="514" r="5" fill="#c9a23c" />
      <circle cx="620" cy="332" r="4" fill="#d8b4fe" />
      <g transform="translate(1110 90) rotate(-38)">
        <path d="M0 -13 L9 11 L0 4 L-9 11 Z" fill="#f5d78e" />
      </g>
      <defs>
        <linearGradient id="heroArc" x1="0" y1="560" x2="1200" y2="30">
          <stop stopColor="#c084fc" />
          <stop offset="1" stopColor="#f5d78e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  3 · The real case — price comparison                                */
/* ------------------------------------------------------------------ */

function PriceCase({ tr }: { tr: Tr }) {
  return (
    <Section>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-accent-500/30 bg-gradient-to-br from-accent-500/[0.12] via-surface to-surface p-6 sm:p-10">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-grid opacity-[0.07]" />
            <div className="absolute -right-20 -top-20 size-72 glow-gold opacity-30" />
          </div>
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-ink">
                <Target className="size-3.5" />
                {tr({ es: "El caso real", en: "The real case" })}
              </p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-content sm:text-[2.6rem]">
                {tr({ es: "Sacá tu licencia desde ", en: "Get your license from " })}
                <span className="text-gradient-gold">USD 45.000</span>
                <br className="hidden sm:block" />
                {tr({ es: " — no ", en: " — not " })}
                <span className="text-content-muted line-through decoration-danger-500/70 decoration-2">
                  USD 110.000
                </span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-content-muted sm:text-base">
                {tr({
                  es: "Te mostramos la ruta más eficiente: el país donde entrenar, las horas que necesitás y cómo financiar cada etapa. Sin sobreprecios ni intermediarios.",
                  en: "We map the most efficient route: where to train, the hours you need and how to fund each stage. No markups, no middlemen.",
                })}
              </p>
            </div>

            <div className="grid gap-3">
              <PriceRow
                label={tr({ es: "Ruta tradicional", en: "Traditional route" })}
                amount="USD 110.000"
                muted
              />
              <div className="flex items-center gap-2 pl-1 text-xs font-bold uppercase tracking-wide text-gold-ink">
                <ArrowRight className="size-4 rotate-90" />
                {tr({ es: "Con la ruta AirPath", en: "With the AirPath route" })}
              </div>
              <PriceRow
                label={tr({ es: "Ruta optimizada AirPath", en: "AirPath optimized route" })}
                amount="USD 45.000"
                highlight
              />
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-gold-ink">
                <Sparkles className="size-4" />
                {tr({ es: "Hasta 60% de ahorro", en: "Up to 60% savings" })}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function PriceRow({
  label,
  amount,
  highlight,
  muted,
}: {
  label: string;
  amount: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl border p-4",
        highlight
          ? "border-accent-500/45 bg-accent-500/[0.1]"
          : "border-hairline bg-surface-2",
      )}
    >
      <span className={cn("text-sm font-semibold", muted ? "text-content-muted" : "text-content")}>
        {label}
      </span>
      <span
        className={cn(
          "text-lg font-extrabold tracking-tight tabular-nums sm:text-xl",
          highlight ? "text-gold-ink" : "text-content-muted line-through decoration-2",
        )}
      >
        {amount}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  4 · Two pillars                                                     */
/* ------------------------------------------------------------------ */

function Pillars({ tr }: { tr: Tr }) {
  const academyPoints = [
    tr({ es: "5 cursos oficiales FAA", en: "5 official FAA courses" }),
    tr({ es: "Banco de preguntas randomizado", en: "Randomized question bank" }),
    tr({ es: "Simulador de examen Written", en: "Written exam simulator" }),
    tr({ es: "Certificados verificables", en: "Verifiable certificates" }),
  ];
  const marketPoints = [
    tr({ es: "Aeronaves para time building", en: "Aircraft for time building" }),
    tr({ es: "Instructores FAA verificados", en: "Verified FAA instructors" }),
    tr({ es: "Escuelas de vuelo certificadas", en: "Certified flight schools" }),
    tr({ es: "Vuelos charter a demanda", en: "On-demand charter flights" }),
  ];

  return (
    <Section>
      <Reveal>
        <SectionHeading
          eyebrow={tr({ es: "Dos plataformas, un ecosistema", en: "Two platforms, one ecosystem" })}
          title={tr({
            es: "Todo lo que tu carrera necesita",
            en: "Everything your career needs",
          })}
        />
      </Reveal>

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <Reveal>
          <PillarCard
            accent="purple"
            icon={GraduationCap}
            kicker={tr({ es: "Aprendé", en: "Learn" })}
            title="AirPath Academy"
            description={tr({
              es: "El LMS que te lleva de cero a la cabina con contenido FAA estructurado, práctica real y certificación.",
              en: "The LMS that takes you from zero to the flight deck with structured FAA content, real practice and certification.",
            })}
            points={academyPoints}
            href="/login"
            cta={tr({ es: "Explorar la academia", en: "Explore the academy" })}
          />
        </Reveal>
        <Reveal delay={0.08}>
          <PillarCard
            accent="gold"
            icon={Store}
            kicker={tr({ es: "Volá", en: "Fly" })}
            title="AirPath Marketplace"
            description={tr({
              es: "El marketplace de la aviación: encontrá aeronaves, instructores, escuelas y charter, todo verificado.",
              en: "The aviation marketplace: find aircraft, instructors, flight schools and charter — all verified.",
            })}
            points={marketPoints}
            href="/login"
            cta={tr({ es: "Explorar el marketplace", en: "Explore the marketplace" })}
          />
        </Reveal>
      </div>
    </Section>
  );
}

function PillarCard({
  accent,
  icon: Icon,
  kicker,
  title,
  description,
  points,
  href,
  cta,
}: {
  accent: "purple" | "gold";
  icon: LucideIcon;
  kicker: string;
  title: string;
  description: string;
  points: string[];
  href: string;
  cta: string;
}) {
  const isPurple = accent === "purple";
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-[transform,border-color] duration-200 hover:-translate-y-1 sm:p-8",
        isPurple
          ? "border-primary-500/25 bg-gradient-to-br from-primary-700/20 via-surface to-surface hover:border-primary-500/45"
          : "border-accent-500/25 bg-gradient-to-br from-accent-500/[0.1] via-surface to-surface hover:border-accent-500/45",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 size-56 opacity-40 transition-opacity group-hover:opacity-60",
          isPurple ? "glow-purple" : "glow-gold",
        )}
      />
      <div className="relative">
        <span
          className={cn(
            "grid size-14 place-items-center rounded-2xl",
            isPurple ? "bg-primary-600/20 text-purple-ink" : "bg-accent-500/15 text-gold-ink",
          )}
        >
          <Icon className="size-7" />
        </span>
        <p
          className={cn(
            "mt-5 text-[11px] font-bold uppercase tracking-[0.16em]",
            isPurple ? "text-purple-ink" : "text-gold-ink",
          )}
        >
          {kicker}
        </p>
        <h3 className="mt-1.5 text-2xl font-extrabold tracking-tight text-content">{title}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-content-muted">{description}</p>

        <ul className="mt-6 space-y-2.5">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-content">
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full",
                  isPurple ? "bg-primary-600/20 text-purple-ink" : "bg-accent-500/15 text-gold-ink",
                )}
              >
                <Check className="size-3" strokeWidth={3} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-7 flex-1" />
      <Link
        href={href}
        className={cn(
          "relative inline-flex items-center gap-1.5 text-sm font-bold transition hover:gap-2.5",
          isPurple ? "text-purple-ink" : "text-gold-ink",
        )}
      >
        {cta}
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  5 · Career path                                                     */
/* ------------------------------------------------------------------ */

function CareerPath({ tr }: { tr: Tr }) {
  return (
    <Section>
      <Reveal>
        <SectionHeading
          eyebrow={tr({ es: "Tu ruta de vuelo", en: "Your flight plan" })}
          title={tr({
            es: "De Piloto Privado a Piloto de Aerolínea",
            en: "From Private Pilot to Airline Pilot",
          })}
          description={tr({
            es: "Una ruta clara, etapa por etapa. AirPath te acompaña en cada habilitación.",
            en: "A clear route, stage by stage. AirPath guides you through every rating.",
          })}
        />
      </Reveal>

      <Reveal delay={0.05}>
        <div className="relative mt-10 overflow-hidden rounded-3xl border border-hairline bg-surface p-5 sm:p-8">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]" />
          <div className="no-scrollbar relative overflow-x-auto pb-1">
            <div className="flex min-w-[680px] items-stretch gap-3">
              {CAREER_STAGES.map((stage, i) => (
                <div key={stage.id} className="flex flex-1 items-center gap-3">
                  <div className="flex-1 rounded-2xl border border-hairline bg-surface-2 p-4 transition hover:border-primary-500/40">
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-gradient-to-br from-primary-500 to-primary-800 px-2 py-1 text-xs font-extrabold text-white">
                        {stage.code}
                      </span>
                      <span className="text-xs font-bold tabular-nums text-content-muted">
                        0{i + 1}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-extrabold tracking-tight text-content">
                      {tr(stage.name)}
                    </p>
                    <p className="mt-1 text-[13px] leading-snug text-content-muted">
                      {tr(stage.blurb)}
                    </p>
                  </div>
                  {i < CAREER_STAGES.length - 1 && (
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-600/15 text-purple-ink">
                      <ChevronRight className="size-4" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-6 flex items-center gap-2 text-sm font-medium text-content-muted">
            <Route className="size-4 text-purple-ink" />
            {tr({
              es: "Cada etapa con cursos, horas de vuelo y checkride incluidos.",
              en: "Each stage includes courses, flight hours and checkride.",
            })}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  6 · Courses showcase                                                */
/* ------------------------------------------------------------------ */

function CoursesShowcase({ tr }: { tr: Tr }) {
  return (
    <Section>
      <Reveal>
        <SectionHeading
          eyebrow={tr({ es: "AirPath Academy", en: "AirPath Academy" })}
          title={tr({
            es: "Cinco cursos oficiales FAA",
            en: "Five official FAA courses",
          })}
          description={tr({
            es: "Cada curso con módulos, lecciones en video, evaluaciones y simulacro de examen Written. Contenido FAA Part 141 de verdad.",
            en: "Each course with modules, video lessons, assessments and a Written mock exam. Real FAA Part 141 content.",
          })}
        />
      </Reveal>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {COURSES.map((course) => (
          <motion.div
            key={course.id}
            variants={fadeUp}
            className="group flex h-full flex-col rounded-2xl border border-hairline bg-surface p-5 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-primary-500/40"
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-xl",
                  toneIcon[course.accent],
                )}
              >
                <GraduationCap className="size-5" />
              </span>
              <span
                className={cn(
                  "rounded-lg bg-gradient-to-br px-2 py-1 text-[11px] font-extrabold text-white",
                  toneGradient[course.accent],
                )}
              >
                {course.code}
              </span>
            </div>
            <h3 className="mt-3.5 text-base font-bold tracking-tight text-content">
              {tr(course.title)}
            </h3>
            <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-content-muted">
              {tr(course.tagline)}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-muted">
                <Plane className="size-3.5" />
                {tr({
                  es: `${course.hours} h · ${course.faaPart}`,
                  en: `${course.hours} hr · ${course.faaPart}`,
                })}
              </span>
              <span className="text-sm font-extrabold tracking-tight text-content">
                ${course.price.toLocaleString("en-US")}
              </span>
            </div>
          </motion.div>
        ))}

        {/* CTA tile completing the 6-cell grid */}
        <motion.div variants={fadeUp}>
          <Link
            href="/login"
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-primary-500/30 bg-gradient-to-br from-primary-700/30 via-surface to-surface p-5 transition hover:-translate-y-1 hover:border-primary-500/50"
          >
            <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 size-44 glow-purple opacity-40" />
            <div className="relative">
              <span className="grid size-11 place-items-center rounded-xl bg-primary-600/20 text-purple-ink">
                <BookOpen className="size-5" />
              </span>
              <h3 className="mt-3.5 text-base font-bold tracking-tight text-content">
                {tr({ es: "Empezá por el PPL", en: "Start with the PPL" })}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-content-muted">
                {tr({
                  es: "Creá tu cuenta y desbloqueá el catálogo completo de la academia.",
                  en: "Create your account and unlock the academy's full catalog.",
                })}
              </p>
            </div>
            <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-purple-ink transition group-hover:gap-2.5">
              {tr({ es: "Ver todos los cursos", en: "See all courses" })}
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  7 · No vendemos humo                                                */
/* ------------------------------------------------------------------ */

function NoSmoke({ tr }: { tr: Tr }) {
  const points = [
    {
      icon: ShieldCheck,
      title: tr({ es: "Autoridades reales", en: "Real authorities" }),
      body: tr({
        es: "Formación alineada con la FAA (Estados Unidos) y la ANAC (Argentina). Estándares oficiales, no atajos.",
        en: "Training aligned with the FAA (United States) and ANAC (Argentina). Official standards, no shortcuts.",
      }),
    },
    {
      icon: BadgeCheck,
      title: tr({ es: "Instructores con licencia", en: "Licensed instructors" }),
      body: tr({
        es: "Cada instructor de la red está verificado con sus licencias y habilitaciones vigentes.",
        en: "Every instructor in the network is verified with valid licenses and ratings.",
      }),
    },
    {
      icon: Target,
      title: tr({ es: "Resultados medibles", en: "Measurable results" }),
      body: tr({
        es: "Progreso por horas, puntajes y certificados. Sabés exactamente dónde estás parado.",
        en: "Progress by hours, scores and certificates. You know exactly where you stand.",
      }),
    },
  ];

  return (
    <Section>
      <div className="relative overflow-hidden rounded-3xl border border-accent-500/25 bg-gradient-to-b from-accent-500/[0.07] to-surface p-6 sm:p-10 lg:p-12">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-[0.07]" />
          <div className="absolute -left-24 bottom-0 size-72 glow-gold opacity-25" />
        </div>
        <div className="relative">
          <Reveal>
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-ink">
                <ShieldCheck className="size-3.5" />
                {tr({ es: "Confianza", en: "Trust" })}
              </p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-content sm:text-[2.6rem]">
                {tr({ es: "No vendemos humo.", en: "We don't sell hype." })}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-content-muted sm:text-base">
                {tr({
                  es: "Detrás de cada curso hay autoridades aeronáuticas reales. Si te entrenás con AirPath, te entrenás con estándares que vuelan de verdad.",
                  en: "Behind every course there are real aviation authorities. Train with AirPath and you train to standards that actually fly.",
                })}
              </p>
            </div>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-9 grid gap-4 sm:grid-cols-3"
          >
            {points.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="rounded-2xl border border-hairline bg-surface p-5"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-accent-500/15 text-gold-ink">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-3.5 text-base font-bold tracking-tight text-content">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-content-muted">{body}</p>
              </motion.div>
            ))}
          </motion.div>

          <Reveal delay={0.1}>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <AuthorityChip code="FAA" label={tr({ es: "Estados Unidos", en: "United States" })} />
              <span className="hidden h-8 w-px bg-hairline sm:block" />
              <AuthorityChip code="ANAC" label={tr({ es: "Argentina", en: "Argentina" })} />
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function AuthorityChip({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-12 place-items-center rounded-xl border border-accent-500/30 bg-accent-500/10 text-sm font-extrabold tracking-tight text-gold-ink">
        {code}
      </span>
      <div>
        <p className="text-sm font-bold text-content">{code}</p>
        <p className="text-xs text-content-muted">{label}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  8 · What's included                                                 */
/* ------------------------------------------------------------------ */

function Included({ tr }: { tr: Tr }) {
  const features: { icon: LucideIcon; title: string; body: string }[] = [
    {
      icon: BookOpen,
      title: tr({ es: "LMS de aviación", en: "Aviation LMS" }),
      body: tr({
        es: "Cursos FAA, lecciones, banco de preguntas y simulador Written.",
        en: "FAA courses, lessons, question bank and Written simulator.",
      }),
    },
    {
      icon: Plane,
      title: tr({ es: "Marketplace", en: "Marketplace" }),
      body: tr({
        es: "Aeronaves, instructores, escuelas y charter — verificados.",
        en: "Aircraft, instructors, schools and charter — verified.",
      }),
    },
    {
      icon: Users,
      title: tr({ es: "Multi-rol", en: "Multi-role" }),
      body: tr({
        es: "Estudiantes, instructores, escuelas, propietarios y operadores.",
        en: "Students, instructors, schools, owners and operators.",
      }),
    },
    {
      icon: CreditCard,
      title: tr({ es: "Pagos integrados", en: "Integrated payments" }),
      body: tr({
        es: "Reservas, membresías y comisiones en un flujo único.",
        en: "Bookings, memberships and commissions in a single flow.",
      }),
    },
    {
      icon: BadgeCheck,
      title: tr({ es: "Certificación", en: "Certification" }),
      body: tr({
        es: "Certificados verificables públicamente por código.",
        en: "Certificates publicly verifiable by code.",
      }),
    },
    {
      icon: Globe2,
      title: tr({ es: "Bilingüe", en: "Bilingual" }),
      body: tr({
        es: "Toda la plataforma en español e inglés, en un clic.",
        en: "The entire platform in Spanish and English, one click away.",
      }),
    },
  ];

  return (
    <Section>
      <Reveal>
        <SectionHeading
          eyebrow={tr({ es: "Qué incluye", en: "What's included" })}
          title={tr({ es: "Un ecosistema completo", en: "A complete ecosystem" })}
          description={tr({
            es: "Todo lo que necesita la industria, integrado en una sola plataforma.",
            en: "Everything the industry needs, integrated into a single platform.",
          })}
        />
      </Reveal>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map(({ icon: Icon, title, body }) => (
          <motion.div
            key={title}
            variants={fadeUp}
            className="group rounded-2xl border border-hairline bg-surface p-5 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-primary-500/40"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-primary-600/15 text-purple-ink transition-colors group-hover:bg-primary-600/25">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-3.5 text-base font-bold tracking-tight text-content">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-content-muted">{body}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  9 · Testimonials                                                    */
/* ------------------------------------------------------------------ */

function Testimonials({ tr }: { tr: Tr }) {
  const items = [
    {
      initials: "MR",
      accent: "purple" as const,
      name: "Mariana Rojas",
      role: tr({ es: "Piloto Comercial · Medellín", en: "Commercial Pilot · Medellín" }),
      quote: tr({
        es: "Pensaba que volar era imposible para alguien como yo. AirPath me mostró la ruta real y los números reales. Hoy cobro por volar.",
        en: "I thought flying was impossible for someone like me. AirPath showed me the real route and the real numbers. Today I get paid to fly.",
      }),
    },
    {
      initials: "JC",
      accent: "gold" as const,
      name: "James Carter",
      role: tr({ es: "Estudiante IR · Fort Lauderdale", en: "IR Student · Fort Lauderdale" }),
      quote: tr({
        es: "El simulador Written me preparó mejor que cualquier libro. Aprobé mi examen FAA al primer intento con 92%.",
        en: "The Written simulator prepared me better than any book. I passed my FAA exam on the first try with 92%.",
      }),
    },
    {
      initials: "DT",
      accent: "sky" as const,
      name: "Diego Torres",
      role: tr({ es: "Propietario de aeronave · Austin", en: "Aircraft Owner · Austin" }),
      quote: tr({
        es: "Publiqué mi Cessna en el marketplace y mis horas rentadas se duplicaron. La validación documental me da total tranquilidad.",
        en: "I listed my Cessna on the marketplace and my rented hours doubled. The document validation gives me total peace of mind.",
      }),
    },
  ];

  return (
    <Section>
      <Reveal>
        <SectionHeading
          eyebrow={tr({ es: "Historias reales", en: "Real stories" })}
          title={tr({ es: "Pilotos que ya despegaron", en: "Pilots who already took off" })}
        />
      </Reveal>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-9 grid gap-4 lg:grid-cols-3"
      >
        {items.map((t) => (
          <motion.figure
            key={t.name}
            variants={fadeUp}
            className="flex h-full flex-col rounded-2xl border border-hairline bg-surface p-6"
          >
            <div className="flex items-center gap-2 text-gold-ink">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4" fill="currentColor" />
              ))}
              <Quote className="ml-auto size-6 text-content-muted/40" />
            </div>
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-content">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-hairline pt-4">
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-full text-sm font-extrabold",
                  t.accent === "purple" && "bg-primary-600/20 text-purple-ink",
                  t.accent === "gold" && "bg-accent-500/15 text-gold-ink",
                  t.accent === "sky" && "bg-sky-500/15 text-sky-400",
                )}
              >
                {t.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-content">{t.name}</p>
                <p className="text-xs text-content-muted">{t.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  10 · Final CTA                                                      */
/* ------------------------------------------------------------------ */

function FinalCTA({ tr }: { tr: Tr }) {
  return (
    <Section>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-primary-500/30 bg-gradient-to-br from-primary-700 via-[#1c0c33] to-neutral-950 px-6 py-12 text-center sm:px-10 sm:py-16">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-grid opacity-[0.12]" />
            <div className="absolute -left-20 -top-20 size-72 glow-purple opacity-50" />
            <div className="absolute -bottom-24 -right-16 size-72 glow-gold opacity-25" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-grid size-14 place-items-center rounded-2xl bg-white/8 text-accent-300 ring-1 ring-white/10">
              <PlaneTakeoff className="size-7" />
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-[2.7rem]">
              {tr({
                es: "Tu cabina te está esperando",
                en: "Your flight deck is waiting",
              })}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
              {tr({
                es: "Creá tu cuenta gratis y empezá a trazar tu ruta hacia la aviación profesional hoy mismo.",
                en: "Create your free account and start charting your route to professional aviation today.",
              })}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button href="/login" size="lg" variant="gold" rightIcon={ArrowRight}>
                {tr({ es: "Crear cuenta gratis", en: "Create a free account" })}
              </Button>
              <Button
                href="/login"
                size="lg"
                variant="outline"
                leftIcon={PlayCircle}
                className="border-white/15 text-white hover:bg-white/5"
              >
                {tr({ es: "Ver la demo", en: "See the demo" })}
              </Button>
            </div>
            <p className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-white/45">
              <span className="size-2 rounded-full bg-accent-400 animate-pulse-gold" />
              {tr({
                es: "Sin tarjeta · Acceso inmediato a la demo",
                en: "No card required · Instant demo access",
              })}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  11 · Footer                                                         */
/* ------------------------------------------------------------------ */

function Footer({ tr }: { tr: Tr }) {
  const groups: { title: string; links: string[] }[] = [
    {
      title: tr({ es: "Plataforma", en: "Platform" }),
      links: [
        "AirPath Academy",
        "AirPath Marketplace",
        tr({ es: "Ruta de carrera", en: "Career path" }),
        tr({ es: "Certificados", en: "Certificates" }),
      ],
    },
    {
      title: tr({ es: "Compañía", en: "Company" }),
      links: [
        tr({ es: "Sobre AirPath", en: "About AirPath" }),
        tr({ es: "Misión", en: "Mission" }),
        tr({ es: "Contacto", en: "Contact" }),
        tr({ es: "Prensa", en: "Press" }),
      ],
    },
    {
      title: tr({ es: "Legal", en: "Legal" }),
      links: [
        tr({ es: "Términos", en: "Terms" }),
        tr({ es: "Privacidad", en: "Privacy" }),
        tr({ es: "Cookies", en: "Cookies" }),
      ],
    },
  ];

  return (
    <footer className="relative border-t border-hairline bg-surface">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05]" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo size="md" showTagline />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-content-muted">
              {tr({
                es: "El ecosistema que hace que la aviación profesional sea posible para todos. No vendemos humo.",
                en: "The ecosystem that makes professional aviation possible for everyone. We don't sell hype.",
              })}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-accent-500/25 bg-accent-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-ink">
                <ShieldCheck className="size-3.5" />
                FAA · ANAC
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-content-muted">
                <Layers className="size-3.5" />
                {tr({ es: "Demo de previsualización", en: "Preview demo" })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.map((g) => (
              <div key={g.title}>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-content-muted">
                  {g.title}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="/login"
                        className="text-sm text-content-muted transition hover:text-content"
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-content-muted">
            © {new Date().getFullYear()} AirPath ·{" "}
            <span className="font-semibold text-content">A CG Company</span>
          </p>
          <p className="text-xs font-medium text-content-muted">
            {tr({
              es: "Demo de previsualización — datos ficticios.",
              en: "Preview demo — fictional data.",
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout helpers                                                      */
/* ------------------------------------------------------------------ */

function Section({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      {children}
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="inline-flex items-center gap-2 rounded-full border border-primary-500/25 bg-primary-600/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-purple-ink">
        <span className="size-1.5 rounded-full bg-primary-500" />
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-content sm:text-[2.5rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-content-muted sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
