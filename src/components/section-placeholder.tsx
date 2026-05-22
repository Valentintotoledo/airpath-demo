"use client";

import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";
import { useT } from "@/lib/i18n";
import { NAV_ITEMS } from "@/lib/roles";
import { Badge } from "@/components/ui/badge";

export function SectionPlaceholder() {
  const pathname = usePathname();
  const t = useT();

  const item = Object.values(NAV_ITEMS).find(
    (i) => i.href && (pathname === i.href || pathname.startsWith(`${i.href}/`)),
  );
  const Icon = item?.icon ?? Compass;
  const title = item ? t.nav[item.labelKey] : t.common.appName;

  return (
    <div className="flex min-h-[58vh] flex-col items-center justify-center text-center">
      <div className="relative grid size-20 place-items-center rounded-2xl border border-primary-500/30 bg-gradient-to-br from-primary-500/20 to-primary-800/15">
        <Icon className="size-9 text-purple-ink" />
        <span className="absolute -right-1.5 -top-1.5 size-3 rounded-full bg-accent-400 animate-pulse-gold" />
      </div>
      <Badge variant="gold" className="mt-5">
        {t.common.demoBadge}
      </Badge>
      <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-content">{title}</h2>
      <p className="mt-1 text-sm font-semibold text-content-muted">{t.section.soonTitle}</p>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-content-muted">{t.section.soonText}</p>
    </div>
  );
}
