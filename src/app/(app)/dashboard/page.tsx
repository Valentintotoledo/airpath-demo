"use client";

import Link from "next/link";
import {
  Award,
  BadgeCheck,
  Briefcase,
  CalendarCheck,
  Check,
  ChevronRight,
  ClipboardCheck,
  Compass,
  CreditCard,
  Flame,
  GraduationCap,
  Lock,
  Plane,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useRole } from "@/lib/role-context";
import { useI18n, useT, useTr } from "@/lib/i18n";
import { getDemoUser, CAREER_STAGES, type CareerStage } from "@/data/mock";
import { COURSES } from "@/data/academy";
import { AIRCRAFT } from "@/data/marketplace";
import {
  ACHIEVEMENTS,
  ADMIN_METRICS,
  BOOKINGS,
  CERTIFICATES,
  JOBS,
  STUDENT_RECORDS,
} from "@/data/platform";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatTile } from "@/components/stat-tile";
import { BarChart, StackedBar } from "@/components/charts";
import { toneIcon, toneText, type Accent } from "@/lib/tone";
import { cn } from "@/lib/cn";

const ACH_ICONS: Record<string, LucideIcon> = {
  rocket: Rocket,
  award: Award,
  flame: Flame,
  target: Target,
  compass: Compass,
  trophy: Trophy,
};

export default function DashboardPage() {
  const { roleId, role } = useRole();
  const { lang } = useI18n();
  const t = useT();
  const tr = useTr();
  const user = getDemoUser(roleId);

  return (
    <div className="space-y-7">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-hairline bg-gradient-to-br from-primary-700/35 via-surface to-surface p-6 sm:p-7">
        <div className="absolute -right-16 -top-24 size-72 glow-purple opacity-40" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar initials={user.initials} accent={role.accent} size="xl" ring />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-content-muted">{t.home.hello},</p>
            <h1 className="mt-0.5 flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              <span className="truncate">{user.name}</span>
              {user.verified && <BadgeCheck className="size-5 shrink-0 text-accent-400" />}
            </h1>
            <p className="mt-1 text-sm text-content-muted">{user.headline[lang]}</p>
          </div>
          <Badge variant="gold" dot pulse className="self-start">
            {t.common.demoBadge}
          </Badge>
        </div>
      </section>

      {roleId === "student" && <StudentDashboard tr={tr} lang={lang} />}
      {roleId === "instructor" && <InstructorDashboard tr={tr} lang={lang} />}
      {roleId === "school" && <SchoolDashboard tr={tr} lang={lang} />}
      {roleId === "owner" && <OwnerDashboard tr={tr} lang={lang} />}
      {roleId === "admin" && <AdminDashboard tr={tr} lang={lang} />}
      {roleId === "mechanic" && <MechanicDashboard tr={tr} lang={lang} />}
      {roleId === "employer" && <EmployerDashboard tr={tr} lang={lang} />}
    </div>
  );
}

type Tr = ReturnType<typeof useTr>;
type SectionProps = { tr: Tr; lang: "es" | "en" };

/* ---------------- Section header helper ---------------- */

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-lg font-extrabold tracking-tight text-content">{children}</h2>
      {action}
    </div>
  );
}

function SeeAll({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm font-bold text-purple-ink transition hover:opacity-80"
    >
      {label}
      <ChevronRight className="size-4" />
    </Link>
  );
}

/* ================= STUDENT ================= */

