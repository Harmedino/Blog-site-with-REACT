import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { LayoutDashboard, LogOut, Menu, PenSquare, Settings, X } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { Avatar } from "@/components/ui/misc";
import { buttonVariants } from "@/components/ui/button-variants";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/blog", label: "Articles" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white",
  );

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const name = user ? `${user.firstname} ${user.lastname}` : "Account";
  const item = "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="rounded-full"
      >
        <Avatar name={name} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 animate-fade-in rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            {user && <p className="truncate text-xs text-zinc-500">@{user.username}</p>}
          </div>
          <div className="my-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          <Link role="menuitem" to="/dashboard" className={item} onClick={() => setOpen(false)}>
            <LayoutDashboard className="size-4" /> Dashboard
          </Link>
          <Link role="menuitem" to="/dashboard/settings" className={item} onClick={() => setOpen(false)}>
            <Settings className="size-4" /> Profile settings
          </Link>
          <button role="menuitem" className={cn(item, "text-red-600 dark:text-red-400")} onClick={() => logout("You've been signed out.")}>
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu on navigation. Adjusting state during render
  // (instead of in an effect) avoids an extra paint with the menu open.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur-lg dark:border-zinc-800/70 dark:bg-zinc-950/80">
      <nav className="container-page flex h-16 items-center gap-4" aria-label="Main">
        <Logo />
        <div className="ml-6 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link to="/write" className={buttonVariants({ size: "sm" }, "hidden sm:inline-flex")}>
                <PenSquare className="size-4" /> Write
              </Link>
              <UserMenu />
            </>
          ) : (
            <>
              <Link to="/auth?mode=login" className={buttonVariants({ variant: "ghost", size: "sm" }, "hidden sm:inline-flex")}>
                Sign in
              </Link>
              <Link to="/auth?mode=signup" className={buttonVariants({ size: "sm" }, "hidden sm:inline-flex")}>
                Get started
              </Link>
            </>
          )}
          <button
            className={buttonVariants({ variant: "ghost", size: "icon" }, "md:hidden")}
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div id="mobile-menu" className="animate-fade-in border-t border-zinc-200 md:hidden dark:border-zinc-800">
          <div className="container-page flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {isAuthenticated ? (
                <Link to="/write" className={buttonVariants({}, "col-span-2")}>
                  <PenSquare className="size-4" /> Write a post
                </Link>
              ) : (
                <>
                  <Link to="/auth?mode=login" className={buttonVariants({ variant: "secondary" })}>
                    Sign in
                  </Link>
                  <Link to="/auth?mode=signup" className={buttonVariants()}>
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
