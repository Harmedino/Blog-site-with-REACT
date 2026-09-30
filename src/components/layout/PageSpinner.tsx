import { Loader2 } from "lucide-react";

export function PageSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status">
      <Loader2 className="size-8 animate-spin text-brand-600" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
