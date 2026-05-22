"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  BadgeCheck,
  Check,
  CreditCard,
  Crown,
  Globe,
  Layers,
  Receipt,
  RefreshCw,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useTr } from "@/lib/i18n";
import { PLANS, TRANSACTIONS, type Plan, type Transaction } from "@/data/platform";
import { PageHeading } from "@/components/page-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { CheckoutForm } from "@/components/billing/checkout-form";
import { cn } from "@/lib/cn";

type Cycle = "monthly" | "yearly";

/** The plan currently considered active in this demo. */
const ACTIVE_PLAN_ID = "pro";

export default function BillingPage() {
  const tr = useTr();
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);

  const activePlan = PLANS.find((p) => p.id === ACTIVE_PLAN_ID) ?? PLANS[1];

  return (
    <div className="space-y-6">
      <PageHeading
        title={tr({ es: "Pagos & Membresía", en: "Payments & Membership" })}
        subtitle={tr({
          es: "Gestioná tu plan, métodos de pago y el historial de transacciones de AirPath.",
          en: "Manage your plan, payment methods and AirPath transaction history.",
        })}
        action={
          <Badge variant="gold" dot pulse>
            {tr({ es: "Demo en vivo", en: "Live demo" })}
          </Badge>
        }
      />

      {/* Current plan */}
      <Card glow className="overflow-hidden">
        <div className="absolute -right-12 -top-16 size-56 glow-purple opacity-40" />
        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-500/15 text-gold-ink">
              <Crown className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-content-muted">
                {tr({ es: "Tu plan actual", en: "Your current plan" })}
              </p>
              <h2 className="mt-0.5 flex flex-wrap items-center gap-2 text-xl font-extrabold tracking-tight text-content">
                {tr(activePlan.name)}
                <Badge variant="green">
                  <BadgeCheck className="size-3" />
                  {tr({ es: "Activo", en: "Active" })}
                </Badge>
              </h2>
              <p className="mt-1 text-sm text-content-muted">{tr(activePlan.tagline)}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-content-muted">
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw className="size-3.5 text-purple-ink" />
                  {tr({ es: "Se renueva el 1 jun 2026", en: "Renews on Jun 1, 2026" })}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CreditCard className="size-3.5 text-purple-ink" />
                  Visa ···· 4242
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0 border-t border-hairline pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <p className="text-3xl font-extrabold tracking-tight text-content">
              ${activePlan.priceMonthly}
              <span className="text-sm font-bold text-content-muted">
                {" "}
                /{tr({ es: "mes", en: "mo" })}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-content-muted">
              {tr({ es: "Facturado mensualmente", en: "Billed monthly" })}
            </p>
          </div>
        </div>
      </Card>

      {/* Plans section */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-content">
            {tr({ es: "Planes disponibles", en: "Available plans" })}
          </h2>
          <CycleToggle cycle={cycle} onChange={setCycle} />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              cycle={cycle}
              isActive={plan.id === ACTIVE_PLAN_ID}
              onChoose={() => setCheckoutPlan(plan)}
            />
          ))}
        </div>
      </section>

      {/* Payment history */}
      <section>
        <h2 className="mb-3 text-lg font-extrabold tracking-tight text-content">
          {tr({ es: "Historial de pagos", en: "Payment history" })}
        </h2>
        <Card className="overflow-hidden">
          {/* Desktop table header */}
          <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-hairline px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-content-muted sm:grid">
            <span>{tr({ es: "Concepto", en: "Concept" })}</span>
            <span className="w-28">{tr({ es: "Método", en: "Method" })}</span>
            <span className="w-24 text-right">{tr({ es: "Monto", en: "Amount" })}</span>
            <span className="w-24 text-right">{tr({ es: "Estado", en: "Status" })}</span>
          </div>
          <ul className="divide-y divide-hairline">
            {TRANSACTIONS.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </ul>
        </Card>
      </section>

      {/* Payment models info */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary-600/15 text-purple-ink">
            <Layers className="size-[18px]" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-content">
              {tr({ es: "Modelos de pago de AirPath", en: "AirPath payment models" })}
            </h3>
            <p className="text-xs text-content-muted">
              {tr({
                es: "Una sola plataforma, múltiples flujos de monetización.",
                en: "One platform, multiple monetization flows.",
              })}
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow
            icon={Receipt}
            title={tr({ es: "Pagos únicos por curso", en: "One-time course payments" })}
            text={tr({
              es: "Comprá cursos FAA individuales sin suscripción.",
              en: "Buy individual FAA courses with no subscription.",
            })}
          />
          <InfoRow
            icon={RefreshCw}
            title={tr({ es: "Suscripciones recurrentes", en: "Recurring subscriptions" })}
            text={tr({
              es: "Membresías mensuales o anuales con renovación automática.",
              en: "Monthly or yearly memberships with auto-renewal.",
            })}
          />
          <InfoRow
            icon={Wallet}
            title={tr({ es: "Depósitos parciales en reservas", en: "Partial booking deposits" })}
            text={tr({
              es: "Reservá aeronaves pagando solo el depósito inicial.",
              en: "Book aircraft paying just the initial deposit.",
            })}
          />
          <InfoRow
            icon={ArrowLeftRight}
            title={tr({ es: "Comisiones del marketplace", en: "Marketplace commissions" })}
            text={tr({
              es: "AirPath retiene una comisión por cada operación del ecosistema.",
              en: "AirPath retains a commission on each ecosystem transaction.",
            })}
          />
          <InfoRow
            icon={Globe}
            title={tr({ es: "Multi-moneda", en: "Multi-currency" })}
            text={tr({
              es: "USD nativo, listo para EUR, COP y BRL.",
              en: "Native USD, ready for EUR, COP and BRL.",
            })}
          />
          <InfoRow
            icon={CreditCard}
            title={tr({ es: "Pagos seguros con Stripe", en: "Secure Stripe payments" })}
            text={tr({
              es: "Tokenización PCI-DSS — AirPath nunca almacena tu tarjeta.",
              en: "PCI-DSS tokenization — AirPath never stores your card.",
            })}
          />
        </div>
      </Card>

      {/* Checkout modal */}
      <Modal
        open={!!checkoutPlan}
        onClose={() => setCheckoutPlan(null)}
        size="md"
        title={tr({ es: "Checkout", en: "Checkout" })}
      >
        {checkoutPlan && (
          <CheckoutForm
            productName={tr(checkoutPlan.name)}
            productHint={
              cycle === "monthly"
                ? tr({ es: "Suscripción mensual", en: "Monthly subscription" })
                : tr({ es: "Suscripción anual", en: "Yearly subscription" })
            }
            amount={cycle === "monthly" ? checkoutPlan.priceMonthly : checkoutPlan.priceYearly}
            onDone={() => setCheckoutPlan(null)}
          />
        )}
      </Modal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cycle toggle                                                        */
/* ------------------------------------------------------------------ */

function CycleToggle({ cycle, onChange }: { cycle: Cycle; onChange: (c: Cycle) => void }) {
  const tr = useTr();
  return (
    <div className="inline-flex items-center gap-1 self-start rounded-xl border border-hairline bg-surface p-1">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={cn(
          "h-9 rounded-lg px-3.5 text-sm font-semibold transition",
          cycle === "monthly"
            ? "bg-primary-600 text-white shadow"
            : "text-content-muted hover:text-content",
        )}
      >
        {tr({ es: "Mensual", en: "Monthly" })}
      </button>
      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold transition",
          cycle === "yearly"
            ? "bg-primary-600 text-white shadow"
            : "text-content-muted hover:text-content",
        )}
      >
        {tr({ es: "Anual", en: "Yearly" })}
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            cycle === "yearly" ? "bg-white/20 text-white" : "bg-accent-500/15 text-gold-ink",
          )}
        >
          -20%
        </span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Plan card                                                           */
