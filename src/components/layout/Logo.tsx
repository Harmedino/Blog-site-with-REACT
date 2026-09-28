import { Link } from "react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight">
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand-700 font-sans text-base text-white dark:bg-brand-500">
        H
      </span>
      Harmedino
    </Link>
  );
}
