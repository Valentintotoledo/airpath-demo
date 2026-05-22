import { PlaneTakeoff } from "lucide-react";
import { cn } from "@/lib/cn";

const MARK = { sm: "size-8 rounded-lg", md: "size-10 rounded-xl", lg: "size-14 rounded-2xl" } as const;
const ICON = { sm: "size-4", md: "size-5", lg: "size-7" } as const;
const TEXT = { sm: "text-base", md: "text-lg", lg: "text-2xl" } as const;

type LogoProps = {
  size?: keyof typeof MARK;
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
  /** Force light wordmark text (for dark panels regardless of theme). */
  onDark?: boolean;
};

export function Logo({ size = "md", showWordmark = true, showTagline = false, className, onDark }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative grid shrink-0 place-items-center bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800 text-white shadow-lg shadow-primary-700/30",
          MARK[size],
        )}
      >
        <PlaneTakeoff className={ICON[size]} strokeWidth={2.25} />
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-accent-400 ring-2 ring-[var(--surface)]" />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-extrabold tracking-tight",
              onDark ? "text-white" : "text-content",
              TEXT[size],
            )}
          >
            Air<span className="text-gradient-gold">Path</span>
          </span>
          {showTagline && (
            <span
              className={cn(
                "mt-1 text-[10px] font-bold uppercase tracking-[0.2em]",
                onDark ? "text-white/45" : "text-content-muted",
              )}
            >
              A CG Company
            </span>
          )}
        </span>
      )}
    </span>
  );
}
