import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { buttonVariants } from "@/components/ui/button-variants";

/** Last-resort error screen for anything that throws while rendering a route. */
export default function ErrorPage() {
  const error = useRouteError();
  // After a new deploy, old lazy-loaded chunks disappear — a reload fetches the new ones.
  const staleChunk = error instanceof Error && /dynamically imported module|Importing a module script failed/i.test(error.message);
  const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : staleChunk ? "A new version of the site is available." : "Something went wrong.";

  if (import.meta.env.DEV) console.error(error);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-3xl font-bold">{message}</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{staleChunk ? "Reload to get the latest version." : "Try reloading the page. If it keeps happening, let us know."}</p>
      <div className="mt-8 flex gap-3">
        <button onClick={() => window.location.reload()} className={buttonVariants()}>
          Reload
        </button>
        <Link to="/" reloadDocument className={buttonVariants({ variant: "secondary" })}>
          Go home
        </Link>
      </div>
    </div>
  );
}