function StudentDashboard({ tr }: SectionProps) {
  const course = COURSES.find((c) => c.status === "in_progress") ?? COURSES[1];
  const unlockedPoints = ACHIEVEMENTS.filter((a) => a.unlocked).reduce((s, a) => s + a.points, 0);
  const overall = Math.round(CAREER_STAGES.reduce((s, x) => s + x.progress, 0) / CAREER_STAGES.length);

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Plane} tone="purple" label={tr({ es: "Horas voladas", en: "Hours flown" })} value="64.2" hint={tr({ es: "Meta IR: 40 h instrumento", en: "IR goal: 40 hr instrument" })} />
        <StatTile icon={GraduationCap} tone="sky" label={tr({ es: "Curso activo", en: "Active course" })} value="IR" delta={45} />
        <StatTile icon={Flame} tone="gold" label={tr({ es: "Racha de estudio", en: "Study streak" })} value={tr({ es: "15 días", en: "15 days" })} />
        <StatTile icon={Star} tone="gold" label={tr({ es: "Puntos AirPath", en: "AirPath points" })} value="2.480" />
      </div>

      {/* Career path */}
      <section>
        <SectionTitle action={<Badge variant="gold">{tr({ es: `${overall}% completado`, en: `${overall}% complete` })}</Badge>}>
          {tr({ es: "Tu ruta de carrera FAA", en: "Your FAA career path" })}
        </SectionTitle>
        <Card className="p-4 sm:p-5" data-tour="career">
          <div className="no-scrollbar overflow-x-auto">
            <div className="flex min-w-[600px] items-stretch gap-2">
              {CAREER_STAGES.map((stage, i) => (
                <CareerNode key={stage.id} stage={stage} tr={tr} last={i === CAREER_STAGES.length - 1} />
              ))}
            </div>
          </div>
        </Card>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Continue course */}
        <Card className="lg:col-span-2" glow>
          <div className="flex items-start gap-3 p-5">
            <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", toneIcon[course.accent])}>
              <GraduationCap className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-content-muted">
                {tr({ es: "Continuá donde lo dejaste", en: "Pick up where you left off" })}
              </p>
              <h3 className="mt-0.5 text-base font-bold text-content">{tr(course.title)}</h3>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={course.progress} tone="sky" className="flex-1" />
                <span className="text-sm font-bold tabular-nums text-content">{course.progress}%</span>
              </div>
              <p className="mt-2 text-sm text-content-muted">
                {tr({ es: "Próxima lección: Cartas de aproximación Jeppesen", en: "Next lesson: Jeppesen approach charts" })}
              </p>
              <Button href={`/academy/${course.id}`} size="sm" leftIcon={Play} className="mt-4">
                {tr({ es: "Retomar curso", en: "Resume course" })}
              </Button>
            </div>
          </div>
        </Card>

        {/* Next Written exam */}
        <Card className="flex flex-col p-5">
          <span className="grid size-11 place-items-center rounded-xl bg-accent-500/15 text-gold-ink">
            <ClipboardCheck className="size-5" />
          </span>
          <h3 className="mt-3 text-base font-bold text-content">
            {tr({ es: "Examen Written", en: "Written exam" })}
          </h3>
          <p className="mt-1 flex-1 text-sm text-content-muted">
            {tr({
              es: "Practicá con el banco de preguntas randomizado estilo FAA antes de tu checkride.",
              en: "Practice with the FAA-style randomized question bank before your checkride.",
            })}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-content-muted">
            <Target className="size-4 text-gold-ink" />
            {tr({ es: "Mejor puntaje: 88%", en: "Best score: 88%" })}
          </div>
          <Button href="/written" variant="gold" size="sm" className="mt-4" fullWidth>
            {tr({ es: "Iniciar simulacro", en: "Start mock exam" })}
          </Button>
        </Card>
      </div>

      {/* Achievements */}
      <section>
        <SectionTitle
          action={
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-gold-ink">
              <Star className="size-4" fill="currentColor" />
              {unlockedPoints.toLocaleString("es")} pts
            </span>
          }
        >
          {tr({ es: "Logros desbloqueados", en: "Unlocked achievements" })}
        </SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ACHIEVEMENTS.map((a) => {
            const Icon = ACH_ICONS[a.icon] ?? Award;
            return (
              <Card
                key={a.id}
                className={cn("flex flex-col items-center p-4 text-center", !a.unlocked && "opacity-55")}
              >
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-xl",
                    a.unlocked ? "bg-accent-500/15 text-gold-ink" : "bg-surface-2 text-content-muted",
                  )}
                >
                  {a.unlocked ? <Icon className="size-6" /> : <Lock className="size-5" />}
                </span>
                <p className="mt-2 text-xs font-bold leading-tight text-content">{tr(a.title)}</p>
                <p className="mt-1 text-[11px] font-semibold text-gold-ink">+{a.points}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Certificates + marketplace */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle action={<SeeAll href="/certificates" label={tr({ es: "Ver todos", en: "View all" })} />}>
            {tr({ es: "Tus certificados", en: "Your certificates" })}
          </SectionTitle>
          <div className="space-y-2.5">
            {CERTIFICATES.slice(0, 2).map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
                <span className="grid size-10 place-items-center rounded-lg bg-accent-500/15 text-gold-ink">
                  <Award className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-content">{tr(c.course)}</p>
                  <p className="font-mono text-xs text-content-muted">{c.code}</p>
                </div>
                <Badge variant="green">{tr({ es: "Válido", en: "Valid" })}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col justify-between gap-4 bg-gradient-to-br from-primary-700/25 via-surface to-surface p-5">
          <div>
            <span className="grid size-11 place-items-center rounded-xl bg-primary-600/20 text-purple-ink">
              <Compass className="size-5" />
            </span>
            <h3 className="mt-3 text-base font-bold text-content">
              {tr({ es: "Tu time building te espera", en: "Your time building awaits" })}
            </h3>
            <p className="mt-1 text-sm text-content-muted">
              {tr({
                es: "Reservá aeronaves con matrícula N para sumar horas. Desde USD 130/h.",
                en: "Book N-registered aircraft to log hours. From USD 130/hr.",
              })}
            </p>
          </div>
          <Button href="/marketplace" variant="outline" size="sm" rightIcon={ChevronRight}>
            {tr({ es: "Explorar marketplace", en: "Explore marketplace" })}
          </Button>
        </Card>
      </div>
    </>
  );
}

