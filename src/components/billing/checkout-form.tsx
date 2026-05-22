"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, CreditCard, Lock, Plane, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTr } from "@/lib/i18n";

type CheckoutFormProps = {
  /** Headline product name shown in the order summary. */
  productName: string;
  /** Sub-label under the product name (e.g. billing cadence). */
  productHint: string;
  /** Amount to charge, already formatted as a number. */
  amount: number;
  /** Currency code label, e.g. "USD". */
  currency?: string;
  /** Called when the user closes after success. */
  onDone: () => void;
};

/**
 * A clearly-mock Stripe-style checkout form. Never collects real card data —
 * the card field is pre-filled with the public Stripe test number.
 */
export function CheckoutForm({
  productName,
  productHint,
  amount,
  currency = "USD",
  onDone,
}: CheckoutFormProps) {
  const tr = useTr();
  const [stage, setStage] = useState<"form" | "processing" | "success">("form");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12 / 28");
  const [cvc, setCvc] = useState("123");

  const pay = () => {
    setStage("processing");
    window.setTimeout(() => setStage("success"), 1400);
  };

  if (stage === "success") {
    return (
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
          {tr({ es: "¡Suscripción activada!", en: "Subscription activated!" })}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-content-muted">
          {tr({
            es: `Tu plan ${productName} ya está activo. El recibo se envió a tu correo.`,
            en: `Your ${productName} plan is now active. The receipt was sent to your email.`,
          })}
        </p>
        <Button className="mt-5" fullWidth onClick={onDone}>
          {tr({ es: "Listo", en: "Done" })}
        </Button>
      </div>
    );
  }

  const processing = stage === "processing";

  return (
    <div className="space-y-5">
      {/* AirPath branding */}
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl bg-primary-600 text-white">
          <Plane className="size-5" />
        </span>
        <div>
          <p className="text-sm font-extrabold tracking-tight text-content">AirPath</p>
          <p className="text-[11px] font-medium text-content-muted">
            {tr({ es: "Pago seguro · procesado por Stripe", en: "Secure payment · processed by Stripe" })}
          </p>
        </div>
      </div>

      {/* Demo notice */}
      <div className="flex items-start gap-2 rounded-xl border border-accent-500/30 bg-accent-500/10 p-3">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold-ink" />
        <p className="text-xs font-medium text-content-muted">
          {tr({
            es: "Checkout de demostración. No ingreses datos reales — la tarjeta de prueba ya está cargada.",
            en: "Demo checkout. Do not enter real data — the test card is already filled in.",
          })}
        </p>
      </div>

      {/* Order summary */}
      <div className="rounded-xl border border-hairline bg-surface-2 p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-content">{productName}</p>
            <p className="text-xs text-content-muted">{productHint}</p>
          </div>
          <p className="text-lg font-extrabold tracking-tight text-content">
            ${amount.toLocaleString("es")}{" "}
            <span className="text-xs font-bold text-content-muted">{currency}</span>
          </p>
        </div>
      </div>

      {/* Card fields */}
      <div className="space-y-3">
        <Input
          label={tr({ es: "Número de tarjeta", en: "Card number" })}
          icon={CreditCard}
          value={card}
          onChange={(e) => setCard(e.target.value)}
          placeholder="4242 4242 4242 4242"
          inputMode="numeric"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={tr({ es: "Vencimiento", en: "Expiry" })}
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="MM / YY"
          />
          <Input
            label="CVC"
            icon={Lock}
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            placeholder="123"
            inputMode="numeric"
          />
        </div>
      </div>

      <Button fullWidth size="lg" leftIcon={Lock} loading={processing} onClick={pay}>
        {processing
          ? tr({ es: "Procesando…", en: "Processing…" })
          : tr({ es: `Pagar $${amount.toLocaleString("es")}`, en: `Pay $${amount.toLocaleString("es")}` })}
      </Button>

      <p className="text-center text-[11px] text-content-muted">
        {tr({
          es: "Multi-moneda: USD nativo, listo para EUR, COP y BRL.",
          en: "Multi-currency: native USD, ready for EUR, COP and BRL.",
        })}
      </p>
    </div>
  );
}
