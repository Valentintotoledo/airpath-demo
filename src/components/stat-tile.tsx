import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { toneIcon, type Accent } from "@/lib/tone";

type StatTileProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  delta?: number;
  tone?: Accent;
  className?: string;
};

export function StatTile({ icon: Icon, label, value, hint, delta, tone = "purple", className }: StatTileProps) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className={cn("rounded-2xl border border-hairline bg-surface p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className={cn("grid size-9 place-items-center rounded-lg", toneIcon[tone])}>
          <Icon className="size-[18px]" />
        </span>
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-bold",
              up ? "text-success-500" : "text-danger-400",
            )}
          >
            {up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-content">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-content-muted">{label}</p>
      {hint && <p className="mt-1 text-[11px] text-content-muted/80">{hint}</p>}
    </div>
  );
}
