import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const VARIANTS = {
  neutral: "bg-surface-2 text-content-muted border border-hairline",
  purple: "bg-primary-500/15 text-purple-ink border border-primary-500/30",
  gold: "bg-accent-500/15 text-gold-ink border border-accent-500/35",
  green: "bg-success-500/15 text-success-400 border border-success-500/30",
  danger: "bg-danger-500/15 text-danger-400 border border-danger-500/30",
  sky: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
  warning: "bg-warning-500/15 text-warning-500 border border-warning-500/30",
  solidGold: "bg-accent-500 text-neutral-950 border border-accent-400",
  solidPurple: "bg-primary-600 text-white border border-primary-500",
} as const;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof VARIANTS;
  dot?: boolean;
  pulse?: boolean;
};

export function Badge({ className, variant = "neutral", dot, pulse, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full bg-current",
            pulse && "animate-pulse-gold",
          )}
        />
      )}
      {children}
    </span>
  );
}
