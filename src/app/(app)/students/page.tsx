"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  CalendarCheck,
  CalendarPlus,
  CheckCircle2,
  GraduationCap,
  LifeBuoy,
  Search,
  SearchX,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTr } from "@/lib/i18n";
import { STUDENT_RECORDS, type StudentRecord } from "@/data/platform";
import type { L10n } from "@/data/mock";
import { PageHeading } from "@/components/page-heading";
import { StatTile } from "@/components/stat-tile";
import { EmptyState } from "@/components/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

/** A student is checkride-ready above this progress threshold. */
const CHECKRIDE_THRESHOLD = 85;

/** True when the student's status text signals they need support. */
function needsSupport(s: StudentRecord): boolean {
  const text = `${s.status.es} ${s.status.en}`.toLowerCase();
  return text.includes("apoyo") || text.includes("support");
}

/** Badge tone derived from the student's progress / status. */
function statusVariant(s: StudentRecord): "green" | "warning" | "purple" {
  if (s.progress > CHECKRIDE_THRESHOLD) return "green";
  if (needsSupport(s)) return "warning";
  return "purple";
}

/** Mock bilingual progress notes per student. */
const NOTES: Record<string, L10n[]> = {
  "st-1": [
    {
      es: "Excelente desempeño en aproximaciones ILS — listo para avanzar a holding patterns.",
      en: "Strong performance on ILS approaches — ready to move on to holding patterns.",
    },
    {
      es: "Repasar lectura de cartas Jeppesen antes de la próxima sesión.",
      en: "Review Jeppesen chart reading before the next session.",
    },
  ],
  "st-2": [
    {
      es: "Maniobras de vuelo completadas con confianza. Falta solo el cross-country largo.",
      en: "Flight maneuvers completed confidently. Only the long cross-country remains.",
    },
    {
      es: "Reservar aeronave N512AP para el vuelo solo de navegación.",
      en: "Book aircraft N512AP for the solo navigation flight.",
    },
  ],
  "st-3": [
    {
      es: "Dificultad con cálculos de performance — agendar sesión de refuerzo teórico.",
      en: "Struggling with performance calculations — schedule a theory reinforcement session.",
    },
    {
      es: "Buena actitud y compromiso; recomendar material de estudio adicional.",
      en: "Great attitude and commitment; recommend additional study material.",
    },
    {
      es: "Asistencia irregular las últimas dos semanas — hacer seguimiento.",
      en: "Irregular attendance over the last two weeks — follow up.",
    },
  ],
  "st-4": [
    {
      es: "Vuelo de práctica de checkride aprobado sin observaciones. Listo para examen.",
      en: "Checkride practice flight passed with no notes. Ready for the exam.",
    },
    {
      es: "Coordinar fecha del examen práctico con el DPE de la zona.",
      en: "Coordinate the practical exam date with the local DPE.",
    },
  ],
  "st-5": [
    {
      es: "Conversión avanzando según lo previsto — fraseología FAA en buen nivel.",
      en: "Conversion progressing on schedule — FAA phraseology at a solid level.",
    },
    {
      es: "Practicar operaciones en espacio aéreo Clase B antes del próximo vuelo.",
      en: "Practice Class B airspace operations before the next flight.",
    },
  ],
};

