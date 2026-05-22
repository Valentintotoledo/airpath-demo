"use client";

import {
  Award,
  BadgeCheck,
  PlaneTakeoff,
  ShieldCheck,
} from "lucide-react";
import type { EarnedCertificate } from "@/data/platform";
import { useTr } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/*  Shared helpers for the certificates + public verification pages.    */
/* ------------------------------------------------------------------ */

/** Case-insensitive, trimmed lookup of a certificate by its public code. */
export function findCertificateByCode<T extends { code: string }>(
  list: readonly T[],
  raw: string,
): T | undefined {
  const needle = raw.trim().toUpperCase();
  if (!needle) return undefined;
  return list.find((c) => c.code.toUpperCase() === needle);
}

/** Format an ISO date (YYYY-MM-DD) into a readable localized string. */
export function formatIssueDate(iso: string, lang: "es" | "en"): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/* ---------------- Decorative flight-path corner ---------------- */

function FlightPathDecor({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 320"
      fill="none"
      className={cn("pointer-events-none absolute opacity-[0.5]", className)}
    >
      <circle cx="250" cy="70" r="44" stroke="currentColor" strokeOpacity="0.16" />
      <circle cx="250" cy="70" r="80" stroke="currentColor" strokeOpacity="0.1" />
      <circle cx="250" cy="70" r="120" stroke="currentColor" strokeOpacity="0.06" />
      <path
        d="M10 300 Q 150 250 290 30"
        stroke="url(#diplomaRoute)"
        strokeWidth="2"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      <circle cx="10" cy="300" r="4" fill="#c9a23c" />
      <g transform="translate(290 30) rotate(-46)">
        <path d="M0 -9 L7 8 L0 2.5 L-7 8 Z" fill="#f5d78e" />
      </g>
      <defs>
        <linearGradient id="diplomaRoute" x1="10" y1="300" x2="290" y2="30">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#f5d78e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ---------------- Decorative gold medallion / seal ---------------- */

export function CertificateSeal({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid place-items-center rounded-full bg-gradient-to-br from-accent-300 via-accent-500 to-accent-700 text-neutral-950 shadow-[0_8px_28px_-8px_rgba(201,162,60,0.7)]",
        className,
      )}
    >
      <span className="absolute inset-[3px] rounded-full border border-neutral-950/25" />
      <span className="absolute inset-[7px] rounded-full border border-dashed border-neutral-950/30" />
      <Award className="relative size-1/2" strokeWidth={2.25} />
    </span>
  );
}

/* ---------------- Full diploma (used inside the modal) ---------------- */