/* ------------------------------------------------------------------ */

function PlanCard({
  plan,
  cycle,
  isActive,
  onChoose,
}: {
  plan: Plan;
  cycle: Cycle;
  isActive: boolean;
  onChoose: () => void;
}) {
  const tr = useTr();
  const price = cycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
  const isFree = plan.priceMonthly === 0;
  const monthsFree =
    plan.priceMonthly > 0
      ? Math.round((plan.priceMonthly * 12 - plan.priceYearly) / plan.priceMonthly)
      : 0;

  return (
    <Card
      className={cn(
        "flex flex-col p-5",
        plan.featured && "border-primary-500/55 shadow-[0_0_60px_-20px_var(--color-primary-600)]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 text-base font-extrabold tracking-tight text-content">
            {plan.featured && <Sparkles className="size-4 shrink-0 text-purple-ink" />}
            {tr(plan.name)}
          </h3>
          <p className="mt-0.5 text-xs text-content-muted">{tr(plan.tagline)}</p>
        </div>
        {plan.featured && (
          <Badge variant="solidPurple" className="shrink-0">
            {tr({ es: "Recomendado", en: "Recommended" })}
          </Badge>
        )}
      </div>

      {/* Price */}
      <div className="mt-4">
        <p className="text-3xl font-extrabold tracking-tight text-content">
          ${price.toLocaleString("es")}
          <span className="text-sm font-bold text-content-muted">
            {" "}
            /{cycle === "monthly" ? tr({ es: "mes", en: "mo" }) : tr({ es: "año", en: "yr" })}
          </span>
        </p>
        {isFree ? (
          <p className="mt-1 text-xs text-content-muted">
            {tr({ es: "Para siempre, sin tarjeta.", en: "Forever, no card required." })}
          </p>
        ) : cycle === "yearly" ? (
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-ink">
            <Sparkles className="size-3.5" />
            {tr({
              es: `${monthsFree} meses gratis al año`,
              en: `${monthsFree} months free per year`,
            })}
          </p>
        ) : (
          <p className="mt-1 text-xs text-content-muted">
            {tr({ es: "Facturado mes a mes.", en: "Billed month to month." })}
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="mt-4 flex-1 space-y-2.5">
        {plan.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span
              className={cn(
                "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full",
                plan.featured ? "bg-primary-600 text-white" : "bg-success-500/20 text-success-500",
              )}
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span className="text-content-muted">{tr(feat)}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        className="mt-5"
        fullWidth
        variant={isActive ? "subtle" : plan.featured ? "primary" : "outline"}
        disabled={isActive}
        onClick={onChoose}
      >
        {isActive
          ? tr({ es: "Plan actual", en: "Current plan" })
          : tr({ es: "Elegir plan", en: "Choose plan" })}
      </Button>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Transaction row                                                     */
/* ------------------------------------------------------------------ */

function TransactionRow({ tx }: { tx: Transaction }) {
  const tr = useTr();
  const refunded = tx.status === "refunded";

  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-3.5 sm:grid-cols-[1fr_auto_auto_auto]">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-content">{tr(tx.concept)}</p>
        <p className="text-xs text-content-muted">{tx.date}</p>
      </div>
      <span className="hidden w-28 text-xs font-medium text-content-muted sm:block">
        {tx.method}
      </span>
      <span
        className={cn(
          "w-24 text-right text-sm font-extrabold tabular-nums",
          refunded ? "text-danger-400" : "text-content",
        )}
      >
        {refunded ? "−" : ""}${tx.amount.toLocaleString("es")}
      </span>
      <div className="col-start-2 row-start-2 flex justify-end sm:col-start-4 sm:row-start-1 sm:w-24">
        <Badge variant={refunded ? "danger" : "green"}>
          {refunded
            ? tr({ es: "Reembolsado", en: "Refunded" })
            : tr({ es: "Pagado", en: "Paid" })}
        </Badge>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Info row                                                            */
/* ------------------------------------------------------------------ */

function InfoRow({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-hairline bg-surface-2 p-3.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-600/15 text-purple-ink">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-content">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-content-muted">{text}</p>
      </div>
    </div>
  );
}
