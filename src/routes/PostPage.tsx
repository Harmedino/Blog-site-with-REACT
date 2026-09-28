import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Clock, FileQuestion, Link2, MessageCircle, Pencil, Share2, Trash2 } from "lucide-react";
import { useAddComment, useDeletePost, usePost, usePosts } from "@/features/posts/api";
import { PostCard, PostGrid } from "@/features/posts/PostCard";
import { useAuth } from "@/features/auth/auth-context";
import { Avatar, CategoryBadge, EmptyState, Skeleton } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Textarea } from "@/components/ui/form";
import { Markdown } from "@/components/ui/markdown";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { LinkedinIcon, WhatsappIcon, XIcon } from "@/components/ui/brand-icons";
import { errorMessage } from "@/lib/api";
import { excerptOf, formatDate, readingTime, timeAgo } from "@/lib/utils";
import { pageTitle } from "@/lib/seo";
import type { Post } from "@/types";

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-brand-600 dark:bg-brand-400"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}

function ShareBar({ post }: { post: Post }) {
  const url = window.location.href;
  const text = encodeURIComponent(post.title);
  const link = encodeURIComponent(url);
  const btn = buttonVariants({ variant: "secondary", size: "icon" }, "size-9");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-zinc-500">Share</span>
      {"share" in navigator && (
        <button className={btn} aria-label="Share" onClick={() => navigator.share({ title: post.title, url }).catch(() => {})}>
          <Share2 className="size-4" />
        </button>
      )}
      <a className={btn} aria-label="Share on X" target="_blank" rel="noopener noreferrer" href={`https://x.com/intent/post?text=${text}&url=${link}`}>
        <XIcon className="size-4" />
      </a>
      <a className={btn} aria-label="Share on LinkedIn" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${link}`}>
        <LinkedinIcon className="size-4" />
      </a>
      <a className={btn} aria-label="Share on WhatsApp" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${text}%20${link}`}>
        <WhatsappIcon className="size-4" />
      </a>
      <button className={btn} aria-label="Copy link" onClick={copy}>
        <Link2 className="size-4" />
      </button>
    </div>
  );
}

const commentSchema = z.object({
  comment: z.string().trim().min(2, "Write at least a couple of characters").max(1000, "Keep it under 1000 characters"),
});

