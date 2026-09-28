import { Link, NavLink, Outlet } from "react-router";
import { FileText, MessageCircle, PenSquare, Settings, Eye } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { useUserPosts } from "@/features/posts/api";
import { Avatar, Skeleton } from "@/components/ui/misc";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/dashboard", label: "My posts", icon: FileText, end: true },
  { to: "/dashboard/settings", label: "Profile settings", icon: Settings },
];

export default function DashboardLayout() {
  const { user } = useAuth();
  const { data: posts } = useUserPosts(user?._id);

  const stats = [
    { label: "Posts", value: posts?.length, icon: FileText },
    { label: "Live", value: posts?.filter((p) => p.publication !== false).length, icon: Eye },
    { label: "Comments received", value: posts?.reduce((n, p) => n + (p.comments?.length ?? 0), 0), icon: MessageCircle },
  ];

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {user ? <Avatar name={`${user.firstname} ${user.lastname}`} className="size-14 text-lg" /> : <Skeleton className="size-14 rounded-full" />}
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
              {user ? `Hi, ${user.firstname}` : <Skeleton className="h-8 w-40" />}
            </h1>
            <p className="text-sm text-zinc-500">{user ? `@${user.username}` : " "}</p>
          </div>
        </div>
        <Link to="/write" className={buttonVariants()}>
          <PenSquare className="size-4" /> New post
        </Link>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-zinc-200 p-4 sm:p-5 dark:border-zinc-800">
            <dt className="flex items-center gap-1.5 text-xs text-zinc-500 sm:text-sm">
              <Icon className="size-4" aria-hidden /> {label}
            </dt>
            <dd className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
              {value === undefined ? <Skeleton className="h-8 w-10" /> : value}
            </dd>
          </div>
        ))}
      </dl>

      <nav className="mt-10 flex gap-1 border-b border-zinc-200 dark:border-zinc-800" aria-label="Dashboard">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-brand-600 text-zinc-900 dark:border-brand-400 dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white",
              )
            }
          >
            <Icon className="size-4" /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
