import { useMemo, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, PenSquare, RefreshCw, Search } from "lucide-react";
import { usePosts } from "@/features/posts/api";
import { PostCard, PostCardSkeleton, PostGrid } from "@/features/posts/PostCard";
import { useAuth } from "@/features/auth/auth-context";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { CATEGORIES } from "@/lib/categories";
import { filterPosts } from "@/lib/utils";
import { pageTitle } from "@/lib/seo";

function Hero({ stats }: { stats: { label: string; value: number | undefined }[] }) {
  const navigate = useNavigate();

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim();
    navigate(q ? `/blog?q=${encodeURIComponent(q)}` : "/blog");
  };

  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_20%_-10%,var(--color-brand-100),transparent),radial-gradient(40rem_20rem_at_90%_10%,var(--color-amber-100),transparent)] dark:bg-[radial-gradient(60rem_30rem_at_20%_-10%,var(--color-brand-950),transparent),radial-gradient(40rem_20rem_at_90%_10%,rgb(120_53_15/0.25),transparent)]"
      />
      <div className="container-page py-16 sm:py-24">
        <div className="max-w-3xl animate-fade-in">
          <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase dark:text-brand-300">
            A community blog for curious minds
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Stories that make you <span className="text-brand-700 italic dark:text-brand-300">think</span>, read and write.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Read thoughtful articles on technology, travel, food, fashion and lifestyle — or share your own with
            readers everywhere.
          </p>
          <form onSubmit={onSearch} role="search" className="mt-8 flex max-w-xl gap-2">
            <label htmlFor="hero-search" className="sr-only">
              Search articles
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="Search articles, authors, tags…"
                className="h-12 w-full rounded-full border border-zinc-300 bg-white pr-4 pl-11 text-sm shadow-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <Button type="submit" size="lg">
              Search
            </Button>
          </form>
        </div>
        <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-sm text-zinc-500">{s.label}</dt>
              <dd className="mt-1 font-serif text-3xl font-bold">
                {s.value === undefined ? <Skeleton className="h-9 w-12" /> : s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {action}
    </div>
  );
}

export default function HomePage() {
  const { data: posts, isPending, isError, refetch, isRefetching } = usePosts();
  const { isAuthenticated } = useAuth();

  const sorted = useMemo(() => (posts ? filterPosts(posts, { sort: "newest" }) : []), [posts]);
  const [featured, ...rest] = sorted;

  const counts = useMemo(() => {
    const byCategory = new Map<string, number>();
    posts?.forEach((p) => byCategory.set(p.category, (byCategory.get(p.category) ?? 0) + 1));
    return byCategory;
  }, [posts]);

  const stats = [
    { label: "Articles", value: posts?.length },
    { label: "Writers", value: posts ? new Set(posts.map((p) => p.publisher ?? p.author)).size : undefined },
    { label: "Comments", value: posts?.reduce((n, p) => n + (p.comments?.length ?? 0), 0) },
  ];

  return (
    <>
      <title>{pageTitle()}</title>
      <Hero stats={stats} />

      <section className="container-page mt-16">
        <SectionHeader
          title="Latest stories"
          action={
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          }
        />

        {isPending && (
          <div className="space-y-6">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <PostGrid>
              {Array.from({ length: 3 }, (_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </PostGrid>
          </div>
        )}

        {isError && (
          <EmptyState
            icon={<RefreshCw className="size-8" />}
            title="We couldn't load the latest stories"
            description="The server may be waking up after a quiet spell. This usually takes under a minute."
            action={
              <Button onClick={() => refetch()} loading={isRefetching}>
                Try again
              </Button>
            }
          />
        )}

        {posts && sorted.length === 0 && (
          <EmptyState
            icon={<PenSquare className="size-8" />}
            title="No stories yet"
            description="Be the first to publish something."
            action={
              <Link to="/write" className={buttonVariants()}>
                Write the first post
              </Link>
            }
          />
        )}

        {featured && (
          <div className="space-y-6">
            <PostCard post={featured} variant="featured" />
            {rest.length > 0 && (
              <PostGrid>
                {rest.slice(0, 6).map((p) => (
                  <PostCard key={p._id} post={p} />
                ))}
              </PostGrid>
            )}
          </div>
        )}
      </section>

      <section className="container-page mt-24">
        <SectionHeader title="Explore by topic" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map(({ name, icon: Icon, image }) => (
            <Link
              key={name}
              to={`/blog?category=${name}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800"
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                className="size-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <Icon className="mb-2 size-5" aria-hidden />
                <p className="font-semibold">{name}</p>
                <p className="text-xs text-white/75">
                  {posts ? `${counts.get(name) ?? 0} ${counts.get(name) === 1 ? "article" : "articles"}` : " "}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-6 py-14 text-center text-white sm:px-16">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(40rem_20rem_at_50%_-20%,rgb(99_102_241/0.5),transparent)]"
          />
          <div className="relative">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Have something to say?</h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-100">
              Write in markdown, add a cover image and publish in minutes. Your readers are waiting.
            </p>
            <Link
              to={isAuthenticated ? "/write" : "/auth?mode=signup&redirect=%2Fwrite"}
              className={buttonVariants(
                { size: "lg", variant: "secondary" },
                "mt-8 ring-0 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100",
              )}
            >
              <PenSquare className="size-4" /> Start writing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
