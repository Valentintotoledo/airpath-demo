"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarCheck,
  Check,
  CreditCard,
  Flag,
  GraduationCap,
  Heart,
  MessageSquareWarning,
  Plane,
  School,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  UserCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTr } from "@/lib/i18n";
import type { L10n } from "@/data/mock";
import {
  ADMIN_METRICS,
  ADMIN_USERS,
  PENDING_VALIDATIONS,
  type AdminUser,
  type ValidationItem,
} from "@/data/platform";
import { PageHeading } from "@/components/page-heading";
import { StatTile } from "@/components/stat-tile";
import { EmptyState } from "@/components/empty-state";
import { BarChart, ProgressRing, StackedBar } from "@/components/charts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import { toneIcon, toneSolid, toneText, type Accent } from "@/lib/tone";
import { cn } from "@/lib/cn";

type Tr = ReturnType<typeof useTr>;

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const tr = useTr();
  const [tab, setTab] = useState("metrics");

  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS);
  const [validations, setValidations] = useState<ValidationItem[]>(PENDING_VALIDATIONS);
  const [moderation, setModeration] = useState<ModerationItem[]>(() => buildModeration());

  const pendingUsers = users.filter((u) => u.status === "pending").length;

  const tabs: TabItem[] = [
    { id: "metrics", label: tr({ es: "Métricas", en: "Metrics" }), icon: TrendingUp },
    {
      id: "users",
      label: tr({ es: "Usuarios", en: "Users" }),
      icon: Users,
      count: pendingUsers || undefined,
    },
    {
      id: "validations",
      label: tr({ es: "Validaciones", en: "Validations" }),
      icon: ShieldCheck,
      count: validations.length || undefined,
    },
    {
      id: "moderation",
      label: tr({ es: "Moderación", en: "Moderation" }),
      icon: Flag,
      count: moderation.length || undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title={tr({ es: "Panel de administración", en: "Admin panel" })}
        subtitle={tr({
          es: "Reportes en tiempo real, gestión de usuarios y cola de moderación del ecosistema AirPath.",
          en: "Real-time reports, user management and moderation queue for the AirPath ecosystem.",
        })}
        action={
          <Badge variant="gold" dot pulse>
            {tr({ es: "Datos en vivo", en: "Live data" })}
          </Badge>
        }
      />

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "metrics" && <MetricsTab tr={tr} />}
      {tab === "users" && <UsersTab tr={tr} users={users} setUsers={setUsers} />}
      {tab === "validations" && (
        <ValidationsTab tr={tr} items={validations} setItems={setValidations} />
      )}
      {tab === "moderation" && (
        <ModerationTab tr={tr} items={moderation} setItems={setModeration} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared section helper                                              */
/* ------------------------------------------------------------------ */

function SectionTitle({
  children,
  hint,
  action,
}: {
  children: React.ReactNode;
  hint?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-base font-extrabold tracking-tight text-content">{children}</h2>
        {hint && <p className="mt-0.5 text-xs text-content-muted">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

/* ================================================================== */
/*  METRICS TAB                                                        */
/* ================================================================== */

function MetricsTab({ tr }: { tr: Tr }) {
  const m = ADMIN_METRICS;
  const maxRole = Math.max(...m.usersByRole.map((r) => r.value), 1);

  return (
    <div className="space-y-5">
      {/* Headline stat tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          icon={CreditCard}
          tone="purple"
          label={tr({ es: "Ingresos mensuales", en: "Monthly revenue" })}
          value={`$${(m.revenueMonthly / 1000).toFixed(1)}k`}
          delta={m.revenueGrowth}
          hint={tr({ es: "vs. mes anterior", en: "vs. last month" })}
        />
        <StatTile
          icon={Users}
          tone="sky"
          label={tr({ es: "Usuarios activos", en: "Active users" })}
          value={m.activeUsers.toLocaleString("en-US")}
          delta={m.usersGrowth}
          hint={tr({ es: "últimos 30 días", en: "last 30 days" })}
        />
        <StatTile
          icon={CalendarCheck}
          tone="gold"
          label={tr({ es: "Reservas pendientes", en: "Pending bookings" })}
          value={m.pendingApprovals}
          hint={tr({ es: "esperan aprobación", en: "awaiting approval" })}
        />
        <StatTile
          icon={TrendingUp}
          tone="green"
          label={tr({ es: "Leads generados", en: "Leads generated" })}
          value={m.leadsThisMonth.toLocaleString("en-US")}
          hint={tr({ es: "este mes", en: "this month" })}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Revenue trend */}
        <Card className="p-5 lg:col-span-2">
          <SectionTitle
            hint={tr({ es: "Ingresos en miles de USD", en: "Revenue in thousands of USD" })}
            action={
              <span className="inline-flex items-center gap-1 text-sm font-bold text-success-500">
                <TrendingUp className="size-4" />+{m.revenueGrowth}%
              </span>
            }
          >
            {tr({ es: "Ingresos · últimos 7 meses", en: "Revenue · last 7 months" })}
          </SectionTitle>
          <BarChart
            data={m.revenueTrend.map((d) => ({ label: d.month, value: d.value }))}
            tone="purple"
            height={170}
          />
        </Card>

        {/* Revenue by stream */}
        <Card className="p-5">
          <SectionTitle
            hint={tr({ es: "Mix de ingresos del mes", en: "This month's revenue mix" })}
          >
            {tr({ es: "Ingresos por fuente", en: "Revenue by stream" })}
          </SectionTitle>
          <p className="mb-4 text-2xl font-extrabold tracking-tight text-content">
            ${m.revenueMonthly.toLocaleString("en-US")}
          </p>
          <StackedBar
            segments={m.revenueByStream.map((s) => ({
              label: tr(s.label),
              value: s.value,
              accent: s.accent,
            }))}
          />
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Users breakdown */}
        <Card className="p-5 lg:col-span-2">
          <SectionTitle
            hint={tr({
              es: "Composición de la base de usuarios",
              en: "Breakdown of the user base",
            })}
            action={
              <div className="flex gap-2">
                <MiniStat
                  label={tr({ es: "Retención", en: "Retention" })}
                  value={`${m.retention}%`}
                  tone="green"
                />
                <MiniStat
                  label={tr({ es: "Churn", en: "Churn" })}
                  value={`${m.churn}%`}
                  tone="gold"
                />
              </div>
            }
          >
            {tr({ es: "Usuarios por rol", en: "Users by role" })}
          </SectionTitle>
          <div className="space-y-3">
            {m.usersByRole.map((r, i) => {
              const tones: Accent[] = ["purple", "sky", "gold", "green", "purple", "sky"];
              const tone = tones[i % tones.length];
              const pct = Math.round((r.value / maxRole) * 100);
              return (
                <div key={i}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-content-muted">{tr(r.label)}</span>
                    <span className="font-bold tabular-nums text-content">
                      {r.value.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={cn("h-full rounded-full", toneSolid[tone])}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Course progress rings */}
        <Card className="p-5">
          <SectionTitle
            hint={tr({
              es: "Desempeño de la Academy",
              en: "Academy performance",
            })}
          >
            {tr({ es: "Progreso de cursos", en: "Course progress" })}
          </SectionTitle>
          <div className="flex items-center justify-around gap-3 py-2">
            <div className="flex flex-col items-center gap-2">
              <ProgressRing
                value={m.courseCompletion}
                tone="green"
                size={104}
                label={tr({ es: "completado", en: "completed" })}
              />
              <p className="text-xs font-semibold text-content-muted">
                {tr({ es: "Finalización", en: "Completion" })}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ProgressRing
                value={m.courseDropout}
                tone="gold"
                size={104}
                label={tr({ es: "abandono", en: "dropout" })}
              />
              <p className="text-xs font-semibold text-content-muted">
                {tr({ es: "Abandono", en: "Dropout" })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Conversion funnel */}
      <Card className="p-5">
        <SectionTitle
          hint={tr({
            es: "Visitantes → Registrados → Pagos",
            en: "Visitors → Registered → Paid",
          })}
        >
          {tr({ es: "Conversión", en: "Conversion" })}
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {m.funnel.map((f, i) => {
            const top = m.funnel[0].value;
            const pct = Math.round((f.value / top) * 100);
            const tones: Accent[] = ["sky", "purple", "gold"];
            const tone = tones[i % tones.length];
            return (
              <div
                key={i}
                className="rounded-xl border border-hairline bg-surface-2 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-content-muted">
                    {tr(f.label)}
                  </span>
                  <span className={cn("text-sm font-extrabold tabular-nums", toneText[tone])}>
                    {pct}%
                  </span>
                </div>
                <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-content">
                  {f.value.toLocaleString("en-US")}
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className={cn("h-full rounded-full", toneSolid[tone])}
                    style={{ width: `${Math.max(pct, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Marketplace + Academy engagement */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle
            hint={tr({
              es: "Movimiento en los 4 verticales",
              en: "Activity across the 4 verticals",
            })}
          >
            {tr({ es: "Actividad del marketplace", en: "Marketplace activity" })}
          </SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <StatTile
              icon={Store}
              tone="purple"
              label={tr({ es: "Publicaciones activas", en: "Active listings" })}
              value={m.marketplaceListings}
            />
            <StatTile
              icon={Plane}
              tone="sky"
              label={tr({ es: "Reservas completadas", en: "Completed bookings" })}
              value={m.marketplaceBookings}
            />
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center p-5">
          <SectionTitle
            hint={tr({ es: "Estudiantes activos semanales", en: "Weekly active learners" })}
          >
            {tr({ es: "Engagement Academy", en: "Academy engagement" })}
          </SectionTitle>
          <ProgressRing
            value={m.academyEngagement}
            tone="purple"
            size={128}
            stroke={11}
            label={tr({ es: "engagement", en: "engagement" })}
          />
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-content-muted">
            <GraduationCap className="size-4 text-purple-ink" />
            {tr({
              es: "Por encima del objetivo trimestral",
              en: "Above the quarterly target",
            })}
          </p>
        </Card>
      </div>
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: Accent }) {
  return (
    <div className="rounded-lg border border-hairline bg-surface-2 px-2.5 py-1.5 text-center">
      <p className={cn("text-sm font-extrabold tabular-nums", toneText[tone])}>{value}</p>
      <p className="text-[10px] font-medium text-content-muted">{label}</p>
    </div>
  );
}

/* ================================================================== */
/*  USERS TAB                                                          */
/* ================================================================== */

function UsersTab({
  tr,
  users,
  setUsers,
}: {
  tr: Tr;
  users: AdminUser[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q));
  }, [users, query]);

  const approve = (id: string) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "active" } : u)),
    );

  const pendingCount = users.filter((u) => u.status === "pending").length;

  return (
    <Card className="p-5">
      <SectionTitle
        hint={tr({
          es: `${users.length} usuarios · ${pendingCount} pendientes de aprobación`,
          en: `${users.length} users · ${pendingCount} awaiting approval`,
        })}
        action={
          <div className="w-44 sm:w-60">
            <Input
              icon={Search}
              placeholder={tr({ es: "Buscar por nombre…", en: "Search by name…" })}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        }
      >
        {tr({ es: "Gestión de usuarios", en: "User management" })}
      </SectionTitle>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title={tr({ es: "Sin resultados", en: "No results" })}
          description={tr({
            es: "Ningún usuario coincide con tu búsqueda.",
            en: "No users match your search.",
          })}
        />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[560px] space-y-2">
            {/* Header row */}
            <div className="grid grid-cols-[1.6fr_1.2fr_0.9fr_0.9fr] gap-3 px-3 pb-1 text-[11px] font-bold uppercase tracking-wide text-content-muted">
              <span>{tr({ es: "Usuario", en: "User" })}</span>
              <span>{tr({ es: "Rol", en: "Role" })}</span>
              <span>{tr({ es: "Registro", en: "Joined" })}</span>
              <span className="text-right">{tr({ es: "Estado", en: "Status" })}</span>
            </div>
            {filtered.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-[1.6fr_1.2fr_0.9fr_0.9fr] items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar initials={u.initials} accent={u.accent} size="sm" />
                  <p className="truncate text-sm font-bold text-content">{u.name}</p>
                </div>
                <p className="truncate text-sm text-content-muted">{tr(u.role)}</p>
                <p className="font-mono text-xs text-content-muted">{u.joined}</p>
                <div className="flex items-center justify-end">
                  {u.status === "active" ? (
                    <Badge variant="green" dot>
                      {tr({ es: "Activo", en: "Active" })}
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={UserCheck}
                      onClick={() => approve(u.id)}
                    >
                      {tr({ es: "Aprobar", en: "Approve" })}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

/* ================================================================== */
/*  VALIDATIONS TAB                                                    */
/* ================================================================== */

function ValidationsTab({
  tr,
  items,
  setItems,
}: {
  tr: Tr;
  items: ValidationItem[];
  setItems: React.Dispatch<React.SetStateAction<ValidationItem[]>>;
}) {
  const resolve = (id: string) => setItems((prev) => prev.filter((v) => v.id !== id));

  return (
    <Card className="p-5">
      <SectionTitle
        hint={tr({
          es: "Documentos enviados por usuarios esperando revisión",
          en: "User-submitted documents awaiting review",
        })}
        action={
          <Badge variant={items.length ? "warning" : "green"}>
            {items.length
              ? tr({ es: `${items.length} pendientes`, en: `${items.length} pending` })
              : tr({ es: "Al día", en: "All clear" })}
          </Badge>
        }
      >
        {tr({ es: "Cola de validación documental", en: "Document validation queue" })}
      </SectionTitle>

      {items.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={tr({ es: "Cola vacía", en: "Queue empty" })}
          description={tr({
            es: "No hay documentos pendientes de validación. Buen trabajo.",
            en: "No documents pending validation. Nice work.",
          })}
        />
      ) : (
        <div className="space-y-2.5">
          {items.map((v) => (
            <div
              key={v.id}
              className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-2 p-3 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar initials={v.initials} accent={v.accent} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-content">{v.user}</p>
                  <p className="truncate text-xs text-content-muted">{tr(v.doc)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="inline-flex items-center gap-1 font-mono text-xs text-content-muted">
                  <CalendarCheck className="size-3.5" />
                  {v.submitted}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={Check}
                    onClick={() => resolve(v.id)}
                  >
                    {tr({ es: "Aprobar", en: "Approve" })}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={X}
                    onClick={() => resolve(v.id)}
                  >
                    {tr({ es: "Rechazar", en: "Reject" })}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ================================================================== */
/*  MODERATION TAB                                                     */
/* ================================================================== */

type ModerationSeverity = "high" | "medium" | "low";

type ModerationItem = {
  id: string;
  icon: LucideIcon;
  type: L10n;
  description: L10n;
  severity: ModerationSeverity;
  accent: Accent;
  reportedBy: L10n;
  when: string;
};

function buildModeration(): ModerationItem[] {
  const L = (es: string, en: string): L10n => ({ es, en });
  return [
    {
      id: "mod-1",
      icon: Plane,
      type: L("Aeronave reportada", "Flagged aircraft listing"),
      description: L(
        "N512AP · Cessna 172 — fotos posiblemente desactualizadas y precio fuera de rango.",
        "N512AP · Cessna 172 — possibly outdated photos and price out of range.",
      ),
      severity: "medium",
      accent: "gold",
      reportedBy: L("3 usuarios", "3 users"),
      when: "2026-05-22",
    },
    {
      id: "mod-2",
      icon: MessageSquareWarning,
      type: L("Reseña denunciada", "Reported review"),
      description: L(
        "Reseña con lenguaje ofensivo sobre el instructor Cap. Andrés Morales.",
        "Review with offensive language about instructor Cap. Andrés Morales.",
      ),
      severity: "high",
      accent: "purple",
      reportedBy: L("Instructor", "Instructor"),
      when: "2026-05-22",
    },
    {
      id: "mod-3",
      icon: School,
      type: L("Escuela sin verificar", "Unverified school profile"),
      description: L(
        "Andes Aviation Center solicitó verificación — falta certificación Part 141.",
        "Andes Aviation Center requested verification — missing Part 141 certification.",
      ),
      severity: "low",
      accent: "sky",
      reportedBy: L("Solicitud propia", "Self-submitted"),
      when: "2026-05-21",
    },
    {
      id: "mod-4",
      icon: AlertTriangle,
      type: L("Vacante reportada", "Flagged job post"),
      description: L(
        "Vacante de Blue Horizon Jets con requisitos de horas potencialmente engañosos.",
        "Blue Horizon Jets job post with potentially misleading hour requirements.",
      ),
      severity: "medium",
      accent: "gold",
      reportedBy: L("2 usuarios", "2 users"),
      when: "2026-05-20",
    },
  ];
}

function ModerationTab({
  tr,
  items,
  setItems,
}: {
  tr: Tr;
  items: ModerationItem[];
  setItems: React.Dispatch<React.SetStateAction<ModerationItem[]>>;
}) {
  const resolve = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const severityBadge: Record<
    ModerationSeverity,
    { variant: "danger" | "warning" | "sky"; label: L10n }
  > = {
    high: { variant: "danger", label: { es: "Alta", en: "High" } },
    medium: { variant: "warning", label: { es: "Media", en: "Medium" } },
    low: { variant: "sky", label: { es: "Baja", en: "Low" } },
  };

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <SectionTitle
          hint={tr({
            es: "Contenido reportado en cursos, marketplace y bolsa de empleo",
            en: "Reported content across courses, marketplace and job board",
          })}
          action={
            <Badge variant={items.length ? "warning" : "green"}>
              {items.length
                ? tr({ es: `${items.length} en cola`, en: `${items.length} in queue` })
                : tr({ es: "Todo al día", en: "All clear" })}
            </Badge>
          }
        >
          {tr({ es: "Cola de moderación", en: "Moderation queue" })}
        </SectionTitle>

        {items.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title={tr({ es: "Todo al día", en: "All clear" })}
            description={tr({
              es: "No hay contenido pendiente de moderación. El ecosistema está limpio.",
              en: "No content pending moderation. The ecosystem is clean.",
            })}
          />
        ) : (
          <div className="space-y-2.5">
            {items.map((it) => {
              const sev = severityBadge[it.severity];
              const Icon = it.icon;
              return (
                <div
                  key={it.id}
                  className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-2 p-3.5 sm:flex-row sm:items-center"
                >
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-lg",
                      toneIcon[it.accent],
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-content">{tr(it.type)}</p>
                      <Badge variant={sev.variant}>{tr(sev.label)}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-content-muted">{tr(it.description)}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-content-muted/80">
                      <Flag className="size-3" />
                      {tr({ es: "Reportado por", en: "Reported by" })} {tr(it.reportedBy)} ·{" "}
                      {it.when}
                    </p>
                  </div>
                  <div className="flex gap-2 sm:shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={Check}
                      onClick={() => resolve(it.id)}
                    >
                      {tr({ es: "Aprobar", en: "Approve" })}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      leftIcon={X}
                      onClick={() => resolve(it.id)}
                    >
                      {tr({ es: "Quitar", en: "Remove" })}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {items.length > 0 && (
        <Card className="flex items-center gap-3 bg-gradient-to-br from-primary-700/20 via-surface to-surface p-4">
          <span className="grid size-10 place-items-center rounded-xl bg-accent-500/15 text-gold-ink">
            <Heart className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-content">
              {tr({ es: "Comunidad saludable", en: "Healthy community" })}
            </p>
            <p className="text-xs text-content-muted">
              {tr({
                es: "Solo el 0,3% del contenido del ecosistema requiere revisión manual.",
                en: "Only 0.3% of ecosystem content requires manual review.",
              })}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
