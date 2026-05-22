"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CalendarCheck,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  GraduationCap,
  Hourglass,
  Plane,
  Send,
  ShieldCheck,
  User,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useRole } from "@/lib/role-context";
import { useTr } from "@/lib/i18n";
import { BOOKINGS, type Booking, type BookingKind, type BookingStatus } from "@/data/platform";
import { PageHeading } from "@/components/page-heading";
import { StatTile } from "@/components/stat-tile";
import { EmptyState } from "@/components/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";
import { toneIcon } from "@/lib/tone";

const KIND_ICON: Record<BookingKind, LucideIcon> = {
  aircraft: Plane,
  instructor: GraduationCap,
  charter: Send,
};

type StatusMeta = {
  badge: "warning" | "green" | "danger" | "neutral";
  es: string;
  en: string;
};

const STATUS_META: Record<BookingStatus, StatusMeta> = {
  pending: { badge: "warning", es: "Pendiente", en: "Pending" },
  approved: { badge: "green", es: "Aprobada", en: "Approved" },
  rejected: { badge: "danger", es: "Rechazada", en: "Rejected" },
  completed: { badge: "neutral", es: "Completada", en: "Completed" },
};

export default function BookingsPage() {
  const { roleId } = useRole();
  const tr = useTr();

  const approvalMode = roleId === "owner" || roleId === "school";

  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      approved: bookings.filter((b) => b.status === "approved").length,
      completed: bookings.filter((b) => b.status === "completed").length,
    }),
    [bookings],
  );

  const visible = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter],
  );

  const setStatus = (id: string, status: BookingStatus) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));

  const openBooking = bookings.find((b) => b.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <PageHeading
        title={
          approvalMode
            ? tr({ es: "Reservas y aprobaciones", en: "Bookings & approvals" })
            : tr({ es: "Mis reservas", en: "My bookings" })
        }
        subtitle={
          approvalMode
            ? tr({
                es: "Revisá y resolvé las solicitudes de reserva de tu flota y servicios.",
                en: "Review and resolve booking requests for your fleet and services.",
              })
            : tr({
                es: "Seguí el estado de tus reservas de aeronaves, instructores y charters.",
                en: "Track the status of your aircraft, instructor and charter bookings.",
              })
        }
        action={
          <Badge variant="gold" dot pulse>
            {tr({ es: "Demo en vivo", en: "Live demo" })}
          </Badge>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          icon={CalendarCheck}
          tone="purple"
          label={tr({ es: "Reservas totales", en: "Total bookings" })}
          value={counts.total}
        />
        <StatTile
          icon={Hourglass}
          tone="gold"
          label={tr({ es: "Pendientes", en: "Pending" })}
          value={counts.pending}
          hint={
            approvalMode
              ? tr({ es: "Esperan tu decisión", en: "Awaiting your decision" })
              : tr({ es: "En revisión del proveedor", en: "Under provider review" })
          }
        />
        <StatTile
          icon={CheckCircle2}
          tone="green"
          label={tr({ es: "Aprobadas", en: "Approved" })}
          value={counts.approved}
        />
        <StatTile
          icon={Plane}
          tone="sky"
          label={tr({ es: "Completadas", en: "Completed" })}
          value={counts.completed}
        />
      </div>

      {/* Filter tabs */}
      <Tabs
        active={filter}
        onChange={(id) => setFilter(id as "all" | BookingStatus)}
        tabs={[
          { id: "all", label: tr({ es: "Todas", en: "All" }), count: counts.total },
          { id: "pending", label: tr({ es: "Pendientes", en: "Pending" }), count: counts.pending },
          { id: "approved", label: tr({ es: "Aprobadas", en: "Approved" }), count: counts.approved },
          {
            id: "completed",
            label: tr({ es: "Completadas", en: "Completed" }),
            count: counts.completed,
          },
        ]}
      />

      {/* Booking list */}
      {visible.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title={tr({ es: "Sin reservas en este filtro", en: "No bookings in this filter" })}
          description={tr({
            es: "Probá con otra pestaña para ver más reservas.",
            en: "Try another tab to see more bookings.",
          })}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {visible.map((b) => (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              >
                <BookingRow
                  booking={b}
                  tr={tr}
                  approvalMode={approvalMode}
                  onOpen={() => setOpenId(b.id)}
                  onApprove={() => setStatus(b.id, "approved")}
                  onReject={() => setStatus(b.id, "rejected")}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <BookingDetailModal
        booking={openBooking}
        tr={tr}
        approvalMode={approvalMode}
        onClose={() => setOpenId(null)}
        onApprove={() => {
          if (openBooking) setStatus(openBooking.id, "approved");
        }}
        onReject={() => {
          if (openBooking) setStatus(openBooking.id, "rejected");
        }}
      />
    </div>
  );
}

type Tr = ReturnType<typeof useTr>;

/* ------------------------------------------------------------------ */
/*  Booking row                                                         */
/* ------------------------------------------------------------------ */

function BookingRow({
  booking,
  tr,
  approvalMode,
  onOpen,
  onApprove,
  onReject,
}: {
  booking: Booking;
  tr: Tr;
  approvalMode: boolean;
  onOpen: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const Icon = KIND_ICON[booking.kind];
  const meta = STATUS_META[booking.status];
  const deposit = Math.round((booking.price * booking.depositPct) / 100);

  return (
    <Card interactive className="overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
        {/* Clickable info zone */}
        <button
          type="button"
          onClick={onOpen}
          className="flex min-w-0 flex-1 items-start gap-3.5 text-left"
        >
          <span
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-xl",
              toneIcon[booking.accent],
            )}
          >
            <Icon className="size-[22px]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-bold text-content">{booking.title}</p>
              <Badge variant={meta.badge}>{tr({ es: meta.es, en: meta.en })}</Badge>
            </div>
            <p className="mt-0.5 truncate text-sm text-content-muted">{tr(booking.subtitle)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-content-muted">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5 text-content-muted" />
                {booking.dateLabel}
              </span>
              <span className="inline-flex items-center gap-1">
                <User className="size-3.5 text-content-muted" />
                {approvalMode ? booking.requestedBy : booking.counterparty}
              </span>
            </div>
          </div>
        </button>

        {/* Price + actions */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-hairline pt-3 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <div className="text-left sm:text-right">
            <p className="text-base font-extrabold tracking-tight text-content">
              ${booking.price.toLocaleString("es")}
            </p>
            <p className="text-[11px] font-medium text-content-muted">
              {tr({ es: `${booking.depositPct}% depósito`, en: `${booking.depositPct}% deposit` })} ·
              ${deposit.toLocaleString("es")}
            </p>
          </div>

          {approvalMode && booking.status === "pending" ? (
            <div className="flex items-center gap-2">
              <Button variant="danger" size="sm" leftIcon={X} onClick={onReject}>
                {tr({ es: "Rechazar", en: "Reject" })}
              </Button>
              <Button size="sm" leftIcon={Check} onClick={onApprove}>
                {tr({ es: "Aprobar", en: "Approve" })}
              </Button>
            </div>
          ) : !approvalMode && booking.status === "pending" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warning-500">
              <Hourglass className="size-3.5" />
              {tr({ es: "Esperando aprobación", en: "Awaiting approval" })}
            </span>
          ) : booking.status === "completed" ? (
            <Button variant="outline" size="sm" rightIcon={ChevronRight} onClick={onOpen}>
              {tr({ es: "Ver detalle", en: "View detail" })}
            </Button>
          ) : (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-semibold",
                booking.status === "approved" ? "text-success-400" : "text-danger-400",
              )}
            >
              {booking.status === "approved" ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <XCircle className="size-3.5" />
              )}
              {booking.status === "approved"
                ? tr({ es: "Confirmada", en: "Confirmed" })
                : tr({ es: "Sin disponibilidad", en: "Unavailable" })}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail modal                                                        */
/* ------------------------------------------------------------------ */

type TimelineStep = { label: string; done: boolean; current?: boolean };

function BookingDetailModal({
  booking,
  tr,
  approvalMode,
  onClose,
  onApprove,
  onReject,
}: {
  booking: Booking | null;
  tr: Tr;
  approvalMode: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  if (!booking) return <Modal open={false} onClose={onClose} />;

  const Icon = KIND_ICON[booking.kind];
  const meta = STATUS_META[booking.status];
  const deposit = Math.round((booking.price * booking.depositPct) / 100);
  const balance = booking.price - deposit;
  const resolved =
    booking.status === "approved" ||
    booking.status === "completed" ||
    booking.status === "rejected";

  const timeline: TimelineStep[] = [
    { label: tr({ es: "Solicitud enviada", en: "Request submitted" }), done: true },
    {
      label:
        booking.status === "rejected"
          ? tr({ es: "Solicitud rechazada", en: "Request rejected" })
          : tr({ es: "Aprobada por el proveedor", en: "Approved by provider" }),
      done: resolved,
      current: booking.status === "pending",
    },
    {
      label: tr({ es: "Depósito cobrado", en: "Deposit charged" }),
      done: booking.status === "approved" || booking.status === "completed",
      current: false,
    },
    {
      label: tr({ es: "Vuelo completado", en: "Flight completed" }),
      done: booking.status === "completed",
      current: booking.status === "approved",
    },
  ];

  return (
    <Modal
      open={!!booking}
      onClose={onClose}
      size="lg"
      title={
        <span className="flex items-center gap-2.5">
          <span
            className={cn(
              "grid size-9 place-items-center rounded-lg",
              toneIcon[booking.accent],
            )}
          >
            <Icon className="size-5" />
          </span>
          {booking.title}
        </span>
      }
      description={tr(booking.subtitle)}
      footer={
        approvalMode && booking.status === "pending" ? (
          <>
            <Button variant="danger" size="sm" leftIcon={X} onClick={onReject}>
              {tr({ es: "Rechazar", en: "Reject" })}
            </Button>
            <Button size="sm" leftIcon={Check} onClick={onApprove}>
              {tr({ es: "Aprobar reserva", en: "Approve booking" })}
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={onClose}>
            {tr({ es: "Cerrar", en: "Close" })}
          </Button>
        )
      }
    >
      <div className="space-y-5">
        {/* Status + date */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={meta.badge}>{tr({ es: meta.es, en: meta.en })}</Badge>
          <span className="inline-flex items-center gap-1.5 text-sm text-content-muted">
            <CalendarCheck className="size-4 text-purple-ink" />
            {booking.dateLabel}
          </span>
        </div>

        {/* Counterparties */}
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoTile
            icon={User}
            label={tr({ es: "Solicitado por", en: "Requested by" })}
            value={booking.requestedBy}
          />
          <InfoTile
            icon={ShieldCheck}
            label={tr({ es: "Proveedor", en: "Provider" })}
            value={booking.counterparty}
          />
        </div>

        {/* Deposit breakdown */}
        <div className="rounded-xl border border-hairline bg-surface-2 p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-content-muted">
            <CreditCard className="size-4 text-gold-ink" />
            {tr({ es: "Desglose de pago", en: "Payment breakdown" })}
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-content-muted">
                {tr({ es: "Precio total", en: "Total price" })}
              </dt>
              <dd className="font-bold text-content">
                ${booking.price.toLocaleString("es")}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-content-muted">
                {tr({
                  es: `Depósito (${booking.depositPct}%)`,
                  en: `Deposit (${booking.depositPct}%)`,
                })}
              </dt>
              <dd className="font-bold text-gold-ink">${deposit.toLocaleString("es")}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-hairline pt-2">
              <dt className="text-content-muted">
                {tr({ es: "Saldo al completar", en: "Balance on completion" })}
              </dt>
              <dd className="font-bold text-content">${balance.toLocaleString("es")}</dd>
            </div>
          </dl>
        </div>

        {/* Timeline */}
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-content-muted">
            {tr({ es: "Línea de tiempo", en: "Timeline" })}
          </p>
          <ol className="space-y-0.5">
            {timeline.map((step, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full border",
                      step.done
                        ? "border-success-500 bg-success-500 text-white"
                        : step.current
                          ? "border-primary-500 bg-primary-600/20 text-purple-ink"
                          : "border-hairline bg-surface-2 text-content-muted",
                    )}
                  >
                    {step.done ? (
                      <Check className="size-3.5" />
                    ) : step.current ? (
                      <Clock className="size-3.5" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-current" />
                    )}
                  </span>
                  {i < timeline.length - 1 && (
                    <span
                      className={cn(
                        "my-0.5 w-px flex-1",
                        step.done ? "bg-success-500/50" : "bg-hairline",
                      )}
                    />
                  )}
                </div>
                <p
                  className={cn(
                    "pb-3 text-sm",
                    step.done || step.current
                      ? "font-semibold text-content"
                      : "text-content-muted",
                  )}
                >
                  {step.label}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {!approvalMode && booking.status === "pending" && (
          <p className="rounded-xl border border-warning-500/30 bg-warning-500/10 p-3 text-xs font-medium text-warning-500">
            {tr({
              es: "Esperando aprobación del proveedor. Te avisaremos cuando responda.",
              en: "Awaiting provider approval. We'll notify you when they respond.",
            })}
          </p>
        )}
      </div>
    </Modal>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-2 p-3.5">
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-content-muted">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-content">{value}</p>
    </div>
  );
}
