import { describe, expect, test } from "bun:test";
import { articleJsonLd, getSiteUrl, pageMeta } from "~/constants/site";

describe("site URL", () => {
  test("defaults to the real domain, not the Fly origin", () => {
    const original = process.env.SITE_URL;
    delete process.env.SITE_URL;
    expect(getSiteUrl()).toBe("https://www.xiaofengxie.dev");
    process.env.SITE_URL = "https://preview.example/";
    expect(getSiteUrl()).toBe("https://preview.example");
    if (original === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = original;
  });
});

describe("pageMeta", () => {
  test("canonical and og:url point at the page on the real domain", () => {
    const { meta, links } = pageMeta({ title: "T", description: "D", path: "/blog" });
    expect(links).toEqual([{ rel: "canonical", href: "https://www.xiaofengxie.dev/blog" }]);
    expect(meta).toContainEqual({
      property: "og:url",
      content: "https://www.xiaofengxie.dev/blog",
    });
    expect(meta.some((m) => "property" in m && m.property === "article:published_time")).toBe(
      false,
    );
  });

  test("articles carry their published time", () => {
    const { meta } = pageMeta({
      title: "T",
      description: "D",
      path: "/blog/x",
      type: "article",
      publishedTime: "2025-10-13",
    });
    expect(meta).toContainEqual({ property: "article:published_time", content: "2025-10-13" });
  });
});

describe("articleJsonLd", () => {
  test("describes the post and cannot break out of its script tag", () => {
    const script = articleJsonLd({
      title: "</script><b>hi</b>",
      description: "D",
      slug: "x",
      date: "2025-10-13",
      tags: ["a", "b"],
    });
    expect(script.type).toBe("application/ld+json");
    expect(script.children).not.toContain("<");
    const data = JSON.parse(script.children);
    expect(data).toMatchObject({
      "@type": "BlogPosting",
      headline: "</script><b>hi</b>",
      datePublished: "2025-10-13",
      url: "https://www.xiaofengxie.dev/blog/x",
      keywords: "a, b",
    });
  });
});
