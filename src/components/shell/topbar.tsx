"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useUI } from "@/lib/ui-context";
import { NAV_ITEMS } from "@/lib/roles";
import { Logo } from "@/components/brand/logo";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import { RoleSwitcher } from "./role-switcher";
import { DemoCta } from "./demo-cta";

export function Topbar() {
  const pathname = usePathname();
  const t = useT();
  const { startTour } = useUI();

  const item = Object.values(NAV_ITEMS).find(
    (i) => i.href && (pathname === i.href || pathname.startsWith(`${i.href}/`)),
  );
  const title = item ? t.nav[item.labelKey] : t.common.appName;
  const Icon = item?.icon;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-hairline bg-background/80 px-4 backdrop-blur-md lg:px-8">
      <Link href="/dashboard" aria-label="AirPath" className="lg:hidden">
        <Logo size="sm" showWordmark={false} />
      </Link>

      <div className="hidden items-center gap-2.5 lg:flex">
        {Icon && (
          <span className="grid size-9 place-items-center rounded-xl border border-hairline bg-surface text-purple-ink">
            <Icon className="size-[18px]" />
          </span>
        )}
        <h1 className="text-lg font-extrabold tracking-tight text-content">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <DemoCta variant="pill" className="lg:hidden" />
        <button
          type="button"
          onClick={startTour}
          className="hidden h-10 items-center gap-1.5 rounded-xl border border-hairline bg-surface px-3 text-sm font-semibold text-content-muted transition hover:border-primary-500/45 hover:text-content sm:inline-flex"
        >
          <Compass className="size-4" />
          <span className="hidden lg:inline">Tour</span>
        </button>
        <LanguageToggle />
        <ThemeToggle />
        <RoleSwitcher />
      </div>
    </header>
  );
}