function CareerNode({ stage, tr, last }: { stage: CareerStage; tr: Tr; last: boolean }) {
  const done = stage.status === "completed";
  const current = stage.status === "current";
  const locked = stage.status === "locked";
  return (
    <div className="flex flex-1 items-center gap-2">
      <div
        className={cn(
          "flex-1 rounded-xl border p-3.5",
          current
            ? "border-accent-500/45 bg-accent-500/[0.07]"
            : done
              ? "border-success-500/35 bg-success-500/[0.06]"
              : "border-hairline bg-surface-2",
        )}
      >
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-xs font-extrabold",
              current ? "bg-accent-500 text-neutral-950" : done ? "bg-success-500 text-white" : "bg-surface text-content-muted",
            )}
          >
            {stage.code}
          </span>
          <span
            className={cn(
              "grid size-6 place-items-center rounded-full",
              done ? "bg-success-500 text-white" : current ? "bg-accent-500 text-neutral-950" : "bg-surface text-content-muted",
            )}
          >
            {done ? <Check className="size-3.5" /> : current ? <Play className="size-3" /> : <Lock className="size-3" />}
          </span>
        </div>
        <p className={cn("mt-2 text-sm font-bold", locked ? "text-content-muted" : "text-content")}>
          {tr(stage.name)}
        </p>
        <p className="mt-0.5 text-[11px] text-content-muted">{tr(stage.hours)}</p>
        <Progress
          value={stage.progress}
          tone={done ? "green" : "gold"}
          size="sm"
          className="mt-2.5"
        />
      </div>
      {!last && <ChevronRight className="size-4 shrink-0 text-content-muted" />}
    </div>
  );
}

/* ================= INSTRUCTOR ================= */

function InstructorDashboard({ tr }: SectionProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Users} tone="sky" label={tr({ es: "Estudiantes activos", en: "Active students" })} value="5" />
        <StatTile icon={CalendarCheck} tone="purple" label={tr({ es: "Sesiones esta semana", en: "Sessions this week" })} value="8" delta={14} />
        <StatTile icon={Star} tone="gold" label={tr({ es: "Calificación", en: "Rating" })} value="4.9" />
        <StatTile icon={CreditCard} tone="green" label={tr({ es: "Ingresos del mes", en: "Monthly earnings" })} value="$4.2k" delta={9} />
      </div>

      <Card className="p-5">
        <SectionTitle action={<SeeAll href="/students" label={tr({ es: "Ver todos", en: "View all" })} />}>
          {tr({ es: "Mis estudiantes", en: "My students" })}
        </SectionTitle>
        <div className="space-y-2.5">
          {STUDENT_RECORDS.slice(0, 4).map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
              <Avatar initials={s.initials} accent={s.accent} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-content">{s.name}</p>
                <p className="truncate text-xs text-content-muted">{tr(s.course)}</p>
              </div>
              <div className="hidden w-32 sm:block">
                <Progress value={s.progress} tone={s.accent} size="sm" />
              </div>
              <span className="text-sm font-bold tabular-nums text-content">{s.progress}%</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <UpcomingSessions tr={tr} />
        <QuickLinks
          tr={tr}
          links={[
            { href: "/students", icon: Users, label: tr({ es: "Gestionar estudiantes", en: "Manage students" }) },
            { href: "/certificates", icon: Award, label: tr({ es: "Certificados emitidos", en: "Issued certificates" }) },
            { href: "/billing", icon: CreditCard, label: tr({ es: "Pagos y membresía", en: "Payments & membership" }) },
          ]}
        />
      </div>
    </>
  );
}