export function CertificateDiploma({ cert }: { cert: EarnedCertificate }) {
  const tr = useTr();
  const issued = formatIssueDate(cert.issueDate, tr({ es: "es", en: "en" }));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent-500/40 bg-gradient-to-br from-[#15101f] via-surface to-[#120e1c] p-1.5 text-content shadow-[0_24px_60px_-24px_rgba(201,162,60,0.4)]">
      {/* gold inner frame */}
      <div className="relative overflow-hidden rounded-xl border border-accent-500/45 px-6 py-8 sm:px-9 sm:py-10">
        {/* glows + decoration */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-[0.07]" />
          <div className="absolute -left-20 -top-24 size-64 glow-purple opacity-30" />
          <div className="absolute -bottom-24 -right-16 size-64 glow-gold opacity-30" />
        </div>
        <FlightPathDecor className="-right-12 -top-12 size-56 text-accent-300" />

        <div className="relative flex flex-col items-center text-center">
          {/* brand */}
          <div className="flex items-center gap-2.5">
            <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800 text-white shadow-lg shadow-primary-700/30">
              <PlaneTakeoff className="size-6" strokeWidth={2.25} />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-accent-400 ring-2 ring-[var(--surface)]" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-content">
              Air<span className="text-gradient-gold">Path</span>
            </span>
          </div>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.32em] text-gold-ink">
            {tr({ es: "Academia de Aviación", en: "Aviation Academy" })}
          </p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-content sm:text-3xl">
            {tr({ es: "Certificado de Finalización", en: "Certificate of Completion" })}
          </h3>

          {/* gold divider */}
          <div className="mt-4 flex w-full items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent-500/60" />
            <Award className="size-4 text-gold-ink" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-500/60" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-content-muted">
            {tr({ es: "Se otorga el presente certificado a", en: "This certificate is awarded to" })}
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-content sm:text-[1.7rem]">
            {cert.holder}
          </p>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-content-muted">
            {tr({
              es: "por haber completado satisfactoriamente el programa de formación",
              en: "for successfully completing the training program",
            })}
          </p>
          <p className="mt-1.5 text-base font-bold text-purple-ink">{tr(cert.course)}</p>

          {/* meta row */}
          <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-2.5">
            <DiplomaMeta
              label={tr({ es: "Horas", en: "Hours" })}
              value={`${cert.hours} h`}
            />
            <DiplomaMeta
              label={tr({ es: "Emisión", en: "Issued" })}
              value={issued}
            />
            <DiplomaMeta
              label={tr({ es: "Estado", en: "Status" })}
              value={tr({ es: "Vigente", en: "Valid" })}
              accent
            />
          </div>

          {/* verification code */}
          <div className="mt-5 w-full max-w-md rounded-xl border border-accent-500/40 bg-accent-500/[0.08] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-ink">
              {tr({ es: "Código de verificación", en: "Verification code" })}
            </p>
            <p className="mt-1 font-mono text-lg font-bold tracking-[0.14em] text-content">
              {cert.code}
            </p>
          </div>

          {/* FAA accreditation line */}
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-content-muted">
            {tr({
              es: "Programa acreditado bajo FAA Part 141",
              en: "Program accredited under FAA Part 141",
            })}
          </p>

          {/* signature + seal */}
          <div className="mt-6 flex w-full max-w-md items-end justify-between gap-4">
            <div className="flex flex-1 flex-col items-center">
              <span className="font-[cursive] text-xl text-content">Andrés Morales</span>
              <span className="mt-1 h-px w-full bg-content-muted/40" />
              <span className="mt-1.5 text-[11px] font-bold text-content">
                Cap. Andrés Morales
              </span>
              <span className="text-[10px] text-content-muted">
                {tr({ es: "Instructor certificado FAA", en: "FAA Certified Instructor" })}
              </span>
            </div>
            <CertificateSeal className="size-16 shrink-0" />
          </div>

          <p className="mt-6 flex items-center gap-1.5 text-[11px] font-semibold text-content-muted">
            <ShieldCheck className="size-3.5 text-success-500" />
            {tr({
              es: "Verificable públicamente en airpath.app/verify",
              en: "Publicly verifiable at airpath.app/verify",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function DiplomaMeta({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-2/80 px-2.5 py-2.5 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wide text-content-muted">{label}</p>
      <p
        className={cn(
          "mt-0.5 text-[13px] font-extrabold leading-tight",
          accent ? "text-success-500" : "text-content",
        )}
      >
        {value}
      </p>
    </div>
  );
}

/* ---------------- Mini-diploma card (grid item) ---------------- */

export function CertificateCard({
  cert,
  onOpen,
}: {
  cert: EarnedCertificate;
  onOpen: () => void;
}) {
  const tr = useTr();

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative overflow-hidden rounded-2xl border border-accent-500/35 bg-gradient-to-br from-accent-500/[0.07] via-surface to-surface p-1 text-left transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:border-accent-500/60 hover:shadow-[0_20px_44px_-20px_rgba(201,162,60,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500"
    >
      <div className="relative overflow-hidden rounded-xl border border-accent-500/30 p-5">
        <FlightPathDecor className="-right-10 -top-10 size-40 text-accent-300" />
        <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-10 size-40 glow-gold opacity-25" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800 text-white shadow-md shadow-primary-700/30">
                <PlaneTakeoff className="size-[18px]" strokeWidth={2.25} />
              </span>
              <span className="text-sm font-extrabold tracking-tight text-content">
                Air<span className="text-gradient-gold">Path</span>
              </span>
            </div>
            <CertificateSeal className="size-10" />
          </div>

          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-ink">
            {tr({ es: "Certificado de Finalización", en: "Certificate of Completion" })}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-[15px] font-extrabold leading-tight tracking-tight text-content">
            {tr(cert.course)}
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <span className="h-px flex-1 bg-accent-500/30" />
            <Award className="size-3.5 text-gold-ink" />
            <span className="h-px flex-1 bg-accent-500/30" />
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            <div>
              <dt className="font-bold uppercase tracking-wide text-content-muted">
                {tr({ es: "Titular", en: "Holder" })}
              </dt>
              <dd className="mt-0.5 truncate font-bold text-content">{cert.holder}</dd>
            </div>
            <div>
              <dt className="font-bold uppercase tracking-wide text-content-muted">
                {tr({ es: "Horas", en: "Hours" })}
              </dt>
              <dd className="mt-0.5 font-bold text-content">{cert.hours} h</dd>
            </div>
            <div>
              <dt className="font-bold uppercase tracking-wide text-content-muted">
                {tr({ es: "Emisión", en: "Issued" })}
              </dt>
              <dd className="mt-0.5 font-bold text-content">{cert.issueDate}</dd>
            </div>
            <div>
              <dt className="font-bold uppercase tracking-wide text-content-muted">
                {tr({ es: "Código", en: "Code" })}
              </dt>
              <dd className="mt-0.5 truncate font-mono font-bold text-content">{cert.code}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success-500/30 bg-success-500/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-success-400">
              <BadgeCheck className="size-3.5" />
              {tr({ es: "Válido", en: "Valid" })}
            </span>
            <span className="text-[11px] font-bold text-purple-ink transition group-hover:opacity-80">
              {tr({ es: "Ver certificado", en: "View certificate" })}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
