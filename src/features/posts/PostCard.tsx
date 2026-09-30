import { Link } from "react-router";
import { Clock, MessageCircle } from "lucide-react";
import type { Post } from "@/types";
import { cn, excerptOf, formatDate, readingTime } from "@/lib/utils";
import { Avatar, CategoryBadge, Skeleton } from "@/components/ui/misc";

interface PostCardProps {
  post: Post;
  variant?: "default" | "featured";
  className?: string;
}

export function PostCard({ post, variant = "default", className }: PostCardProps) {
  const featured = variant === "featured";
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-black/30",
        featured && "lg:flex-row",
        className,
      )}
    >
      <div className={cn("relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800", featured && "lg:aspect-auto lg:w-3/5")}>
        <img
          src={post.image}
          alt=""
          loading={featured ? "eager" : "lazy"}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className={cn("flex flex-1 flex-col p-5", featured && "lg:justify-center lg:p-10")}>
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <CategoryBadge name={post.category} />
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden /> {readingTime(post.body)} min read
          </span>
        </div>
        <h3
          className={cn(
            "mt-3 font-serif font-bold tracking-tight text-zinc-900 dark:text-white",
            featured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-lg leading-snug",
          )}
        >
          <Link to={`/blog/${post._id}`} className="after:absolute after:inset-0 focus:outline-none">
            {post.title}
          </Link>
        </h3>
        <p className={cn("mt-2 text-sm text-zinc-600 dark:text-zinc-400", featured ? "line-clamp-3 sm:text-base" : "line-clamp-2")}>
          {excerptOf(post, featured ? 220 : 140)}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-5">
          <Avatar name={post.author} className="size-8 text-xs" />
          <div className="min-w-0 flex-1 text-sm">
            <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{post.author}</p>
            <p className="text-xs text-zinc-500">{formatDate(post.date)}</p>
          </div>
          {post.comments?.length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-zinc-500" title="Comments">
              <MessageCircle className="size-3.5" aria-hidden /> {post.comments.length}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex items-center gap-3 pt-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}

export function PostGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>{children}</div>;
}
