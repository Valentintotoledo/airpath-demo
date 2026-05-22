import { cn } from "@/lib/cn";

const ACCENTS = {
  purple: "from-primary-400 to-primary-700 text-white",
  gold: "from-accent-300 to-accent-600 text-neutral-950",
  sky: "from-sky-400 to-sky-600 text-white",
  green: "from-success-400 to-success-600 text-white",
} as const;

const SIZES = {
  xs: "size-7 text-[10px]",
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl",
} as const;

type AvatarProps = {
  initials: string;
  accent?: keyof typeof ACCENTS;
  size?: keyof typeof SIZES;
  className?: string;
  ring?: boolean;
};

export function Avatar({ initials, accent = "purple", size = "md", className, ring }: AvatarProps) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-extrabold tracking-tight",
        ACCENTS[accent],
        SIZES[size],
        ring && "ring-2 ring-hairline",
        className,
      )}
    >
      {initials}
    </span>
  );
}
