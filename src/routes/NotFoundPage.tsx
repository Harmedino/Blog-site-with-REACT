import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button-variants";
import { pageTitle } from "@/lib/seo";

export default function NotFoundPage() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <title>{pageTitle("Page not found")}</title>
      <p className="font-serif text-7xl font-bold text-brand-700 dark:text-brand-300">404</p>
      <h1 className="mt-4 text-2xl font-bold">This page wandered off</h1>
      <p className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className={buttonVariants()}>
          Go home
        </Link>
        <Link to="/blog" className={buttonVariants({ variant: "secondary" })}>
          Browse articles
        </Link>
      </div>
    </div>
  );
}
