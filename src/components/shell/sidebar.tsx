"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { useT } from "@/lib/i18n";
import { NAV_ITEMS, type NavItem } from "@/lib/roles";
import { getDemoUser } from "@/data/mock";
import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { DemoCta } from "./demo-cta";
import { cn } from "@/lib/cn";

function isRoute(item: NavItem): item is NavItem & { href: string } {
  return Boolean(item.href);
}

export function Sidebar() {
  const { roleId, role } = useRole();
  const t = useT();
  const pathname = usePathname();
  const user = getDemoUser(roleId);
  const items = role.nav.map((k) => NAV_ITEMS[k]).filter(isRoute);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-hairline bg-surface lg:flex">
      <div className="px-5 py-5">
        <Link href="/dashboard" aria-label="AirPath">
          <Logo size="md" showTagline />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
                active
                  ? "bg-primary-600/15 text-purple-ink"
                  : "text-content-muted hover:bg-surface-2 hover:text-content",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary-500" />
              )}
              <Icon className={cn("size-[18px]", active && "text-purple-ink")} />
              {t.nav[item.labelKey]}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 p-3">
        <DemoCta />
        <div className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
          <Avatar initials={user.initials} accent={role.accent} size="md" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-sm font-bold text-content">
              {user.name}
              {user.verified && <BadgeCheck className="size-3.5 shrink-0 text-accent-400" />}
            </p>
            <p className="truncate text-xs text-content-muted">{t.roles[roleId].name}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
