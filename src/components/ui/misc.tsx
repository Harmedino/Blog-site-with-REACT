import type { ReactNode } from "react";
import { cn, initials } from "@/lib/utils";
import { getCategory } from "@/lib/categories";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-zinc-200/80 dark:bg-zinc-800", className)} />;
}

export function CategoryBadge({ name, className }: { name: string; className?: string }) {
  const cat = getCategory(name);
  const Icon = cat?.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        cat?.tone ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        className,
      )}
    >
      {Icon && <Icon className="size-3" aria-hidden />}
      {name}
    </span>
  );
}

const AVATAR_TONES = [
  "bg-brand-600",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-sky-600",
  "bg-violet-600",
];

export function Avatar({ name, className }: { name: string; className?: string }) {
  const tone = AVATAR_TONES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TONES.length];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
        tone,
        className,
      )}
    >
      {initials(...name.split(/\s+/))}
    </span>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 px-6 py-14 text-center dark:border-zinc-700",
        className,
      )}
    >
      {icon && <div className="mb-4 text-zinc-400">{icon}</div>}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
