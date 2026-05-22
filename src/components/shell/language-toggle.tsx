"use client";

import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const LANGS: Lang[] = ["es", "en"];

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center rounded-xl border border-hairline bg-surface p-0.5",
        className,
      )}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={cn(
            "rounded-lg px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wide transition",
            lang === l
              ? "bg-primary-600 text-white shadow"
              : "text-content-muted hover:text-content",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
