import { describe, expect, test } from "bun:test";
import { buildSearchIndex, fuzzyScore, searchItems } from "~/utils/search";

const index = buildSearchIndex({
  pages: [
    { to: "/", label: "Home", description: "Go to the landing page" },
    { to: "/blog", label: "Writing", description: "Browse all blog posts" },
  ],
  tools: [
    { name: "Warp", description: "A modern terminal".repeat(10), link: "https://warp.dev" },
    { name: "Bun", description: "Fast JavaScript runtime", link: "https://bun.sh" },
  ],
  books: [{ name: "A Philosophy of Software Design", link: "https://example.com/apos" }],
});

describe("buildSearchIndex", () => {
  test("pages navigate, tools and books open links", () => {
    expect(index.map((i) => i.kind)).toEqual(["page", "page", "tool", "tool", "book"]);
    expect(index[1]).toMatchObject({ to: "/blog" });
    expect(index[2]).toMatchObject({ href: "https://warp.dev" });
  });

  test("long tool descriptions are truncated", () => {
    expect(index[2]?.description).toHaveLength(123);
    expect(index[2]?.description.endsWith("...")).toBe(true);
    expect(index[3]?.description).toBe("Fast JavaScript runtime");
  });
});

describe("fuzzyScore", () => {
  test("ranks substring > in-order letters > nothing", () => {
    const substring = fuzzyScore("soft", "A Philosophy of Software Design");
    const letters = fuzzyScore("wrp", "Warp");
    expect(substring).toBeGreaterThan(letters);
    expect(letters).toBe(30);
    expect(fuzzyScore("xyz", "Warp")).toBe(0);
    expect(fuzzyScore("", "Warp")).toBe(0);
  });

  test("is case-insensitive and prefers shorter targets", () => {
    expect(fuzzyScore("BUN", "bun")).toBeGreaterThan(fuzzyScore("bun", "bundle everything"));
  });
});

describe("searchItems", () => {
  test("an empty query lists the pages", () => {
    expect(searchItems(index, "  ").map((i) => i.label)).toEqual(["Home", "Writing"]);
  });

  test("returns ranked matches across kinds, capped by limit", () => {
    expect(searchItems(index, "bun")[0]?.label).toBe("Bun");
    expect(searchItems(index, "software")[0]?.kind).toBe("book");
    expect(searchItems(index, "a", 2)).toHaveLength(2);
    expect(searchItems(index, "qqq")).toEqual([]);
  });
});
