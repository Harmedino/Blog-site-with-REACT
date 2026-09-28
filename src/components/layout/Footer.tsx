import { Link } from "react-router";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { CATEGORIES } from "@/lib/categories";
import { Logo } from "./Logo";

export function Footer() {
  const heading = "text-sm font-semibold text-zinc-900 dark:text-white";
  const link = "text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white";
  return (
    <footer className="mt-24 border-t border-zinc-200 dark:border-zinc-800">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 lg:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
            A community blog for curious minds — stories on technology, travel, food, fashion and everyday life.
          </p>
          <div className="flex gap-2 pt-1">
            <a href="https://github.com/Harmedino" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={link}>
              <GithubIcon className="size-5" />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={link}>
              <LinkedinIcon className="size-5" />
            </a>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className={heading}>Explore</h2>
          <ul className="space-y-2">
            <li><Link to="/blog" className={link}>All articles</Link></li>
            <li><Link to="/write" className={link}>Write a post</Link></li>
            <li><Link to="/about" className={link}>About</Link></li>
            <li><Link to="/contact" className={link}>Contact</Link></li>
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className={heading}>Categories</h2>
          <ul className="space-y-2">
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <Link to={`/blog?category=${c.name}`} className={link}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <p className="container-page py-6 text-xs text-zinc-500">© {new Date().getFullYear()} Harmedino. Built by Damilola Adebowale.</p>
      </div>
    </footer>
  );
}
