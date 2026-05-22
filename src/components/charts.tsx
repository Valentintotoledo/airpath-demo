import { cn } from "@/lib/cn";
import { toneSolid, toneStroke, toneGradient, type Accent } from "@/lib/tone";

/* ---------------- Bar chart ---------------- */

type BarDatum = { label: string; value: number };

export function BarChart({
  data,
  tone = "purple",
  className,
  height = 140,
}: {
  data: BarDatum[];
  tone?: Accent;
  className?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={cn("flex items-end gap-2", className)} style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <span className="text-[11px] font-bold tabular-nums text-content-muted">{d.value}</span>
          <div
            className={cn("w-full rounded-md bg-gradient-to-t", toneGradient[tone])}
            style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}
          />
          <span className="text-[10px] font-medium text-content-muted">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Progress ring ---------------- */

export function ProgressRing({
  value,
  size = 76,
  stroke = 9,
  tone = "purple",
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: Accent;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-surface-2" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className={cn("transition-[stroke-dashoffset] duration-700 ease-out", toneStroke[tone])}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center leading-none">
        <div>
          <span className="text-base font-extrabold tabular-nums text-content">{Math.round(pct)}%</span>
          {label && <span className="mt-0.5 block text-[10px] font-medium text-content-muted">{label}</span>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Stacked bar ---------------- */

type Segment = { label: string; value: number; accent: Accent };

export function StackedBar({ segments, className }: { segments: Segment[]; className?: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className={className}>
      <div className="flex h-3.5 overflow-hidden rounded-full bg-surface-2">
        {segments.map((s, i) => (
          <div
            key={i}
            className={cn(toneSolid[s.accent], i > 0 && "border-l-2 border-surface")}
            style={{ width: `${(s.value / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm text-content-muted">
              <span className={cn("size-2.5 rounded-sm", toneSolid[s.accent])} />
              {s.label}
            </span>
            <span className="text-sm font-bold tabular-nums text-content">
              ${s.value.toLocaleString("en-US")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