function Comments({ post }: { post: Post }) {
  const { user, isAuthenticated } = useAuth();
  const addComment = useAddComment(post._id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof commentSchema>>({ resolver: zodResolver(commentSchema) });

  const comments = useMemo(
    () => [...(post.comments ?? [])].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [post.comments],
  );

  const onSubmit = handleSubmit(async ({ comment }) => {
    if (!user) return;
    try {
      await addComment.mutateAsync({ comment, author: user.username });
      reset();
      toast.success("Comment posted");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  });

  return (
    <section aria-labelledby="comments-heading" className="mt-16 border-t border-zinc-200 pt-10 dark:border-zinc-800">
      <h2 id="comments-heading" className="flex items-center gap-2 text-xl font-bold">
        <MessageCircle className="size-5" /> Comments ({comments.length})
      </h2>

      {isAuthenticated ? (
        <form onSubmit={onSubmit} className="mt-6 flex gap-3">
          <Avatar name={user ? `${user.firstname} ${user.lastname}` : "?"} />
          <div className="flex-1 space-y-2">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <Textarea
              id="comment"
              rows={3}
              placeholder="Share your thoughts…"
              invalid={!!errors.comment}
              {...register("comment")}
            />
            {errors.comment && <p className="text-xs text-red-600">{errors.comment.message}</p>}
            <div className="flex justify-end">
              <Button type="submit" size="sm" loading={addComment.isPending} disabled={!user}>
                Post comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <p className="mt-6 rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
          <Link
            to={`/auth?mode=login&redirect=${encodeURIComponent(`/blog/${post._id}`)}`}
            className="font-semibold text-brand-700 hover:underline dark:text-brand-300"
          >
            Sign in
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      <ul className="mt-8 space-y-6">
        {comments.map((c) => (
          <li key={c._id} className="flex gap-3">
            <Avatar name={c.author} className="size-8 text-xs" />
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="font-semibold">@{c.author}</span>{" "}
                <time dateTime={c.date} className="text-zinc-500">
                  · {timeAgo(c.date)}
                </time>
              </p>
              <p className="mt-1 text-sm whitespace-pre-line text-zinc-700 dark:text-zinc-300">{c.comment}</p>
            </div>
          </li>
        ))}
        {comments.length === 0 && <li className="text-sm text-zinc-500">No comments yet. Start the conversation.</li>}
      </ul>
    </section>
  );
}

function PostSkeleton() {
  return (
    <div className="container-page max-w-3xl py-12">
      <Skeleton className="h-5 w-32 rounded-full" />
      <Skeleton className="mt-6 h-12 w-full" />
      <Skeleton className="mt-3 h-12 w-2/3" />
      <div className="mt-8 flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="mt-10 aspect-[16/9] w-full rounded-2xl" />
      <div className="mt-10 space-y-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: post, isPending, isError, refetch } = usePost(id);
  const { data: allPosts } = usePosts();
  const deletePost = useDeletePost();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const related = useMemo(
    () => (post && allPosts ? allPosts.filter((p) => p._id !== post._id && p.category === post.category).slice(0, 3) : []),
    [post, allPosts],
  );

  if (isPending) return <PostSkeleton />;

  if (isError) {
    return (
      <div className="container-page max-w-3xl py-16">
        <EmptyState
          title="Couldn't load this article"
          description="The server may be waking up. Give it a moment."
          action={<Button onClick={() => refetch()}>Try again</Button>}
        />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-page max-w-3xl py-16">
        <title>{pageTitle("Article not found")}</title>
        <EmptyState
          icon={<FileQuestion className="size-8" />}
          title="Article not found"
          description="It may have been removed, or the link is wrong."
          action={
            <Link to="/blog" className={buttonVariants()}>
              Browse articles
            </Link>
          }
        />
      </div>
    );
  }

  const isOwner = !!user && post.publisher === user._id;

  const onDelete = async () => {
    try {
      await deletePost.mutateAsync(post._id);
      toast.success("Post deleted");
      navigate("/dashboard", { replace: true });
    } catch (e) {
      toast.error(errorMessage(e));
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <title>{pageTitle(post.title)}</title>
      <meta name="description" content={excerptOf(post, 160)} />
      <meta property="og:title" content={post.title} />
      <meta property="og:image" content={post.image} />
      <ReadingProgress />

      <article className="container-page max-w-3xl animate-fade-in py-10 sm:py-14">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            <ArrowLeft className="size-4" /> All articles
          </Link>
          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/write/${post._id}`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
                <Pencil className="size-3.5" /> Edit
              </Link>
              <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="size-3.5" /> Delete
              </Button>
            </div>
          )}
        </div>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <Link to={`/blog?category=${post.category}`}>
              <CategoryBadge name={post.category} />
            </Link>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" /> {readingTime(post.body)} min read
            </span>
          </div>
          <h1 className="mt-4 font-serif text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>}
          <div className="mt-8 flex items-center gap-3">
            <Avatar name={post.author} className="size-11" />
            <div>
              <p className="font-semibold">{post.author}</p>
              <p className="text-sm text-zinc-500">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </p>
            </div>
          </div>
        </header>

        <figure className="mt-10 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
          <img src={post.image} alt="" className="aspect-[16/9] w-full object-cover" />
        </figure>

        <Markdown className="mt-10 sm:prose-lg">{post.body}</Markdown>

        {post.tags && post.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((t) => (
              <li key={t}>
                <Link
                  to={`/blog?q=${encodeURIComponent(t)}`}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  #{t}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <ShareBar post={post} />
        </div>

        <Comments post={post} />
      </article>

      {related.length > 0 && (
        <section className="container-page mt-8">
          <h2 className="mb-6 font-serif text-2xl font-bold">More in {post.category}</h2>
          <PostGrid>
            {related.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </PostGrid>
        </section>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this post?"
        description="This permanently removes the post and its comments. This can't be undone."
        loading={deletePost.isPending}
        onConfirm={onDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
