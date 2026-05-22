"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock,
  CreditCard,
  Download,
  GraduationCap,
  Image as ImageIcon,
  Lock,
  Play,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useTr } from "@/lib/i18n";
import {
  COURSES,
  type Course,
  type CourseModule,
  type Lesson,
  type LessonType,
} from "@/data/academy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { PageHeading } from "@/components/page-heading";
import { EmptyState } from "@/components/empty-state";
import { toneGradient, toneText, toneIcon } from "@/lib/tone";
import { cn } from "@/lib/cn";

type Tr = ReturnType<typeof useTr>;

const LESSON_ICONS: Record<LessonType, LucideIcon> = {
  video: Video,
  reading: BookOpen,
  diagram: ImageIcon,
  quiz: ClipboardCheck,
};

const LESSON_LABEL: Record<LessonType, { es: string; en: string }> = {
  video: { es: "Video", en: "Video" },
  reading: { es: "Lectura", en: "Reading" },
  diagram: { es: "Diagrama", en: "Diagram" },
  quiz: { es: "Quiz", en: "Quiz" },
};

export default function CourseDetailPage() {
  const tr = useTr();
  const { courseId } = useParams<{ courseId: string }>();
  const course = COURSES.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="space-y-6">
        <PageHeading
          title={tr({ es: "Curso no encontrado", en: "Course not found" })}
          subtitle={tr({ es: "El curso que buscás no existe.", en: "The course you are looking for does not exist." })}
        />
        <EmptyState
          icon={GraduationCap}
          title={tr({ es: "Sin resultados", en: "No results" })}
          description={tr({
            es: "Volvé al catálogo para explorar los 5 cursos avalados por la FAA.",
            en: "Head back to the catalog to explore the 5 FAA-backed courses.",
          })}
          action={
            <Button href="/academy" leftIcon={ArrowLeft} size="sm">
              {tr({ es: "Volver al catálogo", en: "Back to catalog" })}
            </Button>
          }
        />
      </div>
    );
  }

  return <CourseDetail course={course} tr={tr} />;
}

/* ============================================================ */

