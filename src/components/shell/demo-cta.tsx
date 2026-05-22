"use client";

import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export const WHATSAPP_CTA_URL =
  "https://wa.me/5491139375146?text=Me%20encant%C3%B3%20el%20desarrollo%2C%20quiero%20que%20avancemos!";

export function DemoCta({
  variant = "card",
  className,
}: {
  variant?: "card" | "pill";
  className?: string;
}) {
  const t = useT();

  if (variant === "pill") {
    return (
      <a
        href={WHATSAPP_CTA_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={t.demoCta.title}
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-xl border border-accent-500/35 bg-accent-500/12 px-2.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-gold-ink transition hover:bg-accent-500/20",
          className,
        )}
      >
        <span className="size-2 rounded-full bg-accent-400 animate-pulse-gold" />
        Demo
      </a>
    );
  }

  return (
    <a
      href={WHATSAPP_CTA_URL}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group block rounded-2xl border border-accent-500/30 bg-accent-500/10 p-3.5 transition hover:border-accent-500/55 hover:bg-accent-500/16",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-accent-400 animate-pulse-gold" />
        <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold-ink">
          {t.demoCta.badge}
        </span>
      </span>
      <p className="mt-2 text-sm font-bold text-content">{t.demoCta.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-content-muted">{t.demoCta.text}</p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gold-ink">
        {t.demoCta.button}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}
