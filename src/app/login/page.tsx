"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  Mail,
  Lock,
  Route,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { useI18n, useT } from "@/lib/i18n";
import { useRole } from "@/lib/role-context";
import { ROLE_ORDER, ROLES, type RoleId } from "@/lib/roles";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageToggle } from "@/components/shell/language-toggle";
import { cn } from "@/lib/cn";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const t = useT();
  const { lang } = useI18n();
  const { setRole } = useRole();

  const [mode, setMode] = useState<Mode>("signin");
  const [selectedRole, setSelectedRole] = useState<RoleId>("student");

  function enterDemo(e?: FormEvent) {
    e?.preventDefault();
    if (mode === "signup") setRole(selectedRole);
    router.push("/dashboard");
  }

  const bullets = [
    { icon: ShieldCheck, text: t.login.bullet1 },
    { icon: Route, text: t.login.bullet2 },
    { icon: Globe2, text: t.login.bullet3 },
    { icon: BadgeCheck, text: t.login.bullet4 },
  ];

  return (
    <main className="relative flex min-h-dvh flex-col lg:flex-row">
      {/* ---------- Visual panel ---------- */}
      <section className="relative flex flex-col overflow-hidden bg-gradient-to-br from-primary-700 via-[#1c0c33] to-neutral-950 px-6 py-8 text-white sm:px-10 lg:h-dvh lg:w-[53%] lg:py-12">
        <PanelDecor />
        <div className="relative z-10 flex h-full flex-col">
          <Logo size="lg" showTagline onDark />

          <div className="mt-8 flex-1 lg:mt-0 lg:flex lg:flex-col lg:justify-center">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent-300">
              <span className="size-1.5 rounded-full bg-accent-400" />
              {t.common.appName} · {t.common.company}
            </p>
            <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.7rem]">
              {t.login.panelHeadline}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
              {t.login.panelSub}
            </p>

            <ul className="mt-6 hidden space-y-3 lg:block">
              {bullets.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/8 ring-1 ring-white/10">
                    <Icon className="size-[18px] text-accent-300" />
                  </span>
                  <span className="text-sm font-medium text-white/90">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs font-medium text-white/45">
            <span className="size-2 rounded-full bg-accent-400 animate-pulse-gold" />
            {t.login.demoNote}
          </p>
        </div>
      </section>

      {/* ---------- Form panel ---------- */}
      <section className="relative flex flex-1 flex-col bg-background px-6 py-8 sm:px-10 lg:h-dvh lg:overflow-y-auto lg:py-12">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-content-muted">
            {t.toggles.language}
          </span>
          <LanguageToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-md">
            {/* mode switch */}
            <div className="inline-flex rounded-xl border border-hairline bg-surface p-1">
              {(["signin", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-lg px-4 py-1.5 text-sm font-bold transition",
                    mode === m
                      ? "bg-primary-600 text-white"
                      : "text-content-muted hover:text-content",
                  )}
                >
                  {m === "signin" ? t.common.login : t.common.register}
                </button>
              ))}
            </div>

            <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-content">
              {mode === "signin" ? t.login.welcomeBack : t.login.createAccount}
            </h2>
            <p className="mt-1 text-sm text-content-muted">
              {mode === "signin" ? t.login.signInSub : t.login.signUpSub}
            </p>

            <form className="mt-6 space-y-4" onSubmit={enterDemo}>
              {mode === "signup" && (
                <Input
                  label={t.login.name}
                  placeholder={t.login.namePlaceholder}
                  icon={UserIcon}
                  autoComplete="name"
                />
              )}
              <Input
                label={t.login.email}
                type="email"
                placeholder={t.login.emailPlaceholder}
                icon={Mail}
                autoComplete="email"
              />
              <Input
                label={t.login.password}
                type="password"
                placeholder={t.login.passwordPlaceholder}
                icon={Lock}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />

              {mode === "signup" && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-content">{t.login.role}</span>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_ORDER.map((id) => {
                      const Icon = ROLES[id].icon;
                      const active = id === selectedRole;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedRole(id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition",
                            active
                              ? "border-primary-500/60 bg-primary-600/15 text-primary-200"
                              : "border-hairline bg-surface text-content-muted hover:text-content",
                          )}
                        >
                          <Icon className="size-3.5" />
                          {t.roles[id].name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mode === "signin" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs font-semibold text-purple-ink transition hover:text-primary-500"
                  >
                    {t.login.forgot}
                  </button>
                </div>
              )}

              <Button type="submit" size="lg" fullWidth rightIcon={ArrowRight}>
                {mode === "signin" ? t.login.signIn : t.login.signUp}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-hairline" />
              <span className="text-xs font-medium uppercase text-content-muted">{t.login.or}</span>
              <span className="h-px flex-1 bg-hairline" />
            </div>

            <Button type="button" variant="outline" size="lg" fullWidth onClick={() => enterDemo()}>
              <GoogleGlyph />
              {t.login.google}
            </Button>

            <p className="mt-6 text-center text-sm text-content-muted">
              {mode === "signin" ? t.login.noAccount : t.login.haveAccount}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="font-bold text-purple-ink transition hover:text-primary-500"
              >
                {mode === "signin" ? t.common.register : t.common.login}
              </button>
            </p>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-content-muted/80">
              {t.login.terms}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function PanelDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.12]" />
      <div className="absolute -left-24 -top-24 size-80 glow-purple opacity-50" />
      <div className="absolute -bottom-28 -right-20 size-80 glow-gold opacity-25" />
      <svg
        viewBox="0 0 480 480"
        className="absolute -right-10 bottom-0 h-[420px] w-[420px] opacity-[0.5]"
        fill="none"
      >
        <circle cx="360" cy="370" r="60" stroke="white" strokeOpacity="0.10" />
        <circle cx="360" cy="370" r="110" stroke="white" strokeOpacity="0.08" />
        <circle cx="360" cy="370" r="170" stroke="white" strokeOpacity="0.06" />
        <path
          d="M30 440 Q 210 380 450 70"
          stroke="url(#routeGrad)"
          strokeWidth="2"
          strokeDasharray="2 8"
          strokeLinecap="round"
        />
        <circle cx="30" cy="440" r="5" fill="#c9a23c" />
        <circle cx="225" cy="356" r="3.5" fill="#d8b4fe" />
        <g transform="translate(450 70) rotate(-44)">
          <path d="M0 -11 L8 9 L0 3 L-8 9 Z" fill="#f5d78e" />
        </g>
        <defs>
          <linearGradient id="routeGrad" x1="30" y1="440" x2="450" y2="70">
            <stop stopColor="#c084fc" />
            <stop offset="1" stopColor="#f5d78e" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
