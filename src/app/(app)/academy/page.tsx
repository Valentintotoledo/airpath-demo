"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Lock,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { useTr } from "@/lib/i18n";
import { COURSES, type Course, type CourseStage, type CourseStatus } from "@/data/academy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeading } from "@/components/page-heading";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import { toneGradient, toneText } from "@/lib/tone";
import { cn } from "@/lib/cn";

type Tr = ReturnType<typeof useTr>;

/* Career-path order for the intro strip. */
const PATH: { stage: CourseStage; code: string }[] = [
  { stage: "PPL", code: "PPL" },
  { stage: "IR", code: "IR" },
  { stage: "CPL", code: "CPL" },
  { stage: "CFI", code: "CFI" },
];

function lessonCount(course: Course): number {
  return course.modules.reduce((s, m) => s + m.lessons.length, 0);
}

export default function AcademyPage() {
  const tr = useTr();
  const [stage, setStage] = useState<string>("all");

  const tabs: TabItem[] = useMemo(() => {
    const count = (s: string) => (s === "all" ? COURSES.length : COURSES.filter((c) => c.stage === s).length);
    return [
      { id: "all", label: tr({ es: "Todos", en: "All" }), count: count("all") },
      { id: "PPL", label: "PPL", count: count("PPL") },
      { id: "IR", label: "IR", count: count("IR") },
      { id: "CPL", label: "CPL", count: count("CPL") },
      { id: "CFI", label: "CFI", count: count("CFI") },
      { id: "CONV", label: tr({ es: "Conversión", en: "Conversion" }), count: count("CONV") },
    ];
  }, [tr]);

  const visible = stage === "all" ? COURSES : COURSES.filter((c) => c.stage === stage);

  return (
    <div className="space-y-6">
      <PageHeading
        title="AirPath Academy"
        subtitle={tr({
          es: "5 cursos avalados por la FAA. De cero a piloto comercial, con instructores certificados.",
          en: "5 FAA-backed courses. From zero to commercial pilot, with certified instructors.",
        })}
        action={
          <Badge variant="gold" dot pulse className="self-start">
            {tr({ es: "Avalado FAA Part 141", en: "FAA Part 141 backed" })}
          </Badge>
        }
      />

      {/* Career path intro strip */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary-700/30 via-surface to-surface p-5">
        <div className="absolute -right-20 -top-24 size-72 glow-purple opacity-40" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-gold-ink" />
            <p className="text-xs font-bold uppercase tracking-wide text-content-muted">
              {tr({ es: "Tu ruta de carrera", en: "Your career path" })}
            </p>
          </div>
          <h2 className="mt-1 text-base font-extrabold tracking-tight text-content sm:text-lg">
            {tr({
              es: "Una ruta clara desde tu primer vuelo hasta la cabina profesional",
              en: "A clear path from your first flight to the professional cockpit",
            })}
          </h2>
          <div className="no-scrollbar mt-4 overflow-x-auto">
            <div className="flex min-w-[520px] items-center gap-2">
              {PATH.map((p, i) => (
                <div key={p.stage} className="flex flex-1 items-center gap-2">
                  <div className="flex-1 rounded-xl border border-hairline bg-surface-2 px-3 py-2.5 text-center">
                    <span className="text-sm font-extrabold tracking-tight text-content">{p.code}</span>
                  </div>
                  {i < PATH.length - 1 && <ChevronRight className="size-4 shrink-0 text-content-muted" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Stage filter */}
      <Tabs tabs={tabs} active={stage} onChange={setStage} />

      {/* Course grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((course) => (
          <CourseCard key={course.id} course={course} tr={tr} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Course card ---------------- */

function statusBadge(status: CourseStatus, tr: Tr) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="green" className="gap-1">
          <CheckCircle2 className="size-3" />
          {tr({ es: "Completado", en: "Completed" })}
        </Badge>
      );
    case "in_progress":
      return (
        <Badge variant="purple" className="gap-1">
          <PlayCircle className="size-3" />
          {tr({ es: "En curso", en: "In progress" })}
        </Badge>
      );
    case "available":
      return <Badge variant="gold">{tr({ es: "Disponible", en: "Available" })}</Badge>;
    default:
      return (
        <Badge variant="neutral" className="gap-1">
          <Lock className="size-3" />
          {tr({ es: "Bloqueado", en: "Locked" })}
        </Badge>
      );
  }
}

function CourseCard({ course, tr }: { course: Course; tr: Tr }) {
  const locked = course.status === "locked";
  const showProgress = course.status === "completed" || course.status === "in_progress";
  const lessons = lessonCount(course);

  return (
    <Card interactive={!locked} className={cn("flex flex-col overflow-hidden", locked && "opacity-65")}>
      {/* Gradient header band */}
      <div className={cn("relative h-28 bg-gradient-to-br p-4", toneGradient[course.accent])}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_-20%,rgba(255,255,255,0.35),transparent_55%)]" />
        <div className="relative flex items-start justify-between">
          <span className="rounded-lg bg-neutral-950/30 px-2 py-1 text-xs font-extrabold tracking-wide text-white backdrop-blur-sm">
            {course.stage}
          </span>
          <Badge variant="solidGold" className="gap-1">
            <ShieldCheck className="size-3" />
            {tr({ es: "Avalado FAA", en: "FAA backed" })}
          </Badge>
        </div>
        <p className="relative mt-4 text-xs font-bold uppercase tracking-wide text-white/85">
          {course.faaPart}
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-extrabold tracking-tight text-content">{tr(course.title)}</h3>
        <p className="mt-1 text-sm text-content-muted">{tr(course.tagline)}</p>

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-content-muted">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {course.hours} h
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="size-3.5" />
            {tr({ es: `${lessons} lecciones`, en: `${lessons} lessons` })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5 text-gold-ink" fill="currentColor" />
            <span className="font-bold text-content">{course.rating}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" />
            {course.studentsCount.toLocaleString("en-US")}
          </span>
        </div>

        {/* Progress for active/completed */}
        {showProgress && (
          <div className="mt-3.5 flex items-center gap-2.5">
            <Progress
              value={course.progress}
              tone={course.status === "completed" ? "green" : course.accent}
              size="sm"
              className="flex-1"
            />
            <span className="text-xs font-bold tabular-nums text-content">{course.progress}%</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          {statusBadge(course.status, tr)}
          <span className={cn("text-base font-extrabold tracking-tight", toneText[course.accent])}>
            ${course.price.toLocaleString("en-US")}
          </span>
        </div>

        <Button
          href={`/academy/${course.id}`}
          size="sm"
          variant={course.status === "available" ? "gold" : "primary"}
          rightIcon={ArrowRight}
          fullWidth
          className="mt-3"
        >
          {course.status === "in_progress"
            ? tr({ es: "Retomar curso", en: "Resume course" })
            : course.status === "completed"
              ? tr({ es: "Repasar curso", en: "Review course" })
              : locked
                ? tr({ es: "Ver detalle", en: "View detail" })
                : tr({ es: "Ver curso", en: "View course" })}
        </Button>
      </div>
    </Card>
  );
}
