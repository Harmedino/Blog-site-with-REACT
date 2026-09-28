import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { RefreshCw, Search, SearchX, X } from "lucide-react";
import { usePosts } from "@/features/posts/api";
import { PostCard, PostCardSkeleton, PostGrid } from "@/features/posts/PostCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { Select } from "@/components/ui/form";
import { CATEGORIES } from "@/lib/categories";
import { cn, filterPosts, type SortOrder } from "@/lib/utils";
import { pageTitle } from "@/lib/seo";

const PAGE_SIZE = 9;

export default function BlogPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "";
  const sort = (params.get("sort") as SortOrder) || "newest";
  const urlQuery = params.get("q") ?? "";

  // Typing updates the input immediately; the URL is updated after a short pause.
  const [query, setQuery] = useState(urlQuery);
  const deferredQuery = useDeferredValue(query);
  useEffect(() => {
    const t = setTimeout(() => {
      if (query === (params.get("q") ?? "")) return;
      setParams(
        (prev) => {
          if (query) prev.set("q", query);
          else prev.delete("q");
          return prev;
        },
        { replace: true },
      );
    }, 300);
    return () => clearTimeout(t);
  }, [query, params, setParams]);

  const [visible, setVisible] = useState(PAGE_SIZE);
  const { data: posts, isPending, isError, refetch, isRefetching } = usePosts();

  const results = useMemo(
    () => (posts ? filterPosts(posts, { q: deferredQuery, category, sort }) : []),
    [posts, deferredQuery, category, sort],
  );

  // Reset pagination whenever the filters change.
  const filterKey = `${deferredQuery}|${category}|${sort}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setVisible(PAGE_SIZE);
  }

  const setParam = (key: string, value: string) =>
    setParams((prev) => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      return prev;
    });

  const clearAll = () => {
    setQuery("");
    setParams({});
  };

  const hasFilters = !!(deferredQuery || category);
  const chip = (active: boolean) =>
    cn(
      "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
    );

  return (
    <div className="container-page py-12">
      <title>{pageTitle(category ? `${category} articles` : "All articles")}</title>

      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          {category ? category : "All articles"}
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Search by title, author, tag or content — or narrow things down by topic.
        </p>
      </header>

      <div className="sticky top-16 z-30 -mx-4 mt-8 space-y-4 border-b border-zinc-200 bg-white/90 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-4 dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="h-11 w-full rounded-xl border border-zinc-300 bg-white pr-10 pl-10 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm whitespace-nowrap text-zinc-500">
              Sort by
            </label>
            <Select id="sort" value={sort} onChange={(e) => setParam("sort", e.target.value === "newest" ? "" : e.target.value)} className="h-11 w-auto">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </Select>
          </div>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
          <button className={chip(!category)} aria-pressed={!category} onClick={() => setParam("category", "")}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              className={chip(category === c.name)}
              aria-pressed={category === c.name}
              onClick={() => setParam("category", category === c.name ? "" : c.name)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-sm text-zinc-500" aria-live="polite">
        {posts && (
          <p>
            {results.length} {results.length === 1 ? "article" : "articles"}
            {deferredQuery && <> matching “{deferredQuery}”</>}
          </p>
        )}
        {hasFilters && (
          <button onClick={clearAll} className="font-medium text-brand-700 hover:underline dark:text-brand-300">
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-6">
        {isPending && (
          <PostGrid>
            {Array.from({ length: 6 }, (_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </PostGrid>
        )}

        {isError && (
          <EmptyState
            icon={<RefreshCw className="size-8" />}
            title="Couldn't load articles"
            description="The server may be waking up. Give it a moment and try again."
            action={
              <Button onClick={() => refetch()} loading={isRefetching}>
                Try again
              </Button>
            }
          />
        )}

        {posts && results.length === 0 && (
          <EmptyState
            icon={<SearchX className="size-8" />}
            title="No articles found"
            description="Try a different search term or clear the filters."
            action={
              hasFilters && (
                <Button variant="secondary" onClick={clearAll}>
                  Clear filters
                </Button>
              )
            }
          />
        )}

        {results.length > 0 && (
          <>
            <PostGrid>
              {results.slice(0, visible).map((p) => (
                <PostCard key={p._id} post={p} className="animate-fade-in" />
              ))}
            </PostGrid>
            {visible < results.length && (
              <div className="mt-10 flex justify-center">
                <Button variant="secondary" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Load more ({results.length - visible} left)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
