import { describe, expect, it } from "vitest";
import type { Post } from "@/types";
import { excerptOf, filterPosts, formatDate, initials, readingTime, stripMarkdown, timeAgo, wordCount } from "./utils";

const post = (overrides: Partial<Post>): Post => ({
  _id: Math.random().toString(36),
  title: "Untitled",
  body: "",
  category: "Technology",
  author: "dami",
  date: "2025-01-01",
  image: "",
  comments: [],
  ...overrides,
});

describe("wordCount / readingTime", () => {
  it("counts words across whitespace", () => {
    expect(wordCount("  one two\n\nthree\tfour ")).toBe(4);
    expect(wordCount("")).toBe(0);
  });

  it("rounds reading time up and never returns 0", () => {
    expect(readingTime("")).toBe(1);
    expect(readingTime("word ".repeat(200))).toBe(1);
    expect(readingTime("word ".repeat(201))).toBe(2);
  });
});

describe("stripMarkdown / excerptOf", () => {
  it("removes markdown syntax but keeps link text", () => {
    expect(stripMarkdown("## Hello **world** and [a link](https://x.com)")).toBe("Hello world and a link");
  });

  it("prefers the author's excerpt", () => {
    expect(excerptOf({ excerpt: "Custom summary", body: "Body text" })).toBe("Custom summary");
  });

  it("truncates long bodies on a word boundary", () => {
    const result = excerptOf({ body: "alpha beta gamma delta epsilon" }, 12);
    expect(result).toBe("alpha beta…");
  });
});

describe("formatDate", () => {
  it("treats YYYY-MM-DD as a local date (no off-by-one from UTC)", () => {
    expect(formatDate("2024-03-01")).toBe("Mar 1, 2024");
  });

  it("returns unparseable input unchanged", () => {
    expect(formatDate("not a date")).toBe("not a date");
  });
});

describe("timeAgo", () => {
  const now = new Date("2025-06-15T12:00:00Z");
  it("formats relative times", () => {
    expect(timeAgo("2025-06-15T11:59:30Z", now)).toBe("just now");
    expect(timeAgo("2025-06-15T11:55:00Z", now)).toBe("5 minutes ago");
    expect(timeAgo("2025-06-14T12:00:00Z", now)).toBe("yesterday");
    expect(timeAgo("2025-03-15T12:00:00Z", now)).toBe("3 months ago");
  });
});

describe("filterPosts", () => {
  const posts = [
    post({ title: "React hooks in depth", category: "Technology", date: "2025-02-01", tags: ["react"] }),
    post({ title: "Street food in Lagos", category: "Food", date: "2025-03-01", author: "ada" }),
    post({ title: "Packing light", category: "Travel", date: "2025-01-01", body: "Tips for your next trip" }),
  ];

  it("sorts newest first by default", () => {
    expect(filterPosts(posts, {}).map((p) => p.category)).toEqual(["Food", "Technology", "Travel"]);
  });

  it("sorts oldest first", () => {
    expect(filterPosts(posts, { sort: "oldest" }).map((p) => p.category)).toEqual(["Travel", "Technology", "Food"]);
  });

  it("filters by category, case-insensitively", () => {
    expect(filterPosts(posts, { category: "food" })).toHaveLength(1);
  });

  it("searches title, author, body and tags", () => {
    expect(filterPosts(posts, { q: "LAGOS" })[0].title).toBe("Street food in Lagos");
    expect(filterPosts(posts, { q: "ada" })[0].title).toBe("Street food in Lagos");
    expect(filterPosts(posts, { q: "next trip" })[0].title).toBe("Packing light");
    expect(filterPosts(posts, { q: "react" })[0].title).toBe("React hooks in depth");
    expect(filterPosts(posts, { q: "nothing matches" })).toEqual([]);
  });

  it("does not mutate the input", () => {
    const copy = [...posts];
    filterPosts(posts, { sort: "oldest" });
    expect(posts).toEqual(copy);
  });
});

describe("initials", () => {
  it("builds up to two initials", () => {
    expect(initials("damilola", "adebowale")).toBe("DA");
    expect(initials("", undefined)).toBe("?");
  });
});
