"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Award,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleX,
  Clock,
  Compass,
  FileText,
  Flag,
  GraduationCap,
  Layers,
  ListOrdered,
  Map,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Timer,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTr } from "@/lib/i18n";
import {
  QUESTION_BANK,
  QUESTION_CATEGORIES,
  type ExamQuestion,
  type QCategory,
  type QType,
} from "@/data/academy";
import type { L10n } from "@/data/mock";
import { PageHeading } from "@/components/page-heading";
import { StatTile } from "@/components/stat-tile";
import { ProgressRing } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";

type Tr = ReturnType<typeof useTr>;
type Screen = "setup" | "exam" | "results";
type CategoryFilter = QCategory | "all";

/* ---- per-question time budget (seconds) ---- */
const SECONDS_PER_QUESTION = 72;
const PASS_THRESHOLD = 70;

/* ---- question-type metadata ---- */
const TYPE_META: Record<QType, { icon: LucideIcon; label: L10n }> = {
  multiple: { icon: Layers, label: { es: "Opción múltiple", en: "Multiple choice" } },
  truefalse: { icon: CircleCheck, label: { es: "Verdadero / Falso", en: "True / False" } },
  visual: { icon: Map, label: { es: "Identificación visual", en: "Visual ID" } },
  ordering: { icon: ListOrdered, label: { es: "Ordenamiento", en: "Ordering" } },
  calculation: { icon: Compass, label: { es: "Cálculos", en: "Calculations" } },
};

const CATEGORY_ICON: Record<QCategory, LucideIcon> = {
  regs: ShieldAlert,
  weather: Sparkles,
  nav: Compass,
  aero: GraduationCap,
  systems: Layers,
  procedures: ListOrdered,
};

/* ---- a single in-progress answer ---- */
type Answer = {
  selectedIndex: number | null;
  order: number[] | null; // indices into the question's orderItems
  calcValue: string;
};

function emptyAnswer(q: ExamQuestion): Answer {
  return {
    selectedIndex: null,
    order: q.type === "ordering" && q.orderItems ? q.orderItems.map((_, i) => i) : null,
    calcValue: "",
  };
}

/* ---- correctness evaluator ---- */
function isCorrect(q: ExamQuestion, a: Answer | undefined): boolean {
  if (!a) return false;
  switch (q.type) {
    case "multiple":
    case "truefalse":
    case "visual":
      return a.selectedIndex !== null && a.selectedIndex === q.correctIndex;
    case "ordering":
      return !!a.order && a.order.every((v, i) => v === i);
    case "calculation": {
      if (a.calcValue.trim() === "") return false;
      const n = Number(a.calcValue);
      if (Number.isNaN(n)) return false;
      const target = q.calcAnswer ?? 0;
      const tol = q.calcTolerance ?? 0;
      return Math.abs(n - target) <= tol;
    }
    default:
      return false;
  }
}

