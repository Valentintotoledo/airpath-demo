import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  glow?: boolean;
};

export function Card({ className, interactive, glow, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-hairline bg-surface",
        glow && "shadow-[0_0_60px_-20px_var(--color-primary-600)]",
        interactive &&
          "transition-[border-color,transform,background] duration-200 hover:-translate-y-0.5 hover:border-primary-500/45 hover:bg-surface-2",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-start justify-between gap-3 p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-bold tracking-tight text-content", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-content-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}
