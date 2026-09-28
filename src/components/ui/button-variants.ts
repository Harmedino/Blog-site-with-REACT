import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-brand-700 text-white hover:bg-brand-800 dark:bg-brand-500 dark:hover:bg-brand-400 shadow-sm",
  secondary:
    "bg-white text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-800",
  ghost: "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
} as const;

const sizes = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-10 w-10",
} as const;

export interface ButtonStyleProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

/** Shared button styling — also used on <Link>s that should look like buttons. */
export function buttonVariants({ variant = "primary", size = "md" }: ButtonStyleProps = {}, className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}