/* ================= SCHOOL ================= */

function SchoolDashboard({ tr }: SectionProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Users} tone="gold" label={tr({ es: "Estudiantes inscriptos", en: "Enrolled students" })} value="480" delta={6} />
        <StatTile icon={GraduationCap} tone="purple" label={tr({ es: "Programas activos", en: "Active programs" })} value="4" />
        <StatTile icon={Plane} tone="sky" label={tr({ es: "Aeronaves en flota", en: "Fleet aircraft" })} value="5" />
        <StatTile icon={Star} tone="gold" label={tr({ es: "Calificación", en: "Rating" })} value="4.9" />
      </div>

      <Card className="p-5">
        <SectionTitle action={<SeeAll href="/students" label={tr({ es: "Ver todos", en: "View all" })} />}>
          {tr({ es: "Estudiantes por programa", en: "Students by program" })}
        </SectionTitle>
        <div className="space-y-2.5">
          {STUDENT_RECORDS.slice(0, 4).map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
              <Avatar initials={s.initials} accent={s.accent} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-content">{s.name}</p>
                <p className="truncate text-xs text-content-muted">{tr(s.course)}</p>
              </div>
              <Badge variant={s.progress > 80 ? "green" : "purple"}>{tr(s.status)}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <UpcomingSessions tr={tr} />
        <QuickLinks
          tr={tr}
          links={[
            { href: "/marketplace", icon: Plane, label: tr({ es: "Ver mi flota en marketplace", en: "View my fleet in marketplace" }) },
            { href: "/bookings", icon: CalendarCheck, label: tr({ es: "Reservas y aprobaciones", en: "Bookings & approvals" }) },
            { href: "/documents", icon: ShieldCheck, label: tr({ es: "Validación documental", en: "Document validation" }) },
          ]}
        />
      </div>
    </>
  );
}

/* ================= OWNER ================= */

function OwnerDashboard({ tr }: SectionProps) {
  const myAircraft = AIRCRAFT.filter((a) => a.owner === "Carolina Duarte");
  const pending = BOOKINGS.filter((b) => b.status === "pending");
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Plane} tone="green" label={tr({ es: "Aeronaves publicadas", en: "Listed aircraft" })} value={myAircraft.length} />
        <StatTile icon={CalendarCheck} tone="gold" label={tr({ es: "Reservas pendientes", en: "Pending bookings" })} value={pending.length} />
        <StatTile icon={TrendingUp} tone="purple" label={tr({ es: "Horas rentadas (mes)", en: "Hours rented (mo)" })} value="142" delta={11} />
        <StatTile icon={CreditCard} tone="sky" label={tr({ es: "Ingresos del mes", en: "Monthly earnings" })} value="$6.8k" delta={15} />
      </div>

      <Card className="p-5">
        <SectionTitle action={<SeeAll href="/bookings" label={tr({ es: "Gestionar", en: "Manage" })} />}>
          {tr({ es: "Reservas pendientes de aprobación", en: "Bookings pending approval" })}
        </SectionTitle>
        <div className="space-y-2.5">
          {pending.map((b) => (
            <div key={b.id} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
              <span className={cn("grid size-10 place-items-center rounded-lg", toneIcon[b.accent])}>
                <Plane className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-content">{b.title}</p>
                <p className="truncate text-xs text-content-muted">
                  {b.requestedBy} · {b.dateLabel}
                </p>
              </div>
              <Badge variant="warning">{tr({ es: "Pendiente", en: "Pending" })}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle action={<SeeAll href="/marketplace" label={tr({ es: "Ver todas", en: "View all" })} />}>
            {tr({ es: "Mi flota", en: "My fleet" })}
          </SectionTitle>
          <div className="space-y-2.5">
            {myAircraft.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
                <span className={cn("grid size-10 place-items-center rounded-lg", toneIcon[a.accent])}>
                  <Plane className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-content">{a.model}</p>
                  <p className="font-mono text-xs text-content-muted">{a.tailNumber}</p>
                </div>
                <span className="text-sm font-bold text-content">${a.pricePerHour}/h</span>
              </div>
            ))}
          </div>
        </Card>
        <QuickLinks
          tr={tr}
          links={[
            { href: "/marketplace", icon: Plane, label: tr({ es: "Publicar / editar aeronaves", en: "List / edit aircraft" }) },
            { href: "/documents", icon: ShieldCheck, label: tr({ es: "Validación documental", en: "Document validation" }) },
            { href: "/billing", icon: CreditCard, label: tr({ es: "Pagos y comisiones", en: "Payments & commissions" }) },
          ]}
        />
      </div>
    </>
  );
}

