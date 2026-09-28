import { Link } from "react-router";
import { BookOpen, MessageCircle, PenSquare, Search, Smartphone, Moon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { pageTitle } from "@/lib/seo";

const FEATURES = [
  { icon: PenSquare, title: "Write in Markdown", desc: "A distraction-free editor with live preview, drafts that save as you type and drag-and-drop cover images." },
  { icon: Search, title: "Find anything fast", desc: "Search by title, author, tag or content and filter by topic. Every filter lives in the URL, so you can share it." },
  { icon: MessageCircle, title: "Join the conversation", desc: "Comment on posts and see what other readers think." },
  { icon: BookOpen, title: "Built for reading", desc: "Clean typography, reading time estimates and a progress bar on every article." },
  { icon: Smartphone, title: "Works everywhere", desc: "Designed mobile-first, so it's just as good on a phone on a Lagos commute as on a laptop." },
  { icon: Moon, title: "Light and dark", desc: "Follows your system theme, or pick one yourself." },
];

export default function AboutPage() {
  return (
    <>
      <title>{pageTitle("About")}</title>
      <section className="container-page py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase dark:text-brand-300">About Harmedino</p>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            A home for good writing, and the people who love reading it.
          </h1>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
            Harmedino is an open community blog. Anyone can sign up, write about what they know — technology,
            travel, food, fashion or everyday life — and publish it for readers everywhere. No paywalls, no
            clutter, just stories.
          </p>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-16 sm:py-20 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="container-page">
          <h2 className="font-serif text-3xl font-bold tracking-tight">What you can do here</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <Icon className="size-6 text-brand-700 dark:text-brand-300" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 text-center sm:py-24">
        <h2 className="font-serif text-3xl font-bold tracking-tight">Ready to start?</h2>
        <p className="mx-auto mt-3 max-w-md text-zinc-600 dark:text-zinc-400">Read what the community is writing, or add your own voice.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/blog" className={buttonVariants({ size: "lg", variant: "secondary" })}>
            Browse articles
          </Link>
          <Link to="/write" className={buttonVariants({ size: "lg" })}>
            Start writing
          </Link>
        </div>
      </section>
    </>
  );
}
