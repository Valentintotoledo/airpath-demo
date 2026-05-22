"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Clock,
  GraduationCap,
  Hash,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { CERTIFICATES, VERIFY_SAMPLE_CODE, type EarnedCertificate } from "@/data/platform";
import { useI18n, useTr } from "@/lib/i18n";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageToggle } from "@/components/shell/language-toggle";
import {
  CertificateSeal,
  findCertificateByCode,
  formatIssueDate,
} from "@/components/certificates/diploma";

type Result = { state: "authentic"; cert: EarnedCertificate } | { state: "not_found" };

export default function VerifyPage() {
  const tr = useTr();
  const { lang } = useI18n();
  const [code, setCode] = useState(VERIFY_SAMPLE_CODE);
  const [result, setResult] = useState<Result | null>(null);

  function verify(e?: FormEvent) {
    e?.preventDefault();
    const cert = findCertificateByCode(CERTIFICATES, code);
    setResult(cert ? { state: "authentic", cert } : { state: "not_found" });
  }

  function reset() {
    setResult(null);
    setCode("");
  }

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-content">
      {/* ---------- Ambient decoration ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.1]" />
        <div className="absolute -left-32 -top-40 size-[26rem] glow-purple opacity-40" />
        <div className="absolute -right-28 top-1/3 size-[24rem] glow-gold opacity-25" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />
      </div>

      {/* ---------- Top bar ---------- */}
      <header className="relative z-10 border-b border-hairline bg-surface/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
          <Link href="/" aria-label="AirPath" className="transition hover:opacity-90">
            <Logo size="md" />
          </Link>
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="hidden items-center gap-1.5 text-sm font-semibold text-content-muted transition hover:text-content sm:inline-flex"
            >
              <ArrowLeft className="size-4" />
              {tr({ es: "Volver al inicio", en: "Back to home" })}
            </Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* ---------- Content ---------- */}
      <section className="relative z-10 flex flex-1 flex-col items-center px-5 py-12 sm:px-8 sm:py-16">
        <div className="w-full max-w-xl">
          {/* heading */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-ink">
              <ShieldCheck className="size-3.5" />
              {tr({ es: "Verificación oficial", en: "Official verification" })}
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {tr({
                es: "Verificación pública de certificados",
                en: "Public certificate verification",
              })}
            </h1>
            <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-content-muted">
              {tr({
                es: "Cualquier escuela, empleador o tercero puede confirmar en segundos que un certificado emitido por AirPath Academy es auténtico y vigente.",
                en: "Any school, employer or third party can confirm in seconds that a certificate issued by AirPath Academy is authentic and valid.",
              })}
            </p>
          </div>

          {/* verify card */}
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-hairline bg-surface/90 p-5 shadow-[0_24px_60px_-30px_rgba(124,58,237,0.55)] backdrop-blur sm:p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-20 size-52 glow-purple opacity-25"
            />
            <form onSubmit={verify} className="relative space-y-4">
              <Input
                label={tr({ es: "Código de verificación", en: "Verification code" })}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onInput={() => result && setResult(null)}
                placeholder="APX-XXX-XXXXX"
                icon={Hash}
                autoComplete="off"
                spellCheck={false}
                className="font-mono uppercase tracking-[0.12em]"
                hint={tr({
                  es: `Probá con: ${VERIFY_SAMPLE_CODE}`,
                  en: `Try with: ${VERIFY_SAMPLE_CODE}`,
                })}
              />
              <div className="flex gap-2.5">
                <Button type="submit" size="lg" fullWidth leftIcon={Search}>
                  {tr({ es: "Verificar", en: "Verify" })}
                </Button>
                {result && (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={reset}
                    leftIcon={RotateCcw}
                    className="shrink-0"
                  >
                    <span className="hidden sm:inline">
                      {tr({ es: "Limpiar", en: "Clear" })}
                    </span>
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* result */}
          {result?.state === "authentic" && (
            <AuthenticCard cert={result.cert} lang={lang} tr={tr} />
          )}
          {result?.state === "not_found" && (
            <NotFoundCard code={code} tr={tr} onRetry={() => setCode(VERIFY_SAMPLE_CODE)} />
          )}

          {/* trust strip — only before a search */}
          {!result && (
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Hash,
                  title: tr({ es: "Código único", en: "Unique code" }),
                  body: tr({
                    es: "Cada certificado lleva un identificador irrepetible.",
                    en: "Every certificate carries an unrepeatable identifier.",
                  }),
                },
                {
                  icon: ShieldCheck,
                  title: tr({ es: "FAA Part 141", en: "FAA Part 141" }),
                  body: tr({
                    es: "Programas bajo un currículo acreditado.",
                    en: "Programs under an accredited curriculum.",
                  }),
                },
                {
                  icon: Sparkles,
                  title: tr({ es: "Validación instantánea", en: "Instant validation" }),
                  body: tr({
                    es: "Resultado confiable sin contactar a la academia.",
                    en: "Reliable result without contacting the academy.",
                  }),
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-xl border border-hairline bg-surface/70 p-4 backdrop-blur"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-primary-600/15 text-purple-ink">
                    <Icon className="size-[18px]" />
                  </span>
                  <p className="mt-2.5 text-sm font-bold text-content">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-content-muted">{body}</p>
                </div>
              ))}
            </div>
          )}

          {/* mobile back link */}
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-content-muted transition hover:text-content sm:hidden"
          >
            <ArrowLeft className="size-4" />
            {tr({ es: "Volver al inicio", en: "Back to home" })}
          </Link>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="relative z-10 border-t border-hairline bg-surface/70 py-5 backdrop-blur">
        <p className="text-center text-xs font-semibold tracking-wide text-content-muted">
          AirPath · {tr({ es: "Una empresa CG", en: "A CG Company" })}
        </p>
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Authentic result                                                   */
/* ------------------------------------------------------------------ */

