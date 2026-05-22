"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTr } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import type { Plan } from "@/data/platform";

type Cycle = "monthly" | "yearly";

type CheckoutModalProps = {
  open: boolean;
  onClose: () => void;
  plan: Plan | null;
  cycle: Cycle;
};

/** Mock Stripe-style checkout — strictly fake card data, never real. */
export function CheckoutModal({ open, onClose, plan, cycle }: CheckoutModalProps) {
  const tr = useTr();
  const [step, setStep] = useState<"form" | "processing" | "done">("form");

  // Reset whenever the modal opens for a new plan.
  useEffect(() => {
    if (open) setStep("form");
  }, [open, plan?.id]);

  if (!plan) return null;

  const price = cycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const cycleLabel =
    cycle === "yearly"
      ? tr({ es: "por año", en: "per year" })
      : tr({ es: "por mes", en: "per month" });

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => setStep("done"), 1400);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={
        step === "done"
          ? tr({ es: "Pago confirmado", en: "Payment confirmed" })
          : tr({ es: "Finalizar suscripción", en: "Complete subscription" })
      }
      description={
        step === "done"
          ? undefined
          : tr({ es: "Checkout seguro · simulación de demo", en: "Secure checkout · demo simulation" })
      }
    >
      {step === "done" ? (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-success-500/15 text-success-500">
            <CheckCircle2 className="size-9" />
          </span>
          <h3 className="mt-4 text-lg font-extrabold tracking-tight text-content">
            {tr({ es: "¡Suscripción activada!", en: "Subscription activated!" })}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-content-muted">
            {tr({
              es: `Tu plan ${tr(plan.name)} ya está activo. Recibirás un comprobante por email.`,
              en: `Your ${tr(plan.name)} plan is now active. A receipt will be emailed to you.`,
            })}
          </p>
          <div className="mt-5 w-full rounded-xl border border-hairline bg-surface-2 p-4 text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="text-content-muted">{tr({ es: "Plan", en: "Plan" })}</span>
              <span className="font-bold text-content">{tr(plan.name)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-content-muted">{tr({ es: "Total cobrado", en: "Total charged" })}</span>
              <span className="font-bold text-content tabular-nums">
                ${price} <span className="text-xs font-medium text-content-muted">{cycleLabel}</span>
              </span>
            </div>
          </div>
          <Button onClick={onClose} variant="gold" fullWidth className="mt-5">
            {tr({ es: "Ir a mi membresía", en: "Go to my membership" })}
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Order summary */}
          <div className="flex items-center gap-3 rounded-xl border border-accent-500/30 bg-accent-500/[0.07] p-4">
            <span className="grid size-11 place-items-center rounded-xl bg-accent-500/15 text-gold-ink">
              <Sparkles className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-content">{tr(plan.name)}</p>
              <p className="truncate text-xs text-content-muted">{tr(plan.tagline)}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-extrabold tracking-tight text-content tabular-nums">${price}</p>
              <p className="text-[11px] text-content-muted">{cycleLabel}</p>
            </div>
          </div>

          {/* Mock card form */}
          <div className="space-y-3">
            <MockField
              label={tr({ es: "Email de facturación", en: "Billing email" })}
              placeholder="demo@airpath.app"
            />
            <MockField
              label={tr({ es: "Número de tarjeta", en: "Card number" })}
              placeholder="4242 4242 4242 4242"
              icon
              mono
            />
            <div className="grid grid-cols-2 gap-3">
              <MockField
                label={tr({ es: "Vencimiento", en: "Expiry" })}
                placeholder="12 / 28"
                mono
              />
              <MockField label="CVC" placeholder="•••" mono />
            </div>
          </div>

          <p className="flex items-start gap-2 rounded-lg bg-surface-2 px-3 py-2.5 text-[11px] leading-relaxed text-content-muted">
            <Lock className="mt-0.5 size-3.5 shrink-0 text-purple-ink" />
            {tr({
              es: "Demo: los campos de tarjeta son ficticios y no procesan datos reales. En producción, Stripe maneja los pagos con cumplimiento PCI.",
              en: "Demo: card fields are placeholders and process no real data. In production, Stripe handles payments with PCI compliance.",
            })}
          </p>

          <Button
            onClick={handlePay}
            variant="gold"
            fullWidth
            loading={step === "processing"}
            leftIcon={step === "processing" ? undefined : ShieldCheck}
          >
            {step === "processing"
              ? tr({ es: "Procesando…", en: "Processing…" })
              : tr({ es: `Pagar $${price}`, en: `Pay $${price}` })}
          </Button>
        </div>
      )}
    </Modal>
  );
}

function MockField({
  label,
  placeholder,
  icon,
  mono,
}: {
  label: string;
  placeholder: string;
  icon?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-content">{label}</label>
      <div className="relative">
        {icon && (
          <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-content-muted" />
        )}
        <input
          type="text"
          placeholder={placeholder}
          aria-label={label}
          className={cn(
            "h-11 w-full rounded-xl border border-hairline bg-surface-2 px-3.5 text-sm text-content placeholder:text-content-muted/60",
            "outline-none transition-[border-color,box-shadow] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25",
            icon && "pl-11",
            mono && "font-mono tracking-wide",
          )}
        />
      </div>
    </div>
  );
}

export function YearlySavingBadge({ monthly, yearly }: { monthly: number; yearly: number }) {
  const tr = useTr();
  if (monthly <= 0) return null;
  const fullYear = monthly * 12;
  const pct = Math.round(((fullYear - yearly) / fullYear) * 100);
  if (pct <= 0) return null;
  return (
    <Badge variant="green">{tr({ es: `Ahorrá ${pct}%`, en: `Save ${pct}%` })}</Badge>
  );
}
