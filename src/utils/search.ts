/** Command-palette search: a flat index of pages, tools and books, ranked by a small fuzzy matcher. */

export type SearchKind = "page" | "tool" | "book";

export type SearchItem = {
  kind: SearchKind;
  label: string;
  description: string;
} & ({ to: string; href?: never } | { href: string; to?: never });

type Sources = {
  pages: readonly { to: string; label: string; description: string }[];
  tools: readonly { name: string; description: string; link: string }[];
  books: readonly { name: string; link: string }[];
};

const DESCRIPTION_LENGTH = 120;

export function buildSearchIndex({ pages, tools, books }: Sources): SearchItem[] {
  return [
    ...pages.map((p): SearchItem => ({
      kind: "page",
      label: p.label,
      description: p.description,
      to: p.to,
    })),
    ...tools.map((t): SearchItem => ({
      kind: "tool",
      label: t.name,
      description: truncate(t.description, DESCRIPTION_LENGTH),
      href: t.link,
    })),
    ...books.map((b): SearchItem => ({
      kind: "book",
      label: b.name,
      description: "From the reading list",
      href: b.link,
    })),
  ];
}

/**
 * Scores how well `query` matches `target` (0 = no match). Substring matches
 * rank highest (shorter targets first), then in-order character matches.
 */
export function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (!q) return 0;
  if (t.includes(q)) return 100 + (q.length / t.length) * 50;
  let qi = 0;
  let score = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 10;
      qi++;
    }
  }
  return qi === q.length ? score : 0;
}

/** The best matches for `query`; an empty query lists the pages. */
export function searchItems(items: readonly SearchItem[], query: string, limit = 12): SearchItem[] {
  const q = query.trim();
  if (!q) return items.filter((item) => item.kind === "page");
  return items
    .map((item) => ({
      item,
      score: Math.max(fuzzyScore(q, item.label), fuzzyScore(q, item.description) * 0.6),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}