/* ================= ADMIN ================= */

function AdminDashboard({ tr }: SectionProps) {
  const m = ADMIN_METRICS;
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={CreditCard} tone="purple" label={tr({ es: "Ingresos del mes", en: "Monthly revenue" })} value={`$${(m.revenueMonthly / 1000).toFixed(0)}k`} delta={m.revenueGrowth} />
        <StatTile icon={Users} tone="sky" label={tr({ es: "Usuarios activos", en: "Active users" })} value={m.activeUsers.toLocaleString("es")} delta={m.usersGrowth} />
        <StatTile icon={CalendarCheck} tone="gold" label={tr({ es: "Aprobaciones pendientes", en: "Pending approvals" })} value={m.pendingApprovals} />
        <StatTile icon={TrendingUp} tone="green" label={tr({ es: "Leads del mes", en: "Leads this month" })} value={m.leadsThisMonth.toLocaleString("es")} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle action={<SeeAll href="/admin" label={tr({ es: "Panel completo", en: "Full panel" })} />}>
            {tr({ es: "Ingresos · últimos 7 meses", en: "Revenue · last 7 months" })}
          </SectionTitle>
          <BarChart data={m.revenueTrend.map((d) => ({ label: d.month, value: d.value }))} tone="purple" />
        </Card>
        <Card className="p-5">
          <SectionTitle>{tr({ es: "Funnel de conversión", en: "Conversion funnel" })}</SectionTitle>
          <div className="space-y-3">
            {m.funnel.map((f, i) => {
              const pct = Math.round((f.value / m.funnel[0].value) * 100);
              const tones: Accent[] = ["sky", "purple", "gold"];
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm">
                    <span className="text-content-muted">{tr(f.label)}</span>
                    <span className="font-bold text-content">{f.value.toLocaleString("es")}</span>
                  </div>
                  <Progress value={pct} tone={tones[i]} className="mt-1.5" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <SectionTitle>{tr({ es: "Ingresos por fuente", en: "Revenue by stream" })}</SectionTitle>
        <StackedBar segments={m.revenueByStream.map((s) => ({ label: tr(s.label), value: s.value, accent: s.accent }))} />
      </Card>
    </>
  );
}

/* ================= MECHANIC ================= */

function MechanicDashboard({ tr }: SectionProps) {
  const jobs = JOBS.filter((j) => j.category === "mechanic");
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Briefcase} tone="sky" label={tr({ es: "Vacantes para vos", en: "Jobs for you" })} value={jobs.length} />
        <StatTile icon={ClipboardCheck} tone="purple" label={tr({ es: "Postulaciones activas", en: "Active applications" })} value="2" />
        <StatTile icon={ShieldCheck} tone="green" label={tr({ es: "Certificación A&P", en: "A&P certification" })} value={tr({ es: "Vigente", en: "Valid" })} />
        <StatTile icon={Star} tone="gold" label={tr({ es: "Puntos AirPath", en: "AirPath points" })} value="960" />
      </div>

      <Card className="p-5">
        <SectionTitle action={<SeeAll href="/jobs" label={tr({ es: "Ver bolsa", en: "View board" })} />}>
          {tr({ es: "Vacantes recomendadas", en: "Recommended jobs" })}
        </SectionTitle>
        <div className="space-y-2.5">
          {jobs.map((j) => (
            <div key={j.id} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
              <span className={cn("grid size-10 place-items-center rounded-lg font-bold", toneIcon[j.accent])}>
                {j.companyInitials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-content">{tr(j.title)}</p>
                <p className="truncate text-xs text-content-muted">
                  {j.company} · {j.location}
                </p>
              </div>
              <span className="hidden text-sm font-bold text-content sm:block">{j.salary}</span>
            </div>
          ))}
        </div>
      </Card>

      <QuickLinks
        tr={tr}
        links={[
          { href: "/jobs", icon: Briefcase, label: tr({ es: "Explorar bolsa de empleo", en: "Explore job board" }) },
          { href: "/documents", icon: ShieldCheck, label: tr({ es: "Mis certificaciones", en: "My certifications" }) },
          { href: "/billing", icon: CreditCard, label: tr({ es: "Pagos y membresía", en: "Payments & membership" }) },
        ]}
      />
    </>
  );
}

/* ================= EMPLOYER ================= */

function EmployerDashboard({ tr }: SectionProps) {
  const myJobs = JOBS.filter((j) => j.company === "Aero Charter Group");
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Briefcase} tone="gold" label={tr({ es: "Vacantes activas", en: "Active jobs" })} value={myJobs.length} />
        <StatTile icon={Users} tone="purple" label={tr({ es: "Candidatos", en: "Candidates" })} value="18" delta={22} />
        <StatTile icon={CalendarCheck} tone="sky" label={tr({ es: "Entrevistas", en: "Interviews" })} value="4" />
        <StatTile icon={BadgeCheck} tone="green" label={tr({ es: "Contratados (mes)", en: "Hired (month)" })} value="1" />
      </div>

      <Card className="p-5">
        <SectionTitle action={<SeeAll href="/jobs" label={tr({ es: "Gestionar", en: "Manage" })} />}>
          {tr({ es: "Tus vacantes publicadas", en: "Your posted jobs" })}
        </SectionTitle>
        <div className="space-y-2.5">
          {myJobs.map((j) => (
            <div key={j.id} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
              <span className={cn("grid size-10 place-items-center rounded-lg", toneIcon[j.accent])}>
                <Briefcase className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-content">{tr(j.title)}</p>
                <p className="truncate text-xs text-content-muted">{j.location}</p>
              </div>
              <Badge variant="purple">{tr({ es: "Activa", en: "Active" })}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <QuickLinks
        tr={tr}
        links={[
          { href: "/jobs", icon: Briefcase, label: tr({ es: "Publicar nueva vacante", en: "Post a new job" }) },
          { href: "/marketplace", icon: Plane, label: tr({ es: "Buscar talento en el ecosistema", en: "Find talent in the ecosystem" }) },
          { href: "/billing", icon: CreditCard, label: tr({ es: "Facturación", en: "Billing" }) },
        ]}
      />
    </>
  );
}

/* ---------------- Shared widgets ---------------- */

function UpcomingSessions({ tr }: { tr: Tr }) {
  const sessions = BOOKINGS.filter((b) => b.status !== "rejected").slice(0, 3);
  return (
    <Card className="p-5">
      <SectionTitle action={<SeeAll href="/bookings" label={tr({ es: "Ver agenda", en: "View schedule" })} />}>
        {tr({ es: "Próximas sesiones", en: "Upcoming sessions" })}
      </SectionTitle>
      <div className="space-y-2.5">
        {sessions.map((b) => (
          <div key={b.id} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
            <span className="grid size-10 place-items-center rounded-lg bg-primary-600/15 text-purple-ink">
              <CalendarCheck className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-content">{b.title}</p>
              <p className="truncate text-xs text-content-muted">{b.dateLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function QuickLinks({
  tr,
  links,
}: {
  tr: Tr;
  links: { href: string; icon: LucideIcon; label: string }[];
}) {
  return (
    <Card className="p-5">
      <SectionTitle>{tr({ es: "Accesos rápidos", en: "Quick access" })}</SectionTitle>
      <div className="space-y-2">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3 transition hover:border-primary-500/40"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-primary-600/15 text-purple-ink">
                <Icon className="size-[18px]" />
              </span>
              <span className="flex-1 text-sm font-semibold text-content">{l.label}</span>
              <ChevronRight className="size-4 text-content-muted" />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
