import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Post } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WORDS_PER_MINUTE = 200;

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function readingTime(text: string): number {
  return Math.max(1, Math.ceil(wordCount(text) / WORDS_PER_MINUTE));
}

/** Strip common markdown syntax so previews read as plain text. */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerptOf(post: Pick<Post, "excerpt" | "body">, length = 140): string {
  if (post.excerpt?.trim()) return post.excerpt.trim();
  const text = stripMarkdown(post.body ?? "");
  if (text.length <= length) return text;
  return text.slice(0, text.lastIndexOf(" ", length) > 0 ? text.lastIndexOf(" ", length) : length) + "…";
}

/** Parse `YYYY-MM-DD` as a local date (not UTC) so it doesn't shift a day. */
export function parseDate(value: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value);
}

export function formatDate(value: string): string {
  const d = parseDate(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function timeAgo(value: string, now: Date = new Date()): string {
  const d = new Date(value);
  const seconds = Math.round((now.getTime() - d.getTime()) / 1000);
  if (Number.isNaN(seconds)) return "";
  if (seconds < 60) return "just now";
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, secs] of units) {
    if (seconds >= secs) return rtf.format(-Math.floor(seconds / secs), unit);
  }
  return "just now";
}

/** Sort key: author-set date first, then creation time as a tie-breaker. */
function sortKey(p: Post): number {
  return parseDate(p.date).getTime() || new Date(p.createdAt ?? 0).getTime();
}

export type SortOrder = "newest" | "oldest";

export interface PostFilters {
  q?: string;
  category?: string;
  sort?: SortOrder;
}

export function filterPosts(posts: Post[], { q = "", category = "", sort = "newest" }: PostFilters): Post[] {
  const query = q.trim().toLowerCase();
  const result = posts.filter((p) => {
    if (category && p.category.toLowerCase() !== category.toLowerCase()) return false;
    if (!query) return true;
    return [p.title, p.author, p.excerpt ?? "", p.body, ...(p.tags ?? [])].some((field) =>
      field.toLowerCase().includes(query),
    );
  });
  return result.sort((a, b) => (sort === "newest" ? sortKey(b) - sortKey(a) : sortKey(a) - sortKey(b)));
}

export function initials(...names: (string | undefined)[]): string {
  return (
    names
      .filter(Boolean)
      .map((n) => n!.trim()[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}