function CourseDetail({ course, tr }: { course: Course; tr: Tr }) {
  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const totalMinutes = course.modules.reduce(
    (s, m) => s + m.lessons.reduce((ms, l) => ms + l.minutes, 0),
    0,
  );
  const completed = course.status === "completed";
  const purchasable = course.status === "available" || course.status === "locked";

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Button href="/academy" variant="ghost" size="sm" leftIcon={ArrowLeft} className="-ml-2">
        {tr({ es: "Catálogo", en: "Catalog" })}
      </Button>

      {/* Hero */}
      <Hero course={course} tr={tr} totalLessons={totalLessons} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <VideoPlayer course={course} tr={tr} />
          <Outcomes course={course} tr={tr} />
          <ModulesAccordion course={course} tr={tr} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <EnrollCard course={course} tr={tr} purchasable={purchasable} />
          <QuestionBankCard tr={tr} />
          <CertificateCard course={course} tr={tr} completed={completed} />
          <CourseFacts course={course} tr={tr} totalLessons={totalLessons} totalMinutes={totalMinutes} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Hero ---------------- */

function Hero({ course, tr, totalLessons }: { course: Course; tr: Tr; totalLessons: number }) {
  const showProgress = course.status === "completed" || course.status === "in_progress";
  return (
    <Card className="relative overflow-hidden">
      <div className={cn("absolute inset-x-0 top-0 h-40 bg-gradient-to-br", toneGradient[course.accent])}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_-30%,rgba(255,255,255,0.4),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface" />
      </div>
      <div className="relative p-5 pt-6 sm:p-7 sm:pt-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="solidPurple">{course.stage}</Badge>
          <Badge variant="solidGold" className="gap-1">
            <ShieldCheck className="size-3" />
            {tr({ es: `Avalado FAA · ${course.faaPart}`, en: `FAA backed · ${course.faaPart}` })}
          </Badge>
        </div>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-content sm:text-3xl">
          {tr(course.title)}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-content-muted sm:text-base">
          {tr(course.description)}
        </p>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-content-muted">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-content-muted" />
            {tr({ es: `${course.hours} horas`, en: `${course.hours} hours` })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Star className="size-4 text-gold-ink" fill="currentColor" />
            <span className="font-bold text-content">{course.rating}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4" />
            {tr({
              es: `${course.studentsCount.toLocaleString("es")} estudiantes`,
              en: `${course.studentsCount.toLocaleString("en-US")} students`,
            })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="size-4" />
            {tr({ es: `${totalLessons} lecciones`, en: `${totalLessons} lessons` })}
          </span>
        </div>

        {/* Instructor + level + price */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-5">
          <div className="flex items-center gap-3">
            <span className={cn("grid size-11 place-items-center rounded-xl", toneIcon[course.accent])}>
              <GraduationCap className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-content">{course.instructor}</p>
              <p className="text-xs text-content-muted">
                {tr({ es: "Instructor certificado FAA", en: "FAA certified instructor" })} · {tr(course.level)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-content-muted">
              {tr({ es: "Inversión", en: "Tuition" })}
            </p>
            <p className={cn("text-2xl font-extrabold tracking-tight", toneText[course.accent])}>
              ${course.price.toLocaleString("en-US")}
            </p>
          </div>
        </div>

        {showProgress && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-content">
                {tr({ es: "Tu progreso", en: "Your progress" })}
              </span>
              <span className="font-bold tabular-nums text-content">{course.progress}%</span>
            </div>
            <Progress
              value={course.progress}
              tone={course.status === "completed" ? "green" : course.accent}
              className="mt-2"
            />
          </div>
        )}
      </div>
    </Card>
  );
}

/* ---------------- Video player placeholder ---------------- */

function VideoPlayer({ course, tr }: { course: Course; tr: Tr }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-hairline bg-neutral-950">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-25", toneGradient[course.accent])} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.12),transparent_60%)]" />
      {/* Flight-path motif */}
      <svg
        className="absolute inset-0 size-full opacity-[0.12]"
        viewBox="0 0 400 225"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M-20 200 C 120 60, 280 60, 420 30" stroke="white" strokeWidth="1.5" strokeDasharray="6 8" />
      </svg>

      <div className="relative flex size-full flex-col items-center justify-center p-6 text-center">
        <button
          type="button"
          aria-label={tr({ es: "Reproducir avance", en: "Play preview" })}
          className="group grid size-16 place-items-center rounded-full bg-white/95 text-neutral-950 shadow-2xl transition hover:scale-105 active:scale-95 sm:size-20"
        >
          <Play className="size-7 translate-x-0.5 fill-current sm:size-9" />
        </button>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-white/70">
          {tr({ es: "Avance del curso", en: "Course preview" })}
        </p>
        <p className="mt-1 max-w-md text-sm font-bold text-white sm:text-base">{tr(course.title)}</p>
      </div>

      {/* Fake player bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-neutral-950/90 to-transparent p-3 sm:p-4">
        <PlayCircle className="size-5 shrink-0 text-white/80" />
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-1/4 rounded-full bg-white" />
        </div>
        <span className="shrink-0 text-[11px] font-bold tabular-nums text-white/70">2:14 / 8:30</span>
      </div>
    </div>
  );
}

/* ---------------- Outcomes ---------------- */

function Outcomes({ course, tr }: { course: Course; tr: Tr }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Target className="size-4 text-gold-ink" />
        <h2 className="text-base font-extrabold tracking-tight text-content">
          {tr({ es: "Lo que vas a lograr", en: "What you'll achieve" })}
        </h2>
      </div>
      <ul className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
        {course.outcomes.map((o, i) => (
          <li key={i} className="flex items-start gap-2.5 rounded-xl border border-hairline bg-surface-2 p-3">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success-500/15 text-success-500">
              <Check className="size-3.5" />
            </span>
            <span className="text-sm font-medium text-content">{tr(o)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ---------------- Modules accordion ---------------- */

function ModulesAccordion({ course, tr }: { course: Course; tr: Tr }) {
  const firstOpen = course.modules.find((m) => !m.locked)?.id ?? course.modules[0]?.id ?? null;
  const [openId, setOpenId] = useState<string | null>(firstOpen);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-extrabold tracking-tight text-content">
          {tr({ es: "Plan de estudios", en: "Curriculum" })}
        </h2>
        <Badge variant="neutral">
          {tr({
            es: `${course.modules.length} módulos`,
            en: `${course.modules.length} modules`,
          })}
        </Badge>
      </div>
      <div className="mt-3.5 space-y-2.5">
        {course.modules.map((mod, i) => (
          <ModuleRow
            key={mod.id}
            mod={mod}
            index={i + 1}
            accent={course.accent}
            open={openId === mod.id}
            onToggle={() => setOpenId((cur) => (cur === mod.id ? null : mod.id))}
            tr={tr}
          />
        ))}
      </div>
    </Card>
  );
}

function ModuleRow({
  mod,
  index,
  accent,
  open,
  onToggle,
  tr,
}: {
  mod: CourseModule;
  index: number;
  accent: Course["accent"];
  open: boolean;
  onToggle: () => void;
  tr: Tr;
}) {
  const done = mod.lessons.filter((l) => l.done).length;
  const total = mod.lessons.length;
  const allDone = done === total;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-surface-2 transition",
        open ? "border-primary-500/40" : "border-hairline",
      )}
    >
      <button
        type="button"
        onClick={mod.locked ? undefined : onToggle}
        disabled={mod.locked}
        className={cn(
          "flex w-full items-center gap-3 p-3.5 text-left transition",
          !mod.locked && "hover:bg-surface",
          mod.locked && "cursor-not-allowed",
        )}
      >
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg text-sm font-extrabold",
            mod.locked
              ? "bg-surface text-content-muted"
              : allDone
                ? "bg-success-500/15 text-success-500"
                : toneIcon[accent],
          )}
        >
          {mod.locked ? <Lock className="size-4" /> : allDone ? <Check className="size-4" /> : index}
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("truncate text-sm font-bold", mod.locked ? "text-content-muted" : "text-content")}>
            {tr(mod.title)}
          </p>
          <p className="truncate text-xs text-content-muted">{tr(mod.summary)}</p>
        </div>
        <span className="hidden shrink-0 text-xs font-semibold tabular-nums text-content-muted sm:block">
          {tr({ es: `${done}/${total} lecciones`, en: `${done}/${total} lessons` })}
        </span>
        {mod.locked ? (
          <Lock className="size-4 shrink-0 text-content-muted" />
        ) : (
          <ChevronDown
            className={cn("size-4 shrink-0 text-content-muted transition-transform", open && "rotate-180")}
          />
        )}
      </button>

      {open && !mod.locked && (
        <div className="border-t border-hairline p-2">
          {mod.lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} accent={accent} tr={tr} />
          ))}
        </div>
      )}
    </div>
  );
}

