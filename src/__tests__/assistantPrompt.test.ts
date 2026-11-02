import { describe, expect, test } from "bun:test";
import { askAIInputSchema, buildSystemPrompt, normalizeActions } from "~/server/assistant";

describe("askAIInputSchema", () => {
  test("trims and truncates the query", () => {
    const { query } = askAIInputSchema.parse({ query: `  ${"x".repeat(1_200)}  ` });
    expect(query).toHaveLength(1_000);
  });

  test("rejects an empty or missing query", () => {
    expect(askAIInputSchema.safeParse({ query: "   " }).success).toBe(false);
    expect(askAIInputSchema.safeParse({}).success).toBe(false);
    expect(askAIInputSchema.safeParse(null).success).toBe(false);
  });

  test("keeps the last six valid history turns and drops malformed ones", () => {
    const turns = Array.from({ length: 8 }, (_, i) => ({ role: "user", content: `q${i}` }));
    const { history } = askAIInputSchema.parse({
      query: "hi",
      history: [{ role: "system", content: "no" }, 42, ...turns],
    });
    expect(history.map((t) => t.content)).toEqual(["q2", "q3", "q4", "q5", "q6", "q7"]);
  });

  test("history is optional", () => {
    expect(askAIInputSchema.parse({ query: "hi" }).history).toEqual([]);
  });
});

describe("normalizeActions", () => {
  test("keeps internal navigation and http(s) links only", () => {
    expect(
      normalizeActions([
        { type: "navigate", path: "/blog", label: "Blog" },
        { type: "navigate", path: "//evil.example" },
        { type: "navigate", path: "blog" },
        { type: "open", url: "https://bun.sh" },
        { type: "open", url: "javascript:alert(1)" },
        { type: "open" },
      ]),
    ).toEqual([
      { type: "navigate", path: "/blog", label: "Blog" },
      { type: "open", url: "https://bun.sh", label: undefined },
    ]);
  });

  test("shortens long labels", () => {
    const [action] = normalizeActions([{ type: "navigate", path: "/", label: "x".repeat(200) }]);
    expect(action?.label).toHaveLength(80);
  });
});

describe("buildSystemPrompt", () => {
  const prompt = buildSystemPrompt({
    siteUrl: "https://www.xiaofengxie.dev",
    tools: [{ name: "Warp", category: "Terminal utility", description: "A terminal" }],
    books: [{ name: "Simply Said" }],
    posts: [{ title: "Hello", slug: "hello", preview: "First post" }],
  });

  test("names the real site and lists its content", () => {
    expect(prompt).toContain("(www.xiaofengxie.dev)");
    expect(prompt).toContain("- Warp (Terminal utility): A terminal");
    expect(prompt).toContain("- Simply Said");
    expect(prompt).toContain('- "Hello" (slug: hello): First post');
  });

  test("says so when a list is empty", () => {
    const empty = buildSystemPrompt({ siteUrl: "https://a.dev", tools: [], books: [], posts: [] });
    expect(empty).toContain("Blog posts unavailable");
  });
});
