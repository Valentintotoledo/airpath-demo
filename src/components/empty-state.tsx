import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-surface/40 p-10 text-center",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-xl bg-surface-2 text-content-muted">
        <Icon className="size-6" />
      </span>
      <p className="mt-3 font-bold text-content">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-content-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
