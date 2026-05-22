"use client";

import { useId, type InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  icon?: LucideIcon;
};

export function Input({ label, hint, error, icon: Icon, className, id, ...props }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-content">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-content-muted" />
        )}
        <input
          id={inputId}
          className={cn(
            "h-11 w-full rounded-xl border bg-surface-2 px-3.5 text-sm text-content placeholder:text-content-muted/70",
            "transition-[border-color,box-shadow] outline-none",
            "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25",
            Icon && "pl-11",
            error ? "border-danger-500/60" : "border-hairline",
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs font-medium text-danger-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-content-muted">{hint}</p>
      ) : null}
    </div>
  );
}
