"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  Gauge,
  MapPin,
  Plus,
  Search,
  SearchX,
  Send,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useRole } from "@/lib/role-context";
import { useTr } from "@/lib/i18n";
import { JOBS, type Job, type JobCategory } from "@/data/platform";
import { PageHeading } from "@/components/page-heading";
import { EmptyState } from "@/components/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";
import { toneIcon } from "@/lib/tone";

type CategoryFilter = "all" | JobCategory;

/** Deterministic but varied applicant counts for the employer view. */
const APPLICANTS: Record<string, number> = {
  "job-1": 14,
  "job-2": 9,
  "job-3": 6,
  "job-4": 11,
  "job-5": 4,
  "job-6": 7,
};

export default function JobsPage() {
  const { roleId } = useRole();
  const tr = useTr();
  const isEmployer = roleId === "employer";

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [postOpen, setPostOpen] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return JOBS.filter((j) => {
      if (category !== "all" && j.category !== category) return false;
      if (!q) return true;
      return (
        j.title.es.toLowerCase().includes(q) ||
        j.title.en.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    });
  }, [category, query]);

  const count = (cat: JobCategory) => JOBS.filter((j) => j.category === cat).length;

  const openJob = JOBS.find((j) => j.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <PageHeading
        title={
          isEmployer
            ? tr({ es: "Tus vacantes y candidatos", en: "Your jobs & candidates" })
            : tr({ es: "Bolsa de empleo", en: "Job board" })
        }
        subtitle={
          isEmployer
            ? tr({
                es: "Publicá vacantes y conectá con talento certificado del ecosistema AirPath.",
                en: "Post jobs and connect with certified talent from the AirPath ecosystem.",
              })
            : tr({
                es: "Oportunidades reales en aviación: pilotos, instructores, mecánicos y operaciones.",
                en: "Real aviation opportunities: pilots, instructors, mechanics and operations.",
              })
        }
        action={
          isEmployer ? (
            <Button leftIcon={Plus} onClick={() => setPostOpen(true)}>
              {tr({ es: "Publicar vacante", en: "Post a job" })}
            </Button>
          ) : (
            <Badge variant="gold" dot pulse>
              {tr({ es: "Demo en vivo", en: "Live demo" })}
            </Badge>
          )
        }
      />

      {/* Category tabs */}
      <Tabs
        active={category}
        onChange={(id) => setCategory(id as CategoryFilter)}
        tabs={[
          { id: "all", label: tr({ es: "Todas", en: "All" }), count: JOBS.length },
          { id: "pilot", label: tr({ es: "Pilotos", en: "Pilots" }), count: count("pilot") },
          {
            id: "instructor",
            label: tr({ es: "Instructores", en: "Instructors" }),
            count: count("instructor"),
          },
          {
            id: "mechanic",
            label: tr({ es: "Mecánicos", en: "Mechanics" }),
            count: count("mechanic"),
          },
          { id: "ops", label: tr({ es: "Operaciones", en: "Operations" }), count: count("ops") },
        ]}
      />

      {/* Search */}
      <Input
        icon={Search}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={tr({
          es: "Buscar por puesto, empresa o ciudad…",
          en: "Search by role, company or city…",
        })}
      />

      {/* Job grid */}
      {visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={tr({ es: "Sin resultados", en: "No results" })}
          description={tr({
            es: "Probá con otra categoría o ajustá tu búsqueda.",
            en: "Try another category or adjust your search.",
          })}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <AnimatePresence initial={false}>
            {visible.map((job) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              >
                <JobCard
                  job={job}
                  isEmployer={isEmployer}
                  onOpen={() => setOpenId(job.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detail modal */}
      <JobDetailModal
        job={openJob}
        isEmployer={isEmployer}
        onClose={() => setOpenId(null)}
      />

      {/* Post job modal */}
      <PostJobModal open={postOpen} onClose={() => setPostOpen(false)} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Job card                                                            */
/* ------------------------------------------------------------------ */

function JobCard({
  job,
  isEmployer,
  onOpen,
}: {
  job: Job;
  isEmployer: boolean;
  onOpen: () => void;
}) {
  const tr = useTr();
  return (
    <Card interactive className="h-full">
      <button type="button" onClick={onOpen} className="flex h-full w-full flex-col p-5 text-left">
        <div className="flex items-start gap-3.5">
          <span
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-xl text-sm font-extrabold",
              toneIcon[job.accent],
            )}
          >
            {job.companyInitials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-snug text-content">{tr(job.title)}</p>
            <p className="mt-0.5 truncate text-xs text-content-muted">{job.company}</p>
          </div>
          <Badge variant="neutral" className="shrink-0">
            {tr(job.type)}
          </Badge>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-content-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <DollarSign className="size-3.5 text-success-500" />
            {job.salary}
          </span>
          <span className="inline-flex items-center gap-1">
            <Gauge className="size-3.5" />
            {tr({ es: `Mín. ${job.minHours}`, en: `Min. ${job.minHours}` })}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-md border border-hairline bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-content-muted"
            >
              {tr(tag)}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-hairline pt-3.5">
          <span className="inline-flex items-center gap-1 text-[11px] text-content-muted">
            <CalendarDays className="size-3.5" />
            {tr({ es: `Publicada ${job.posted}`, en: `Posted ${job.posted}` })}
          </span>
          {isEmployer ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-ink">
              <Users className="size-3.5" />
              {tr({
                es: `${APPLICANTS[job.id] ?? 0} candidatos`,
                en: `${APPLICANTS[job.id] ?? 0} candidates`,
              })}
            </span>
          ) : (
            <span className="text-xs font-bold text-purple-ink">
              {tr({ es: "Ver detalle", en: "View detail" })}
            </span>
          )}
        </div>
      </button>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail modal                                                        */
/* ------------------------------------------------------------------ */

function JobDetailModal({
  job,
  isEmployer,
  onClose,
}: {
  job: Job | null;
  isEmployer: boolean;
  onClose: () => void;
}) {
  const tr = useTr();
  const [applied, setApplied] = useState(false);

  if (!job) return <Modal open={false} onClose={onClose} />;

  const handleClose = () => {
    onClose();
    // reset after the close animation
    window.setTimeout(() => setApplied(false), 300);
  };

  const applicants = APPLICANTS[job.id] ?? 0;

  return (
    <Modal
      open={!!job}
      onClose={handleClose}
      size="lg"
      title={
        <span className="flex items-center gap-2.5">
          <span
            className={cn(
              "grid size-9 place-items-center rounded-lg text-xs font-extrabold",
              toneIcon[job.accent],
            )}
          >
            {job.companyInitials}
          </span>
          {tr(job.title)}
        </span>
      }
      description={`${job.company} · ${job.location}`}
      footer={
        isEmployer ? (
          <Button variant="outline" size="sm" onClick={handleClose}>
            {tr({ es: "Cerrar", en: "Close" })}
          </Button>
        ) : applied ? (
          <Button size="sm" variant="subtle" onClick={handleClose}>
            {tr({ es: "Cerrar", en: "Close" })}
          </Button>
        ) : (
          <Button size="sm" leftIcon={Send} onClick={() => setApplied(true)}>
            {tr({ es: "Postularme", en: "Apply now" })}
          </Button>
        )
      }
    >
      <div className="space-y-5">
        {/* Key facts */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <FactTile icon={Briefcase} label={tr({ es: "Modalidad", en: "Type" })} value={tr(job.type)} />
          <FactTile
            icon={DollarSign}
            label={tr({ es: "Salario", en: "Salary" })}
            value={job.salary}
          />
          <FactTile
            icon={Gauge}
            label={tr({ es: "Horas mínimas", en: "Min. hours" })}
            value={job.minHours}
          />
          <FactTile
            icon={CalendarDays}
            label={tr({ es: "Publicada", en: "Posted" })}
            value={job.posted}
          />
        </div>

        {/* Description */}
        <div>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-content-muted">
            {tr({ es: "Sobre el puesto", en: "About the role" })}
          </p>
          <p className="text-sm leading-relaxed text-content-muted">
            {tr({
              es: `${job.company} busca sumar talento certificado a su operación en ${job.location}. Ofrecemos un entorno profesional, equipo moderno y un plan de crecimiento claro dentro de la industria de la aviación.`,
              en: `${job.company} is looking to add certified talent to its operation in ${job.location}. We offer a professional environment, modern equipment and a clear growth path within the aviation industry.`,
            })}
          </p>
        </div>

        {/* Requirements */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-content-muted">
            {tr({ es: "Requisitos", en: "Requirements" })}
          </p>
          <ul className="space-y-2">
            {[
              tr({
                es: `Experiencia mínima de ${job.minHours} de vuelo registradas.`,
                en: `Minimum logged flight experience of ${job.minHours}.`,
              }),
              tr({
                es: "Documentación y certificaciones FAA vigentes.",
                en: "Valid FAA documentation and certifications.",
              }),
              tr({
                es: "Disponibilidad para incorporación inmediata.",
                en: "Availability for immediate onboarding.",
              }),
            ].map((req, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-content-muted">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success-500" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {job.tags.map((tag, i) => (
            <Badge key={i} variant="purple">
              {tr(tag)}
            </Badge>
          ))}
        </div>

        {/* Employer applicant framing */}
        {isEmployer && (
          <div className="flex items-center gap-3 rounded-xl border border-primary-500/30 bg-primary-600/10 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-600/20 text-purple-ink">
              <Users className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-content">
                {tr({
                  es: `${applicants} candidatos postulados`,
                  en: `${applicants} candidates applied`,
                })}
              </p>
              <p className="text-xs text-content-muted">
                {tr({
                  es: "Revisá los perfiles y agendá entrevistas desde tu panel.",
                  en: "Review profiles and schedule interviews from your dashboard.",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Applicant success state */}
        {!isEmployer && applied && (
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
                {tr({ es: "Postulación enviada", en: "Application sent" })}
              </p>
              <p className="text-xs text-content-muted">
                {tr({
                  es: `Tu perfil llegó a ${job.company}. Te contactarán si avanzás.`,
                  en: `Your profile reached ${job.company}. They'll contact you if you advance.`,
                })}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}

function FactTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-2 p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-content-muted">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-content">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Post job modal (employer)                                           */
/* ------------------------------------------------------------------ */

function PostJobModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const tr = useTr();
  const [stage, setStage] = useState<"form" | "publishing" | "done">("form");

  const handleClose = () => {
    onClose();
    window.setTimeout(() => setStage("form"), 300);
  };

  const publish = () => {
    setStage("publishing");
    window.setTimeout(() => setStage("done"), 1200);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="md"
      title={tr({ es: "Publicar vacante", en: "Post a job" })}
      description={
        stage === "done"
          ? undefined
          : tr({
              es: "Completá los datos para publicar en la bolsa de AirPath.",
              en: "Fill in the details to publish on the AirPath board.",
            })
      }
    >
      {stage === "done" ? (
        <div className="flex flex-col items-center py-4 text-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.45 }}
            className="grid size-16 place-items-center rounded-2xl bg-success-500/15 text-success-500"
          >
            <CheckCircle2 className="size-9" />
          </motion.span>
          <h3 className="mt-4 text-lg font-extrabold tracking-tight text-content">
            {tr({ es: "¡Vacante publicada!", en: "Job published!" })}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-content-muted">
            {tr({
              es: "Tu vacante ya es visible para pilotos y mecánicos del ecosistema AirPath.",
              en: "Your job is now visible to pilots and mechanics across the AirPath ecosystem.",
            })}
          </p>
          <Button className="mt-5" fullWidth onClick={handleClose}>
            {tr({ es: "Listo", en: "Done" })}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Input
            label={tr({ es: "Título del puesto", en: "Job title" })}
            placeholder={tr({
              es: "Ej. Primer Oficial — Airbus A320",
              en: "e.g. First Officer — Airbus A320",
            })}
            defaultValue=""
          />
          <Input
            icon={MapPin}
            label={tr({ es: "Ubicación", en: "Location" })}
            placeholder={tr({ es: "Ciudad, país", en: "City, country" })}
            defaultValue=""
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              icon={Building2}
              label={tr({ es: "Modalidad", en: "Type" })}
              placeholder={tr({ es: "Tiempo completo", en: "Full-time" })}
              defaultValue=""
            />
            <Input
              icon={DollarSign}
              label={tr({ es: "Salario", en: "Salary" })}
              placeholder="$78k–$95k"
              defaultValue=""
            />
          </div>
          <Button
            className="mt-1"
            fullWidth
            size="lg"
            leftIcon={Plus}
            loading={stage === "publishing"}
            onClick={publish}
          >
            {stage === "publishing"
              ? tr({ es: "Publicando…", en: "Publishing…" })
              : tr({ es: "Publicar vacante", en: "Publish job" })}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-content-muted">
            <Clock className="size-3.5" />
            {tr({
              es: "Formulario de demostración — no se publica una vacante real.",
              en: "Demo form — no real job is published.",
            })}
          </p>
        </div>
      )}
    </Modal>
  );
}
