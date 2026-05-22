"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { useT } from "@/lib/i18n";
import { NAV_ITEMS, type NavItem } from "@/lib/roles";
import { cn } from "@/lib/cn";

function isRoute(item: NavItem): item is NavItem & { href: string } {
  return Boolean(item.href);
}

export function BottomNav() {
  const { role } = useRole();
  const t = useT();
  const pathname = usePathname();
  const items = role.nav.map((k) => NAV_ITEMS[k]).filter(isRoute).slice(0, 5);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface/95 backdrop-blur lg:hidden">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              data-tour={`nav-${item.key}`}
              className={cn(
                "flex h-[60px] flex-col items-center justify-center gap-1 px-1 transition",
                active ? "text-purple-ink" : "text-content-muted",
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-12 place-items-center rounded-full transition",
                  active && "bg-primary-600/15",
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <span className="max-w-full truncate text-[10px] font-semibold leading-none">
                {t.nav[item.labelKey]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