type Tr = ReturnType<typeof useTr>;

function AuthenticCard({
  cert,
  lang,
  tr,
}: {
  cert: EarnedCertificate;
  lang: "es" | "en";
  tr: Tr;
}) {
  const issued = formatIssueDate(cert.issueDate, lang);
  const rows = [
    { icon: UserIcon, label: tr({ es: "Titular", en: "Holder" }), value: cert.holder },
    { icon: GraduationCap, label: tr({ es: "Programa", en: "Program" }), value: tr(cert.course) },
    {
      icon: Clock,
      label: tr({ es: "Horas acreditadas", en: "Accredited hours" }),
      value: tr({ es: `${cert.hours} horas`, en: `${cert.hours} hours` }),
    },
    { icon: CalendarDays, label: tr({ es: "Fecha de emisión", en: "Issue date" }), value: issued },
    { icon: Hash, label: tr({ es: "Código", en: "Code" }), value: cert.code, mono: true },
  ];

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-success-500/40 bg-gradient-to-br from-success-500/[0.1] via-surface to-surface shadow-[0_24px_60px_-28px_rgba(34,197,94,0.5)]">
      {/* banner */}
      <div className="relative flex items-center gap-3.5 border-b border-success-500/25 bg-success-500/[0.08] px-5 py-4 sm:px-6">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-success-500/20 text-success-400 ring-1 ring-success-500/40">
          <BadgeCheck className="size-7" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-success-400">
            {tr({ es: "Resultado de verificación", en: "Verification result" })}
          </p>
          <p className="mt-0.5 text-lg font-extrabold tracking-tight text-content sm:text-xl">
            {tr({ es: "Certificado auténtico", en: "Authentic certificate" })}
          </p>
        </div>
        <CertificateSeal className="ml-auto hidden size-12 shrink-0 sm:grid" />
      </div>

      {/* details */}
      <div className="p-5 sm:p-6">
        <dl className="divide-y divide-hairline">
          {rows.map(({ icon: Icon, label, value, mono }) => (
            <div key={label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-content-muted">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <dt className="text-[11px] font-bold uppercase tracking-wide text-content-muted">
                  {label}
                </dt>
                <dd
                  className={
                    mono
                      ? "mt-0.5 break-all font-mono text-sm font-bold tracking-[0.1em] text-content"
                      : "mt-0.5 text-sm font-bold text-content"
                  }
                >
                  {value}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-accent-500/30 bg-accent-500/[0.08] px-3.5 py-2.5">
          <ShieldCheck className="size-4 shrink-0 text-gold-ink" />
          <p className="text-xs font-semibold text-content">
            {tr({
              es: "Emitido por AirPath Academy · FAA Part 141",
              en: "Issued by AirPath Academy · FAA Part 141",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Not-found result                                                   */
/* ------------------------------------------------------------------ */

function NotFoundCard({
  code,
  tr,
  onRetry,
}: {
  code: string;
  tr: Tr;
  onRetry: () => void;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-danger-500/40 bg-gradient-to-br from-danger-500/[0.1] via-surface to-surface shadow-[0_24px_60px_-30px_rgba(239,68,68,0.45)]">
      <div className="flex items-center gap-3.5 border-b border-danger-500/25 bg-danger-500/[0.08] px-5 py-4 sm:px-6">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-danger-500/20 text-danger-400 ring-1 ring-danger-500/40">
          <ShieldAlert className="size-7" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-danger-400">
            {tr({ es: "Resultado de verificación", en: "Verification result" })}
          </p>
          <p className="mt-0.5 text-lg font-extrabold tracking-tight text-content sm:text-xl">
            {tr({
              es: "No encontramos un certificado con ese código",
              en: "No certificate found with that code",
            })}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {code.trim() && (
          <p className="mb-3 text-sm text-content-muted">
            {tr({ es: "Código ingresado:", en: "Code entered:" })}{" "}
            <span className="break-all font-mono font-bold text-content">
              {code.trim().toUpperCase()}
            </span>
          </p>
        )}
        <p className="text-sm leading-relaxed text-content-muted">
          {tr({
            es: "Revisá que el código esté completo y sin espacios. Los códigos de AirPath tienen el formato APX-XXX-XXXXX. Si el problema persiste, contactá a la academia emisora.",
            en: "Check that the code is complete and has no spaces. AirPath codes follow the format APX-XXX-XXXXX. If the issue persists, contact the issuing academy.",
          })}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={RotateCcw}
          className="mt-4"
        >
          {tr({ es: "Probar con el código de ejemplo", en: "Try the sample code" })}
        </Button>
      </div>
    </div>
  );
}
