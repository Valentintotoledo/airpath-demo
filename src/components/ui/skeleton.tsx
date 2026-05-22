import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-lg bg-surface-2", className)}
      {...props}
    >
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, color-mix(in srgb, var(--content) 9%, transparent), transparent)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}
