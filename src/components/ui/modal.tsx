"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

const SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof SIZES;
  className?: string;
};

export function Modal({ open, onClose, title, description, children, footer, size = "md", className }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn(
              "relative w-full overflow-hidden rounded-t-3xl border border-hairline bg-surface shadow-2xl sm:rounded-3xl",
              SIZES[size],
              className,
            )}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.18 }}
          >
            {(title || description) && (
              <div className="flex items-start justify-between gap-4 border-b border-hairline p-5">
                <div className="min-w-0">
                  {title && <h2 className="text-lg font-bold tracking-tight text-content">{title}</h2>}
                  {description && <p className="mt-1 text-sm text-content-muted">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-content-muted transition hover:bg-surface-2 hover:text-content"
                >
                  <X className="size-5" />
                </button>
              </div>
            )}
            <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-2 border-t border-hairline bg-surface-2/50 p-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
