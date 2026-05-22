"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { useI18n, useT } from "@/lib/i18n";
import { NAV_ITEMS, type NavItem } from "@/lib/roles";
import { getDemoUser } from "@/data/mock";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

function isRoute(item: NavItem): item is NavItem & { href: string } {
  return Boolean(item.href);
}

export default function DashboardPage() {
  const { roleId, role } = useRole();
  const { lang } = useI18n();
  const t = useT();
  const user = getDemoUser(roleId);

  const items = role.nav
    .map((k) => NAV_ITEMS[k])
    .filter(isRoute)
    .filter((i) => i.key !== "dashboard");

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-2xl border border-hairline bg-gradient-to-br from-primary-700/35 via-surface to-surface p-6 sm:p-8">
        <div className="absolute -right-16 -top-24 size-72 glow-purple opacity-40" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar initials={user.initials} accent={role.accent} size="xl" ring />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-content-muted">{t.home.hello},</p>
            <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight sm:text-3xl">{user.name}</h1>
            <p className="mt-1 text-sm text-content-muted">{user.headline[lang]}</p>
          </div>
          {user.points > 0 && (
            <div className="flex items-center gap-2.5 self-start rounded-xl border border-accent-500/30 bg-accent-500/10 px-4 py-3">
              <Star className="size-5 text-accent-400" fill="currentColor" />
              <div>
                <p className="text-lg font-extrabold leading-none text-content">
                  {user.points.toLocaleString("es")}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gold-ink">
                  {t.common.points}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-extrabold tracking-tight text-content">{t.home.quickAccess}</h2>
        <p className="text-sm text-content-muted">{t.home.quickAccessSub}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.key} href={item.href} className="h-full">
                <Card interactive className="flex h-full items-center gap-3.5 p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-600/15 text-purple-ink">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-content">{t.nav[item.labelKey]}</p>
                    <p className="text-xs text-content-muted">{t.home.explore}</p>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-content-muted" />
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <Card className="flex items-start gap-3 border-accent-500/25 bg-accent-500/[0.06] p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-500/15 text-gold-ink">
          <Sparkles className="size-4" />
        </span>
        <div>
          <p className="text-sm font-bold text-content">{t.home.previewTitle}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-content-muted">{t.home.previewNote}</p>
        </div>
      </Card>
    </div>
  );
}