function LessonRow({ lesson, accent, tr }: { lesson: Lesson; accent: Course["accent"]; tr: Tr }) {
  const Icon = LESSON_ICONS[lesson.type];
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-surface">
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg",
          lesson.done ? "bg-success-500/15 text-success-500" : toneIcon[accent],
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-content">{tr(lesson.title)}</p>
        <p className="text-xs text-content-muted">
          {tr(LESSON_LABEL[lesson.type])} · {tr({ es: `${lesson.minutes} min`, en: `${lesson.minutes} min` })}
        </p>
      </div>
      {lesson.done ? (
        <CheckCircle2 className="size-5 shrink-0 text-success-500" />
      ) : (
        <PlayCircle className="size-5 shrink-0 text-content-muted" />
      )}
    </div>
  );
}

/* ---------------- Sidebar: enroll / checkout ---------------- */

function EnrollCard({
  course,
  tr,
  purchasable,
}: {
  course: Course;
  tr: Tr;
  purchasable: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (!purchasable) {
    return (
      <Card glow className="p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-content-muted">
          {course.status === "completed"
            ? tr({ es: "Curso completado", en: "Course completed" })
            : tr({ es: "Tu curso activo", en: "Your active course" })}
        </p>
        <h3 className="mt-1 text-lg font-extrabold tracking-tight text-content">
          {course.status === "completed"
            ? tr({ es: "¡Felicitaciones!", en: "Congratulations!" })
            : tr({ es: "Seguí volando", en: "Keep flying" })}
        </h3>
        <p className="mt-1 text-sm text-content-muted">
          {course.status === "completed"
            ? tr({
                es: "Ya completaste este curso. Repasá las lecciones cuando quieras.",
                en: "You've completed this course. Review the lessons anytime.",
              })
            : tr({
                es: "Continuá donde lo dejaste y avanzá hacia tu checkride.",
                en: "Pick up where you left off and progress toward your checkride.",
              })}
        </p>
        <Button
          variant={course.status === "completed" ? "outline" : "primary"}
          leftIcon={course.status === "completed" ? BookOpen : Play}
          fullWidth
          className="mt-4"
        >
          {course.status === "completed"
            ? tr({ es: "Repasar lecciones", en: "Review lessons" })
            : tr({ es: "Continuar curso", en: "Continue course" })}
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Card glow className="overflow-hidden">
        <div className={cn("h-1.5 bg-gradient-to-r", toneGradient[course.accent])} />
        <div className="p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-gold-ink" />
            <p className="text-xs font-bold uppercase tracking-wide text-content-muted">
              {tr({ es: "Inscripción abierta", en: "Enrollment open" })}
            </p>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-content">
              ${course.price.toLocaleString("en-US")}
            </span>
            <span className="text-sm text-content-muted">{tr({ es: "pago único", en: "one-time" })}</span>
          </div>
          <ul className="mt-3.5 space-y-2 text-sm text-content-muted">
            {[
              tr({ es: "Acceso de por vida al material", en: "Lifetime access to the material" }),
              tr({ es: "Banco de preguntas estilo FAA", en: "FAA-style question bank" }),
              tr({ es: "Certificado verificable al finalizar", en: "Verifiable certificate on completion" }),
            ].map((perk) => (
              <li key={perk} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-success-500" />
                {perk}
              </li>
            ))}
          </ul>
          <Button variant="gold" leftIcon={CreditCard} fullWidth className="mt-4" onClick={() => setOpen(true)}>
            {tr({ es: "Inscribirme", en: "Enroll now" })}
          </Button>
          <p className="mt-2 text-center text-[11px] text-content-muted">
            {tr({
              es: "Pago seguro · Demo, no se cobra nada real",
              en: "Secure checkout · Demo, no real charge",
            })}
          </p>
        </div>
      </Card>

      <CheckoutModal course={course} tr={tr} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* ---------------- Mock Stripe checkout modal ---------------- */

function CheckoutModal({
  course,
  tr,
  open,
  onClose,
}: {
  course: Course;
  tr: Tr;
  open: boolean;
  onClose: () => void;
}) {
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  function reset() {
    setPaying(false);
    setDone(false);
    onClose();
  }

  function pay() {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setDone(true);
    }, 1400);
  }

  return (
    <Modal
      open={open}
      onClose={reset}
      size="md"
      title={done ? undefined : tr({ es: "Finalizar inscripción", en: "Complete enrollment" })}
      description={
        done ? undefined : tr({ es: "Pago procesado por Stripe", en: "Payment processed by Stripe" })
      }
    >
      {done ? (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-success-500/15 text-success-500">
            <CheckCircle2 className="size-9" />
          </span>
          <h3 className="mt-4 text-lg font-extrabold tracking-tight text-content">
            {tr({ es: "¡Inscripción confirmada!", en: "Enrollment confirmed!" })}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-content-muted">
            {tr({
              es: `Ya tenés acceso completo a "${tr(course.title)}". Te enviamos el recibo por email.`,
              en: `You now have full access to "${tr(course.title)}". A receipt was sent to your email.`,
            })}
          </p>
          <div className="mt-4 w-full rounded-xl border border-hairline bg-surface-2 p-3 text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="text-content-muted">{tr({ es: "Curso", en: "Course" })}</span>
              <span className="font-bold text-content">{tr(course.title)}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-sm">
              <span className="text-content-muted">{tr({ es: "Total pagado", en: "Total paid" })}</span>
              <span className="font-bold text-content">${course.price.toLocaleString("en-US")}</span>
            </div>
          </div>
          <Button fullWidth className="mt-4" onClick={reset}>
            {tr({ es: "Empezar a estudiar", en: "Start learning" })}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Order summary */}
          <div className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
            <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", toneIcon[course.accent])}>
              <GraduationCap className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-content">{tr(course.title)}</p>
              <p className="text-xs text-content-muted">{course.faaPart}</p>
            </div>
            <span className="text-base font-extrabold tracking-tight text-content">
              ${course.price.toLocaleString("en-US")}
            </span>
          </div>

          {/* Demo notice */}
          <div className="flex items-start gap-2 rounded-xl border border-accent-500/30 bg-accent-500/[0.07] p-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold-ink" />
            <p className="text-xs text-content-muted">
              {tr({
                es: "Checkout de demostración. No ingreses datos reales: los campos están precargados con valores ficticios.",
                en: "Demo checkout. Don't enter real data: fields are pre-filled with placeholder values.",
              })}
            </p>
          </div>

          {/* Fake card fields */}
          <Input
            label={tr({ es: "Email", en: "Email" })}
            defaultValue="demo@airpath.test"
            icon={undefined}
          />
          <Input
            label={tr({ es: "Número de tarjeta (demo)", en: "Card number (demo)" })}
            defaultValue="4242 4242 4242 4242"
            icon={CreditCard}
            inputMode="text"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label={tr({ es: "Vencimiento", en: "Expiry" })} defaultValue="12 / 34" />
            <Input label="CVC" defaultValue="123" />
          </div>

          <Button variant="gold" fullWidth loading={paying} onClick={pay} leftIcon={paying ? undefined : CreditCard}>
            {paying
              ? tr({ es: "Procesando…", en: "Processing…" })
              : tr({ es: `Pagar $${course.price.toLocaleString("en-US")}`, en: `Pay $${course.price.toLocaleString("en-US")}` })}
          </Button>
          <p className="text-center text-[11px] text-content-muted">
            {tr({
              es: "Esto es una demo. Nunca se procesará un cobro real.",
              en: "This is a demo. No real charge will ever be processed.",
            })}
          </p>
        </div>
      )}
    </Modal>
  );
}

/* ---------------- Sidebar: question bank ---------------- */

function QuestionBankCard({ tr }: { tr: Tr }) {
  return (
    <Card className="p-5">
      <span className="grid size-11 place-items-center rounded-xl bg-accent-500/15 text-gold-ink">
        <ClipboardCheck className="size-5" />
      </span>
      <h3 className="mt-3 text-base font-bold text-content">
        {tr({ es: "Banco de preguntas randomizado", en: "Randomized question bank" })}
      </h3>
      <p className="mt-1 text-sm text-content-muted">
        {tr({
          es: "Practicá con preguntas estilo FAA que se barajan en cada intento, igual que el examen Written real.",
          en: "Practice FAA-style questions reshuffled on every attempt, just like the real Written exam.",
        })}
      </p>
      <Button href="/written" variant="gold" size="sm" fullWidth className="mt-4">
        {tr({ es: "Practicar examen Written", en: "Practice Written exam" })}
      </Button>
    </Card>
  );
}

/* ---------------- Sidebar: certificate ---------------- */

function CertificateCard({ course, tr, completed }: { course: Course; tr: Tr; completed: boolean }) {
  if (completed) {
    return (
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-accent-400 to-accent-600 p-4">
          <div className="flex items-center gap-2 text-neutral-950">
            <Award className="size-5" />
            <p className="text-sm font-extrabold tracking-tight">
              {tr({ es: "Certificado disponible", en: "Certificate available" })}
            </p>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm text-content-muted">
            {tr({
              es: "Tu certificado AirPath es verificable públicamente con el código de abajo.",
              en: "Your AirPath certificate is publicly verifiable with the code below.",
            })}
          </p>
          <div className="mt-3 rounded-xl border border-hairline bg-surface-2 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-content-muted">
              {tr({ es: "Código de verificación", en: "Verification code" })}
            </p>
            <p className="mt-0.5 font-mono text-sm font-bold text-content">
              {`AIRPATH-${course.code}-2026-0142`}
            </p>
          </div>
          <Button variant="gold" size="sm" leftIcon={Download} fullWidth className="mt-4">
            {tr({ es: "Descargar PDF", en: "Download PDF" })}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <span className="grid size-11 place-items-center rounded-xl bg-surface-2 text-content-muted">
        <Award className="size-5" />
      </span>
      <h3 className="mt-3 text-base font-bold text-content">
        {tr({ es: "Certificado verificable", en: "Verifiable certificate" })}
      </h3>
      <p className="mt-1 text-sm text-content-muted">
        {tr({
          es: "Completá el curso para desbloquear tu certificado verificable AirPath con código público.",
          en: "Complete the course to unlock your verifiable AirPath certificate with a public code.",
        })}
      </p>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 p-3 text-sm text-content-muted">
        <Lock className="size-4 shrink-0" />
        {tr({ es: "Se desbloquea al 100% de progreso", en: "Unlocks at 100% progress" })}
      </div>
    </Card>
  );
}

/* ---------------- Sidebar: course facts ---------------- */

function CourseFacts({
  course,
  tr,
  totalLessons,
  totalMinutes,
}: {
  course: Course;
  tr: Tr;
  totalLessons: number;
  totalMinutes: number;
}) {
  const facts: { label: string; value: string }[] = [
    { label: tr({ es: "Etapa", en: "Stage" }), value: course.stage },
    { label: tr({ es: "Regulación", en: "Regulation" }), value: course.faaPart },
    { label: tr({ es: "Nivel", en: "Level" }), value: tr(course.level) },
    { label: tr({ es: "Horas de vuelo", en: "Flight hours" }), value: `${course.hours} h` },
    { label: tr({ es: "Módulos", en: "Modules" }), value: String(course.modules.length) },
    { label: tr({ es: "Lecciones", en: "Lessons" }), value: String(totalLessons) },
    {
      label: tr({ es: "Material en video", en: "Video material" }),
      value: tr({ es: `${Math.round(totalMinutes / 60)} h aprox.`, en: `~${Math.round(totalMinutes / 60)} h` }),
    },
  ];

  return (
    <Card className="p-5">
      <h3 className="text-base font-bold text-content">
        {tr({ es: "Detalles del curso", en: "Course details" })}
      </h3>
      <dl className="mt-3 divide-y divide-hairline">
        {facts.map((f) => (
          <div key={f.label} className="flex items-center justify-between gap-3 py-2 text-sm">
            <dt className="text-content-muted">{f.label}</dt>
            <dd className="font-bold text-content">{f.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