export default function StudentsPage() {
  const tr = useTr();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const onTrack = STUDENT_RECORDS.filter(
      (s) => !needsSupport(s) && s.progress <= CHECKRIDE_THRESHOLD,
    ).length;
    return {
      total: STUDENT_RECORDS.length,
      onTrack,
      support: STUDENT_RECORDS.filter(needsSupport).length,
      checkride: STUDENT_RECORDS.filter((s) => s.progress > CHECKRIDE_THRESHOLD).length,
    };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STUDENT_RECORDS;
    return STUDENT_RECORDS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.course.es.toLowerCase().includes(q) ||
        s.course.en.toLowerCase().includes(q),
    );
  }, [query]);

  const openStudent = STUDENT_RECORDS.find((s) => s.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <PageHeading
        title={tr({ es: "Mis estudiantes", en: "My students" })}
        subtitle={tr({
          es: "Seguí el progreso, las sesiones y el estado de cada estudiante a tu cargo.",
          en: "Track the progress, sessions and status of every student in your care.",
        })}
        action={
          <Badge variant="gold" dot pulse>
            {tr({ es: "Demo en vivo", en: "Live demo" })}
          </Badge>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          icon={Users}
          tone="purple"
          label={tr({ es: "Total estudiantes", en: "Total students" })}
          value={stats.total}
        />
        <StatTile
          icon={TrendingUp}
          tone="sky"
          label={tr({ es: "Al día", en: "On track" })}
          value={stats.onTrack}
        />
        <StatTile
          icon={LifeBuoy}
          tone="gold"
          label={tr({ es: "Necesitan apoyo", en: "Need support" })}
          value={stats.support}
        />
        <StatTile
          icon={CheckCircle2}
          tone="green"
          label={tr({ es: "Listos para checkride", en: "Checkride ready" })}
          value={stats.checkride}
        />
      </div>

      {/* Search */}
      <Input
        icon={Search}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={tr({
          es: "Buscar por nombre o curso…",
          en: "Search by name or course…",
        })}
      />

      {/* Student list */}
      {visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={tr({ es: "Sin estudiantes", en: "No students" })}
          description={tr({
            es: "Ningún estudiante coincide con tu búsqueda.",
            en: "No student matches your search.",
          })}
        />
      ) : (
        <div className="space-y-3">
          {visible.map((s) => (
            <StudentRow key={s.id} student={s} onOpen={() => setOpenId(s.id)} />
          ))}
        </div>
      )}

      {/* Detail modal */}
      <StudentDetailModal student={openStudent} onClose={() => setOpenId(null)} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Student row                                                         */
/* ------------------------------------------------------------------ */

function StudentRow({ student, onOpen }: { student: StudentRecord; onOpen: () => void }) {
  const tr = useTr();
  return (
    <Card interactive>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full flex-col gap-4 p-4 text-left sm:flex-row sm:items-center sm:p-5"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          <Avatar initials={student.initials} accent={student.accent} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-bold text-content">{student.name}</p>
              <Badge variant={statusVariant(student)}>{tr(student.status)}</Badge>
            </div>
            <p className="mt-0.5 truncate text-xs text-content-muted">{tr(student.course)}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-content-muted">
              <CalendarCheck className="size-3.5 text-purple-ink" />
              {tr({
                es: `Próx. sesión: ${student.nextSession}`,
                en: `Next session: ${student.nextSession}`,
              })}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex shrink-0 items-center gap-3 border-t border-hairline pt-3 sm:w-52 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <Progress value={student.progress} tone={student.accent} className="flex-1" />
          <span className="text-sm font-extrabold tabular-nums text-content">
            {student.progress}%
          </span>
        </div>
      </button>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail modal                                                        */
/* ------------------------------------------------------------------ */

function StudentDetailModal({
  student,
  onClose,
}: {
  student: StudentRecord | null;
  onClose: () => void;
}) {
  const tr = useTr();
  const [scheduled, setScheduled] = useState(false);

  if (!student) return <Modal open={false} onClose={onClose} />;

  const handleClose = () => {
    onClose();
    window.setTimeout(() => setScheduled(false), 300);
  };

  const notes = NOTES[student.id] ?? [];

  return (
    <Modal
      open={!!student}
      onClose={handleClose}
      size="lg"
      title={
        <span className="flex items-center gap-2.5">
          <Avatar initials={student.initials} accent={student.accent} size="sm" />
          {student.name}
        </span>
      }
      description={tr(student.course)}
      footer={
        scheduled ? (
          <Button size="sm" variant="subtle" onClick={handleClose}>
            {tr({ es: "Cerrar", en: "Close" })}
          </Button>
        ) : (
          <Button size="sm" leftIcon={CalendarPlus} onClick={() => setScheduled(true)}>
            {tr({ es: "Agendar sesión", en: "Schedule session" })}
          </Button>
        )
      }
    >
      <div className="space-y-5">
        {/* Status + next session */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={statusVariant(student)}>{tr(student.status)}</Badge>
          <span className="inline-flex items-center gap-1.5 text-sm text-content-muted">
            <CalendarCheck className="size-4 text-purple-ink" />
            {tr({
              es: `Próxima sesión: ${student.nextSession}`,
              en: `Next session: ${student.nextSession}`,
            })}
          </span>
        </div>

        {/* Big progress */}
        <div className="rounded-xl border border-hairline bg-surface-2 p-4">
          <div className="flex items-end justify-between">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-content-muted">
              <GraduationCap className="size-4 text-purple-ink" />
              {tr({ es: "Progreso del curso", en: "Course progress" })}
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-content">
              {student.progress}%
            </p>
          </div>
          <Progress value={student.progress} tone={student.accent} size="lg" className="mt-3" />
          <p className="mt-2 text-xs text-content-muted">
            {student.progress > CHECKRIDE_THRESHOLD
              ? tr({
                  es: "Listo para coordinar el checkride final.",
                  en: "Ready to coordinate the final checkride.",
                })
              : needsSupport(student)
                ? tr({
                    es: "Recomendado: sesión de refuerzo para nivelar el progreso.",
                    en: "Recommended: a reinforcement session to level up progress.",
                  })
                : tr({
                    es: "Avanzando según el plan de formación.",
                    en: "Progressing according to the training plan.",
                  })}
          </p>
        </div>

        {/* Progress notes */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-content-muted">
            {tr({ es: "Notas de progreso", en: "Progress notes" })}
          </p>
          <ul className="space-y-2">
            {notes.map((note, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 rounded-xl border border-hairline bg-surface-2 p-3 text-sm text-content-muted"
              >
                <span
                  className={cn(
                    "mt-1 size-1.5 shrink-0 rounded-full",
                    student.accent === "purple" && "bg-primary-500",
                    student.accent === "gold" && "bg-accent-500",
                    student.accent === "sky" && "bg-sky-500",
                    student.accent === "green" && "bg-success-500",
                  )}
                />
                {tr(note)}
              </li>
            ))}
          </ul>
        </div>

        {/* Schedule success state */}
        {scheduled && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-xl border border-success-500/35 bg-success-500/10 p-4"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-success-500/15 text-success-500">
              <CheckCircle2 className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-content">
                {tr({ es: "Sesión agendada", en: "Session scheduled" })}
              </p>
              <p className="text-xs text-content-muted">
                {tr({
                  es: `Se notificó a ${student.name}. La sesión aparece en tu agenda.`,
                  en: `${student.name} was notified. The session is now on your schedule.`,
                })}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
