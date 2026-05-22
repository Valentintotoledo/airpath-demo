"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type TabItem = {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
};

type TabsProps = {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
};

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "no-scrollbar flex gap-1 overflow-x-auto rounded-xl border border-hairline bg-surface p-1",
        className,
      )}
    >
      {tabs.map((tab) => {
        const on = tab.id === active;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition",
              on ? "bg-primary-600 text-white shadow" : "text-content-muted hover:text-content",
            )}
          >
            {Icon && <Icon className="size-4" />}
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] font-bold tabular-nums",
                  on ? "bg-white/20 text-white" : "bg-surface-2 text-content-muted",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
