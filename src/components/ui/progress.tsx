import { cn } from "@/lib/cn";

const TONES = {
  purple: "linear-gradient(90deg, var(--color-primary-700), var(--color-primary-400))",
  gold: "linear-gradient(90deg, var(--color-accent-600), var(--color-accent-400))",
  green: "linear-gradient(90deg, var(--color-success-600), var(--color-success-400))",
  sky: "linear-gradient(90deg, var(--color-sky-500), var(--color-sky-400))",
} as const;

type ProgressProps = {
  value: number;
  max?: number;
  tone?: keyof typeof TONES;
  className?: string;
  /** Bar thickness, defaults to 0.5rem. */
  size?: "sm" | "md" | "lg";
};

export function Progress({ value, max = 100, tone = "purple", className, size = "md" }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const height = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  return (
    <div className={cn("w-full overflow-hidden rounded-full bg-surface-2", height, className)}>
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${pct}%`, backgroundImage: TONES[tone] }}
      />
    </div>
  );
}
