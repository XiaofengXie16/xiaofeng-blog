import { describe, expect, test } from "bun:test";
import { buildRss, buildSitemap, escapeXml, toRfc822 } from "~/utils/feeds";

const posts = [
  {
    slug: "a-b",
    title: "Tom & Jerry <3",
    date: "2025-10-13",
    preview: "preview",
    description: 'It\'s "quoted"',
    tags: ["x&y"],
  },
  { slug: "undated", title: "Undated", preview: "Just a preview", tags: [] },
];

test("escapeXml escapes the five XML specials", () => {
  expect(escapeXml(`<a href="x">Tom's & co</a>`)).toBe(
    "&lt;a href=&quot;x&quot;&gt;Tom&apos;s &amp; co&lt;/a&gt;",
  );
});

test("toRfc822 formats valid dates and ignores bad ones", () => {
  expect(toRfc822("2025-10-13")).toBe("Mon, 13 Oct 2025 00:00:00 GMT");
  expect(toRfc822("not a date")).toBeUndefined();
  expect(toRfc822(undefined)).toBeUndefined();
});

describe("buildSitemap", () => {
  const xml = buildSitemap({ origin: "https://site.dev", paths: ["/", "/blog"], posts });

  test("lists pages and posts, with lastmod only for dated posts", () => {
    expect(xml).toContain("<url><loc>https://site.dev/</loc></url>");
    expect(xml).toContain("<url><loc>https://site.dev/blog</loc></url>");
    expect(xml).toContain(
      "<url><loc>https://site.dev/blog/a-b</loc><lastmod>2025-10-13</lastmod></url>",
    );
    expect(xml).toContain("<url><loc>https://site.dev/blog/undated</loc></url>");
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });
});

describe("buildRss", () => {
  const xml = buildRss({ origin: "https://site.dev", title: "T", description: "D", posts });

  test("has a channel with a self link", () => {
    expect(xml).toContain("<title>T</title>");
    expect(xml).toContain('<atom:link href="https://site.dev/rss.xml" rel="self"');
  });

  test("escapes item fields and includes dates and categories when present", () => {
    expect(xml).toContain("<title>Tom &amp; Jerry &lt;3</title>");
    expect(xml).toContain("<description>It&apos;s &quot;quoted&quot;</description>");
    expect(xml).toContain("<pubDate>Mon, 13 Oct 2025 00:00:00 GMT</pubDate>");
    expect(xml).toContain("<category>x&amp;y</category>");
  });

  test("falls back to the preview and omits pubDate when undated", () => {
    const undated = xml.slice(xml.indexOf("<title>Undated</title>"));
    expect(undated).toContain("<description>Just a preview</description>");
    expect(undated).not.toContain("<pubDate>");
  });
});
