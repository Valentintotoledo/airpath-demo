import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const VARIANTS = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-600/25",
  gold: "bg-accent-500 text-neutral-950 hover:bg-accent-400 shadow-lg shadow-accent-500/25",
  outline:
    "border border-hairline bg-transparent text-content hover:bg-surface-2 hover:border-primary-500/45",
  ghost: "text-content hover:bg-surface-2",
  subtle: "bg-surface-2 text-content border border-hairline hover:border-primary-500/40",
  danger: "bg-danger-500 text-white hover:bg-danger-400",
} as const;

const SIZES = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2",
  icon: "size-11",
} as const;

const BASE =
  "inline-flex items-center justify-center rounded-xl font-semibold transition-[background,border,transform,box-shadow] duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none";

type CommonProps = {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  fullWidth?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    loading,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className);
  const iconSize = size === "lg" ? "size-[18px]" : "size-4";

  const content = (
    <>
      {loading ? (
        <Loader2 className={cn(iconSize, "animate-spin")} />
      ) : (
        LeftIcon && <LeftIcon className={iconSize} />
      )}
      {children}
      {RightIcon && !loading && <RightIcon className={iconSize} />}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href as string} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={loading} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