function isAnswered(q: ExamQuestion, a: Answer | undefined): boolean {
  if (!a) return false;
  if (q.type === "calculation") return a.calcValue.trim() !== "";
  if (q.type === "ordering") return true; // ordering always has a state
  return a.selectedIndex !== null;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function fmtClock(total: number): string {
  const m = Math.floor(Math.max(0, total) / 60);
  const s = Math.max(0, total) % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ================================================================== */

export default function WrittenPage() {
  const tr = useTr();

  const [screen, setScreen] = useState<Screen>("setup");

  /* setup state */
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [count, setCount] = useState<number>(6);

  /* exam state */
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  /* pool filtered by category */
  const pool = useMemo(
    () => (category === "all" ? QUESTION_BANK : QUESTION_BANK.filter((q) => q.category === category)),
    [category],
  );
  const maxForCategory = pool.length;

  /* keep count valid when the pool shrinks */
  useEffect(() => {
    setCount((c) => Math.min(c, maxForCategory));
  }, [maxForCategory]);

  const finishRef = useRef<() => void>(() => {});

  const startExam = useCallback(() => {
    const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
    const budget = picked.length * SECONDS_PER_QUESTION;
    setQuestions(picked);
    setAnswers(picked.map((q) => emptyAnswer(q)));
    setCurrent(0);
    setSecondsLeft(budget);
    setTotalSeconds(budget);
    setScreen("exam");
  }, [pool, count]);

  const finishExam = useCallback(() => {
    setScreen("results");
  }, []);
  finishRef.current = finishExam;

  /* countdown timer */
  useEffect(() => {
    if (screen !== "exam") return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          finishRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [screen]);

  const resetToSetup = useCallback(() => {
    setScreen("setup");
    setQuestions([]);
    setAnswers([]);
    setCurrent(0);
  }, []);

  const updateAnswer = useCallback((idx: number, patch: Partial<Answer>) => {
    setAnswers((prev) => prev.map((a, i) => (i === idx ? { ...a, ...patch } : a)));
  }, []);

  if (screen === "setup") {
    return (
      <SetupScreen
        tr={tr}
        category={category}
        setCategory={setCategory}
        count={count}
        setCount={setCount}
        maxForCategory={maxForCategory}
        onStart={startExam}
      />
    );
  }

  if (screen === "exam") {
    return (
      <ExamScreen
        tr={tr}
        questions={questions}
        answers={answers}
        current={current}
        setCurrent={setCurrent}
        updateAnswer={updateAnswer}
        secondsLeft={secondsLeft}
        totalSeconds={totalSeconds}
        onFinish={finishExam}
        onExit={resetToSetup}
      />
    );
  }

  return (
    <ResultsScreen
      tr={tr}
      questions={questions}
      answers={answers}
      timeUsed={totalSeconds - secondsLeft}
      onRetry={resetToSetup}
    />
  );
}

/* ================================================================== */
/*  SETUP                                                              */
/* ================================================================== */

function SetupScreen({
  tr,
  category,
  setCategory,
  count,
  setCount,
  maxForCategory,
  onStart,
}: {
  tr: Tr;
  category: CategoryFilter;
  setCategory: (c: CategoryFilter) => void;
  count: number;
  setCount: (n: number) => void;
  maxForCategory: number;
  onStart: () => void;
}) {
  const countOptions = useMemo(() => {
    const base = [6, 10].filter((n) => n <= maxForCategory);
    return [...base, maxForCategory].filter((n, i, a) => a.indexOf(n) === i && n > 0);
  }, [maxForCategory]);

  return (
    <div className="space-y-7">
      <PageHeading
        title={tr({ es: "Examen Written FAA", en: "FAA Written Exam" })}
        subtitle={tr({
          es: "Simulacro con banco de preguntas randomizado, estilo Sheppard Air / Prepware.",
          en: "Mock exam with a randomized question bank, Sheppard Air / Prepware style.",
        })}
        action={
          <Badge variant="gold" dot pulse>
            {tr({ es: "Modo simulacro", en: "Mock mode" })}
          </Badge>
        }
      />

      {/* Intro card */}
      <Card glow className="overflow-hidden">
        <div className="relative bg-gradient-to-br from-primary-700/35 via-surface to-surface p-6 sm:p-7">
          <div className="absolute -right-16 -top-20 size-64 glow-purple opacity-40" />
          <div className="relative flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-500/15 text-gold-ink">
              <FileText className="size-6" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold tracking-tight text-content">
                {tr({ es: "Tu checkride empieza acá", en: "Your checkride starts here" })}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-content-muted">
                {tr({
                  es: "Este simulacro reproduce el examen teórico (Written) de la FAA: preguntas extraídas al azar de un banco oficial, con tiempo límite y corrección instantánea. Practicá hasta superar el 70% antes de rendir de verdad.",
                  en: "This mock reproduces the FAA theory (Written) exam: questions drawn at random from an official-style bank, with a time limit and instant grading. Practice until you clear 70% before the real thing.",
                })}
              </p>
            </div>
          </div>

          {/* Question mechanics */}
          <div className="relative mt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-content-muted">
              {tr({ es: "5 mecánicas de pregunta", en: "5 question mechanics" })}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {(Object.keys(TYPE_META) as QType[]).map((t) => {
                const Icon = TYPE_META[t].icon;
                return (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-xs font-bold text-content"
                  >
                    <Icon className="size-3.5 text-purple-ink" />
                    {tr(TYPE_META[t].label)}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Category filter */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-purple-ink" />
          <h3 className="text-sm font-extrabold tracking-tight text-content">
            {tr({ es: "Categoría de preguntas", en: "Question category" })}
          </h3>
        </div>
        <p className="mt-1 text-xs text-content-muted">
          {tr({
            es: "Filtrá por área de conocimiento o practicá con todo el banco.",
            en: "Filter by knowledge area or practice the whole bank.",
          })}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <CategoryChip
            active={category === "all"}
            label={tr({ es: "Todas", en: "All" })}
            icon={Sparkles}
            count={QUESTION_BANK.length}
            onClick={() => setCategory("all")}
          />
          {QUESTION_CATEGORIES.map((c) => {
            const n = QUESTION_BANK.filter((q) => q.category === c.id).length;
            return (
              <CategoryChip
                key={c.id}
                active={category === c.id}
                label={tr(c.label)}
                icon={CATEGORY_ICON[c.id]}
                count={n}
                onClick={() => setCategory(c.id)}
              />
            );
          })}
        </div>
      </Card>

      {/* Question count */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <ListOrdered className="size-4 text-purple-ink" />
          <h3 className="text-sm font-extrabold tracking-tight text-content">
            {tr({ es: "Cantidad de preguntas", en: "Number of questions" })}
          </h3>
        </div>
        <p className="mt-1 text-xs text-content-muted">
          {tr({
            es: `Disponibles en esta categoría: ${maxForCategory}.`,
            en: `Available in this category: ${maxForCategory}.`,
          })}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {countOptions.map((n) => {
            const isAll = n === maxForCategory;
            const on = count === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={cn(
                  "rounded-xl border p-3 text-center transition",
                  on
                    ? "border-primary-500/60 bg-primary-600/15"
                    : "border-hairline bg-surface-2 hover:border-primary-500/40",
                )}
              >
                <span className="block text-xl font-extrabold tabular-nums text-content">{n}</span>
                <span className="mt-0.5 block text-[11px] font-semibold text-content-muted">
                  {isAll
                    ? tr({ es: "todas", en: "all" })
                    : tr({ es: "preguntas", en: "questions" })}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-content-muted">
          <Timer className="size-4 text-gold-ink" />
          {tr({
            es: `Tiempo estimado: ${fmtClock(count * SECONDS_PER_QUESTION)} min`,
            en: `Estimated time: ${fmtClock(count * SECONDS_PER_QUESTION)} min`,
          })}
        </div>
      </Card>

      {/* Anti-cheat note + CTA */}
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-500/15 text-gold-ink">
            <ShieldAlert className="size-[18px]" />
          </span>
          <div>
            <p className="text-sm font-bold text-content">
              {tr({ es: "Lógica anti-trampa · tiempo límite", en: "Anti-cheat logic · time limit" })}
            </p>
            <p className="mt-0.5 text-xs text-content-muted">
              {tr({
                es: "Orden de preguntas randomizado y cronómetro activo. Una vez enviado no se puede modificar.",
                en: "Randomized question order and a live timer. Once submitted, answers are locked.",
              })}
            </p>
          </div>
        </div>
        <Button
          variant="gold"
          size="lg"
          leftIcon={Flag}
          onClick={onStart}
          disabled={count < 1}
          className="shrink-0"
        >
          {tr({ es: "Iniciar simulacro", en: "Start mock exam" })}
        </Button>
      </Card>
    </div>
  );
}

function CategoryChip({
  active,
  label,
  icon: Icon,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: LucideIcon;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition",
        active
          ? "border-primary-500/60 bg-primary-600/20 text-content"
          : "border-hairline bg-surface-2 text-content-muted hover:border-primary-500/40 hover:text-content",
      )}
    >
      <Icon className={cn("size-3.5", active ? "text-purple-ink" : "text-content-muted")} />
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 text-[10px] tabular-nums",
          active ? "bg-primary-600/30 text-purple-ink" : "bg-surface text-content-muted",
        )}
      >
        {count}
      </span>
    </button>
  );
}

/* ================================================================== */
/*  EXAM                                                               */
/* ================================================================== */

function ExamScreen({
  tr,
  questions,
  answers,
  current,
  setCurrent,
  updateAnswer,
  secondsLeft,
  totalSeconds,
  onFinish,
  onExit,
}: {
  tr: Tr;
  questions: ExamQuestion[];
  answers: Answer[];
  current: number;
  setCurrent: (n: number) => void;
  updateAnswer: (idx: number, patch: Partial<Answer>) => void;
  secondsLeft: number;
  totalSeconds: number;
  onFinish: () => void;
  onExit: () => void;
}) {
  const q = questions[current];
  const a = answers[current];
  const isLast = current === questions.length - 1;
  const answeredCount = questions.reduce(
    (n, qq, i) => n + (isAnswered(qq, answers[i]) ? 1 : 0),
    0,
  );
  const progressPct = ((current + 1) / questions.length) * 100;
  const lowTime = secondsLeft <= 60;
  const TypeIcon = TYPE_META[q.type].icon;

  return (
    <div className="space-y-5">
      {/* Sticky header with timer + progress */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-hairline bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExit}
              className="grid size-9 place-items-center rounded-lg border border-hairline bg-surface text-content-muted transition hover:text-content"
              aria-label={tr({ es: "Salir del examen", en: "Exit exam" })}
            >
              <X className="size-4" />
            </button>
            <div className="min-w-0">
              <p className="text-sm font-extrabold tracking-tight text-content">
                {tr({
                  es: `Pregunta ${current + 1} de ${questions.length}`,
                  en: `Question ${current + 1} of ${questions.length}`,
                })}
              </p>
              <p className="text-[11px] font-semibold text-content-muted">
                {tr({
                  es: `${answeredCount} respondidas`,
                  en: `${answeredCount} answered`,
                })}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 tabular-nums",
              lowTime
                ? "animate-pulse border-danger-500/50 bg-danger-500/15 text-danger-400"
                : "border-hairline bg-surface text-content",
            )}
          >
            <Clock className="size-4" />
            <span className="text-sm font-extrabold">{fmtClock(secondsLeft)}</span>
          </div>
        </div>
        <Progress
          value={progressPct}
          tone={lowTime ? "gold" : "purple"}
          size="sm"
          className="mt-3"
        />
      </div>

      {/* Question card */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="purple">
            <TypeIcon className="size-3" />
            {tr(TYPE_META[q.type].label)}
          </Badge>
          <Badge variant="neutral">
            {tr(QUESTION_CATEGORIES.find((c) => c.id === q.category)?.label ?? { es: "", en: "" })}
          </Badge>
          <Badge variant={q.difficulty === "advanced" ? "gold" : "neutral"}>
            {tr(
              q.difficulty === "basic"
                ? { es: "Básica", en: "Basic" }
                : q.difficulty === "intermediate"
                  ? { es: "Intermedia", en: "Intermediate" }
                  : { es: "Avanzada", en: "Advanced" },
            )}
          </Badge>
        </div>

        <h2 className="mt-3.5 text-base font-bold leading-relaxed text-content sm:text-lg">
          {tr(q.prompt)}
        </h2>

        <div className="mt-5">
          <QuestionBody
            tr={tr}
            question={q}
            answer={a}
            onAnswer={(patch) => updateAnswer(current, patch)}
          />
        </div>
      </Card>

      {/* Anti-cheat note */}
      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-content-muted">
        <ShieldAlert className="size-3.5" />
        {tr({
          es: "Modo examen · no se permite volver una vez enviado",
          en: "Exam mode · no changes allowed once submitted",
        })}
      </p>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="lg"
          leftIcon={ArrowLeft}
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
        >
          {tr({ es: "Anterior", en: "Previous" })}
        </Button>
        {isLast ? (
          <Button variant="gold" size="lg" leftIcon={Flag} onClick={onFinish} fullWidth>
            {tr({ es: "Finalizar examen", en: "Finish exam" })}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            rightIcon={ArrowRight}
            onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))}
            fullWidth
          >
            {tr({ es: "Siguiente", en: "Next" })}
          </Button>
        )}
      </div>

      {/* Question jump dots */}
      <div className="flex flex-wrap justify-center gap-2">
        {questions.map((qq, i) => {
          const done = isAnswered(qq, answers[i]);
          const on = i === current;
          return (
            <button
              key={qq.id}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`${i + 1}`}
              className={cn(
                "grid size-8 place-items-center rounded-lg text-xs font-bold tabular-nums transition",
                on
                  ? "bg-primary-600 text-white"
                  : done
                    ? "bg-success-500/20 text-success-400 hover:bg-success-500/30"
                    : "border border-hairline bg-surface-2 text-content-muted hover:text-content",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---- the body of a question, rendered by type ---- */
function QuestionBody({
  tr,
  question: q,
  answer: a,
  onAnswer,
}: {
  tr: Tr;
  question: ExamQuestion;
  answer: Answer;
  onAnswer: (patch: Partial<Answer>) => void;
}) {
  /* multiple + visual: selectable rows */
  if (q.type === "multiple" || q.type === "visual") {
    return (
      <div className="space-y-3">
        {q.type === "visual" && <DiagramPlaceholder tr={tr} />}
        <div className="space-y-2">
          {(q.options ?? []).map((opt, i) => (
            <OptionRow
              key={i}
              label={tr(opt)}
              index={i}
              selected={a.selectedIndex === i}
              onClick={() => onAnswer({ selectedIndex: i })}
            />
          ))}
        </div>
      </div>
    );
  }

  /* truefalse: two large buttons */
  if (q.type === "truefalse") {
    const opts = q.options ?? [
      { es: "Verdadero", en: "True" },
      { es: "Falso", en: "False" },
    ];
    return (
      <div className="grid grid-cols-2 gap-3">
        {opts.map((opt, i) => {
          const on = a.selectedIndex === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onAnswer({ selectedIndex: i })}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-5 transition",
                on
                  ? i === 0
                    ? "border-success-500/55 bg-success-500/15"
                    : "border-danger-500/55 bg-danger-500/15"
                  : "border-hairline bg-surface-2 hover:border-primary-500/40",
              )}
            >
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-full",
                  on
                    ? i === 0
                      ? "bg-success-500 text-white"
                      : "bg-danger-500 text-white"
                    : "bg-surface text-content-muted",
                )}
              >
                {i === 0 ? <CircleCheck className="size-5" /> : <CircleX className="size-5" />}
              </span>
              <span className="text-sm font-extrabold text-content">{tr(opt)}</span>
            </button>
          );
        })}
      </div>
    );
  }

  /* ordering: reorderable list */
  if (q.type === "ordering") {
    const items = q.orderItems ?? [];
    const order = a.order ?? items.map((_, i) => i);
    const move = (pos: number, dir: -1 | 1) => {
      const next = [...order];
      const target = pos + dir;
      if (target < 0 || target >= next.length) return;
      [next[pos], next[target]] = [next[target], next[pos]];
      onAnswer({ order: next });
    };
    return (
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-content-muted">
          <ArrowUpDown className="size-3.5" />
          {tr({ es: "Ordená los pasos con las flechas", en: "Reorder the steps with the arrows" })}
        </p>
        {order.map((itemIdx, pos) => (
          <div
            key={itemIdx}
            className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary-600/20 text-xs font-extrabold text-purple-ink">
              {pos + 1}
            </span>
            <span className="min-w-0 flex-1 text-sm font-semibold text-content">
              {tr(items[itemIdx])}
            </span>
            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => move(pos, -1)}
                disabled={pos === 0}
                aria-label={tr({ es: "Subir", en: "Move up" })}
                className="grid size-6 place-items-center rounded-md border border-hairline bg-surface text-content-muted transition hover:text-content disabled:opacity-30"
              >
                <ChevronUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(pos, 1)}
                disabled={pos === order.length - 1}
                aria-label={tr({ es: "Bajar", en: "Move down" })}
                className="grid size-6 place-items-center rounded-md border border-hairline bg-surface text-content-muted transition hover:text-content disabled:opacity-30"
              >
                <ChevronDown className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* calculation: number input with unit suffix */
  return (
    <div className="max-w-xs">
      <label className="text-xs font-bold uppercase tracking-wide text-content-muted">
        {tr({ es: "Tu respuesta", en: "Your answer" })}
      </label>
      <div className="relative mt-2">
        <Input
          type="number"
          inputMode="decimal"
          value={a.calcValue}
          onChange={(e) => onAnswer({ calcValue: e.target.value })}
          placeholder="0"
          className="pr-14 text-base font-bold"
        />
        {q.calcUnit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-content-muted">
            {q.calcUnit}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-content-muted">
        {tr({
          es: "Ingresá un valor numérico. Se acepta un margen de tolerancia.",
          en: "Enter a numeric value. A tolerance margin is accepted.",
        })}
      </p>
    </div>
  );
}

function OptionRow({
  label,
  index,
  selected,
  onClick,
}: {
  label: string;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition",
        selected
          ? "border-primary-500/60 bg-primary-600/15"
          : "border-hairline bg-surface-2 hover:border-primary-500/40",
      )}
    >
      <span
        className={cn(
          "grid size-7 shrink-0 place-items-center rounded-lg text-xs font-extrabold transition",
          selected ? "bg-primary-600 text-white" : "bg-surface text-content-muted",
        )}
      >
        {String.fromCharCode(65 + index)}
      </span>
      <span className="min-w-0 flex-1 text-sm font-semibold text-content">{label}</span>
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full border-2 transition",
          selected ? "border-primary-500 bg-primary-600" : "border-hairline",
        )}
      >
        {selected && <span className="size-2 rounded-full bg-white" />}
      </span>
    </button>
  );
}

function DiagramPlaceholder({ tr }: { tr: Tr }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-hairline bg-gradient-to-br from-sky-500/15 via-surface-2 to-primary-700/20 p-6">
      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-sky-500/20 blur-2xl" />
      <div className="absolute -bottom-10 -left-6 size-32 rounded-full bg-primary-600/20 blur-2xl" />
      <div className="relative flex flex-col items-center text-center">
        <span className="grid size-14 place-items-center rounded-xl bg-surface/80 text-sky-400 ring-1 ring-hairline">
          <Map className="size-7" />
        </span>
        <p className="mt-3 text-sm font-bold text-content">
          {tr({ es: "Carta sectional de referencia", en: "Reference sectional chart" })}
        </p>
        <p className="mt-0.5 text-xs text-content-muted">
          {tr({
            es: "Identificá el símbolo descripto en el enunciado.",
            en: "Identify the symbol described in the prompt.",
          })}
        </p>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  RESULTS                                                            */
/* ================================================================== */

function ResultsScreen({
  tr,
  questions,
  answers,
  timeUsed,
  onRetry,
}: {
  tr: Tr;
  questions: ExamQuestion[];
  answers: Answer[];
  timeUsed: number;
  onRetry: () => void;
}) {
  const correct = questions.reduce((n, q, i) => n + (isCorrect(q, answers[i]) ? 1 : 0), 0);
  const total = questions.length || 1;
  const incorrect = total - correct;
  const score = Math.round((correct / total) * 100);
  const passed = score >= PASS_THRESHOLD;

  return (
    <div className="space-y-7">
      <PageHeading
        title={tr({ es: "Resultado del simulacro", en: "Mock exam result" })}
        subtitle={tr({
          es: "Revisá cada pregunta para reforzar tus puntos débiles.",
          en: "Review every question to reinforce your weak spots.",
        })}
        action={
          <Badge variant={passed ? "green" : "danger"} dot>
            {passed
              ? tr({ es: "Aprobado", en: "Passed" })
              : tr({ es: "No aprobado", en: "Not passed" })}
          </Badge>
        }
      />

      {/* Score hero */}
      <Card glow className="overflow-hidden">
        <div
          className={cn(
            "relative bg-gradient-to-br p-6 sm:p-7",
            passed
              ? "from-success-500/25 via-surface to-surface"
              : "from-danger-500/20 via-surface to-surface",
          )}
        >
          <div
            className={cn(
              "absolute -right-16 -top-20 size-64 rounded-full blur-3xl",
              passed ? "bg-success-500/25" : "bg-danger-500/20",
            )}
          />
          <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <ProgressRing
              value={score}
              size={132}
              stroke={13}
              tone={passed ? "green" : "gold"}
              label={tr({ es: "puntaje", en: "score" })}
            />
            <div className="min-w-0 text-center sm:text-left">
              <h2 className="text-2xl font-extrabold tracking-tight text-content sm:text-3xl">
                {passed
                  ? tr({ es: "¡Examen aprobado!", en: "Exam passed!" })
                  : tr({ es: "Seguí practicando", en: "Keep practicing" })}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-content-muted">
                {passed
                  ? tr({
                      es: `Acertaste ${correct} de ${total}. Estás listo para el examen real de la FAA.`,
                      en: `You got ${correct} of ${total} right. You're ready for the real FAA exam.`,
                    })
                  : tr({
                      es: `Acertaste ${correct} de ${total}. Necesitás 70% para aprobar — revisá las explicaciones y repetí.`,
                      en: `You got ${correct} of ${total} right. You need 70% to pass — review the explanations and retry.`,
                    })}
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs font-semibold text-content-muted">
                <Award className="size-3.5 text-gold-ink" />
                {tr({ es: "Umbral de aprobación: 70%", en: "Pass threshold: 70%" })}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile
          icon={CircleCheck}
          tone="green"
          label={tr({ es: "Correctas", en: "Correct" })}
          value={correct}
        />
        <StatTile
          icon={CircleX}
          tone="gold"
          label={tr({ es: "Incorrectas", en: "Incorrect" })}
          value={incorrect}
        />
        <StatTile
          icon={Clock}
          tone="sky"
          label={tr({ es: "Tiempo usado", en: "Time used" })}
          value={fmtClock(timeUsed)}
        />
      </div>

      {/* Per-question review */}
      <section>
        <h3 className="mb-3 text-lg font-extrabold tracking-tight text-content">
          {tr({ es: "Revisión pregunta por pregunta", en: "Question-by-question review" })}
        </h3>
        <div className="space-y-3">
          {questions.map((q, i) => (
            <ReviewItem key={q.id} tr={tr} index={i} question={q} answer={answers[i]} />
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="gold" size="lg" leftIcon={RefreshCw} onClick={onRetry} fullWidth>
          {tr({ es: "Repetir simulacro", en: "Retry mock exam" })}
        </Button>
        <Button href="/academy" variant="outline" size="lg" leftIcon={GraduationCap} fullWidth>
          {tr({ es: "Volver a la academia", en: "Back to academy" })}
        </Button>
      </div>
    </div>
  );
}

function ReviewItem({
  tr,
  index,
  question: q,
  answer: a,
}: {
  tr: Tr;
  index: number;
  question: ExamQuestion;
  answer: Answer | undefined;
}) {
  const ok = isCorrect(q, a);
  const answered = isAnswered(q, a);
  const TypeIcon = TYPE_META[q.type].icon;

  return (
    <Card
      className={cn(
        "border-l-4 p-4 sm:p-5",
        ok ? "border-l-success-500" : "border-l-danger-500",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-lg",
            ok ? "bg-success-500/15 text-success-400" : "bg-danger-500/15 text-danger-400",
          )}
        >
          {ok ? <CircleCheck className="size-5" /> : <CircleX className="size-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold tabular-nums text-content-muted">
              {tr({ es: `Pregunta ${index + 1}`, en: `Question ${index + 1}` })}
            </span>
            <Badge variant="neutral">
              <TypeIcon className="size-3" />
              {tr(TYPE_META[q.type].label)}
            </Badge>
            <Badge variant={ok ? "green" : "danger"}>
              {ok
                ? tr({ es: "Correcta", en: "Correct" })
                : answered
                  ? tr({ es: "Incorrecta", en: "Incorrect" })
                  : tr({ es: "Sin responder", en: "Unanswered" })}
            </Badge>
          </div>
          <p className="mt-2 text-sm font-bold leading-relaxed text-content">{tr(q.prompt)}</p>

          {/* user answer vs correct */}
          <div className="mt-3 space-y-2">
            {!ok && (
              <ReviewLine
                tone="danger"
                label={tr({ es: "Tu respuesta", en: "Your answer" })}
                value={formatUserAnswer(tr, q, a)}
              />
            )}
            <ReviewLine
              tone="success"
              label={tr({ es: "Respuesta correcta", en: "Correct answer" })}
              value={formatCorrectAnswer(tr, q)}
            />
          </div>

          {/* explanation */}
          <div className="mt-3 rounded-xl border border-hairline bg-surface-2 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-purple-ink">
              <Sparkles className="size-3.5" />
              {tr({ es: "Explicación", en: "Explanation" })}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-content-muted">{tr(q.explanation)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ReviewLine({
  tone,
  label,
  value,
}: {
  tone: "success" | "danger";
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span
        className={cn(
          "mt-0.5 shrink-0 text-xs font-bold uppercase tracking-wide",
          tone === "success" ? "text-success-400" : "text-danger-400",
        )}
      >
        {label}
      </span>
      <span className="min-w-0 flex-1 font-semibold text-content">{value}</span>
    </div>
  );
}

/* ---- answer formatting helpers ---- */
function formatUserAnswer(tr: Tr, q: ExamQuestion, a: Answer | undefined): string {
  if (!a || !isAnswered(q, a)) return tr({ es: "— sin responder —", en: "— unanswered —" });
  switch (q.type) {
    case "multiple":
    case "truefalse":
    case "visual":
      return a.selectedIndex !== null && q.options
        ? tr(q.options[a.selectedIndex])
        : tr({ es: "—", en: "—" });
    case "ordering": {
      const items = q.orderItems ?? [];
      const order = a.order ?? [];
      return order.map((idx, pos) => `${pos + 1}. ${tr(items[idx])}`).join("  ·  ");
    }
    case "calculation":
      return `${a.calcValue} ${q.calcUnit ?? ""}`.trim();
    default:
      return "—";
  }
}

function formatCorrectAnswer(tr: Tr, q: ExamQuestion): string {
  switch (q.type) {
    case "multiple":
    case "truefalse":
    case "visual":
      return q.options && q.correctIndex !== undefined
        ? tr(q.options[q.correctIndex])
        : "—";
    case "ordering": {
      const items = q.orderItems ?? [];
      return items.map((it, i) => `${i + 1}. ${tr(it)}`).join("  ·  ");
    }
    case "calculation":
      return `${q.calcAnswer ?? "—"} ${q.calcUnit ?? ""}`.trim();
    default:
      return "—";
  }
}
