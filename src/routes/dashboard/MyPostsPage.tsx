import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { ExternalLink, MessageCircle, Pencil, PenSquare, Trash2 } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { useDeletePost, useUserPosts } from "@/features/posts/api";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { CategoryBadge, EmptyState, Skeleton } from "@/components/ui/misc";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { errorMessage } from "@/lib/api";
import { cn, filterPosts, formatDate } from "@/lib/utils";
import { pageTitle } from "@/lib/seo";
import type { Post } from "@/types";

type Filter = "all" | "live" | "pending";

export default function MyPostsPage() {
  const { user } = useAuth();
  const { data: posts, isPending, isError, refetch } = useUserPosts(user?._id);
  const deletePost = useDeletePost();
  const [filter, setFilter] = useState<Filter>("all");
  const [toDelete, setToDelete] = useState<Post | null>(null);

  const isLive = (p: Post) => p.publication !== false;
  const counts = { all: posts?.length ?? 0, live: posts?.filter(isLive).length ?? 0, pending: posts?.filter((p) => !isLive(p)).length ?? 0 };
  const visible = filterPosts(
    (posts ?? []).filter((p) => filter === "all" || (filter === "live" ? isLive(p) : !isLive(p))),
    { sort: "newest" },
  );

  const onDelete = async () => {
    if (!toDelete) return;
    try {
      await deletePost.mutateAsync(toDelete._id);
      toast.success("Post deleted");
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setToDelete(null);
    }
  };

  return (
    <>
      <title>{pageTitle("My posts")}</title>
      <div className="mb-6 flex gap-2" role="group" aria-label="Filter posts">
        {(["all", "live", "pending"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium capitalize",
              filter === f ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
            )}
          >
            {f === "pending" ? "In review" : f} <span className="opacity-60">{counts[f]}</span>
          </button>
        ))}
      </div>

      {isPending && (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {isError && <EmptyState title="Couldn't load your posts" action={<Button onClick={() => refetch()}>Try again</Button>} />}

      {posts && visible.length === 0 && (
        <EmptyState
          icon={<PenSquare className="size-8" />}
          title={filter === "all" ? "You haven't written anything yet" : "Nothing here"}
          description={filter === "all" ? "Your published posts will show up here." : undefined}
          action={
            filter === "all" && (
              <Link to="/write" className={buttonVariants()}>
                Write your first post
              </Link>
            )
          }
        />
      )}

      <ul className="space-y-3">
        {visible.map((post) => (
          <li
            key={post._id}
            className="flex items-center gap-4 rounded-2xl border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 sm:p-4 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            <img src={post.image} alt="" className="hidden size-20 shrink-0 rounded-xl object-cover sm:block" loading="lazy" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge name={post.category} />
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    isLive(post)
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
                  )}
                >
                  {isLive(post) ? "Live" : "In review"}
                </span>
              </div>
              <p className="mt-1.5 truncate font-semibold">{post.title}</p>
              <p className="mt-0.5 flex items-center gap-3 text-xs text-zinc-500">
                <span>{formatDate(post.date)}</span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="size-3" /> {post.comments?.length ?? 0}
                </span>
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Link to={`/blog/${post._id}`} className={buttonVariants({ variant: "ghost", size: "icon" })} aria-label={`View “${post.title}”`}>
                <ExternalLink className="size-4" />
              </Link>
              <Link to={`/write/${post._id}`} className={buttonVariants({ variant: "ghost", size: "icon" })} aria-label={`Edit “${post.title}”`}>
                <Pencil className="size-4" />
              </Link>
              <Button variant="ghost" size="icon" className="text-red-600 dark:text-red-400" aria-label={`Delete “${post.title}”`} onClick={() => setToDelete(post)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this post?"
        description={`“${toDelete?.title ?? ""}” and its comments will be permanently removed.`}
        loading={deletePost.isPending}
        onConfirm={onDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
