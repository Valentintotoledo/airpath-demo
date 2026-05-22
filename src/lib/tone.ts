import type { Accent } from "@/data/academy";

export type { Accent };

/** Icon chip background + foreground. */
export const toneIcon: Record<Accent, string> = {
  purple: "bg-primary-600/15 text-purple-ink",
  gold: "bg-accent-500/15 text-gold-ink",
  sky: "bg-sky-500/15 text-sky-400",
  green: "bg-success-500/15 text-success-500",
};

export const toneText: Record<Accent, string> = {
  purple: "text-purple-ink",
  gold: "text-gold-ink",
  sky: "text-sky-400",
  green: "text-success-500",
};

export const toneDot: Record<Accent, string> = {
  purple: "bg-primary-500",
  gold: "bg-accent-500",
  sky: "bg-sky-500",
  green: "bg-success-500",
};

export const toneSolid: Record<Accent, string> = {
  purple: "bg-primary-600",
  gold: "bg-accent-500",
  sky: "bg-sky-500",
  green: "bg-success-500",
};

export const toneGradient: Record<Accent, string> = {
  purple: "from-primary-500 to-primary-800",
  gold: "from-accent-400 to-accent-600",
  sky: "from-sky-400 to-sky-600",
  green: "from-success-400 to-success-600",
};

export const toneStroke: Record<Accent, string> = {
  purple: "stroke-primary-500",
  gold: "stroke-accent-500",
  sky: "stroke-sky-500",
  green: "stroke-success-500",
};

export const toneBorder: Record<Accent, string> = {
  purple: "border-primary-500/30",
  gold: "border-accent-500/35",
  sky: "border-sky-500/30",
  green: "border-success-500/30",
};
