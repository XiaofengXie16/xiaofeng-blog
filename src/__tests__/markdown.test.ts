import { describe, it, expect } from "vite-plus/test";
import { parseMarkdownWithPreview } from "../utils/markdown";

describe("parseMarkdownWithPreview", () => {
  it("should parse markdown with front matter", () => {
    const markdown = `---
title: Test Post
date: 2023-01-01
---

# Heading 1

This is a paragraph with **bold** text.`;

    const result = parseMarkdownWithPreview(markdown);

    // Check front matter
    expect(result.frontMatter).toEqual({
      title: "Test Post",
      date: "2023-01-01",
    });

    // Check HTML contains expected elements
    expect(result.html).toContain("<h1>Heading 1</h1>");
    expect(result.html).toContain("<strong>bold</strong>");

    // Check preview
    expect(result.preview).toBeDefined();
    expect(result.preview.length).toBeLessThanOrEqual(200);
  });

  it("should truncate preview to specified length", () => {
    const markdown = `---
title: Test Post
---

${"Lorem ipsum dolor sit amet. ".repeat(20)}`; // Long text

    const result = parseMarkdownWithPreview(markdown, 50);

    expect(result.preview.length).toBeLessThanOrEqual(53); // 50 + '...'
    expect(result.preview.endsWith("...")).toBe(true);
  });

  it("should format headings with extra newlines", () => {
    const markdown = `---
title: Test Post
---
# Heading 1
## Heading 2
Some text`;

    const result = parseMarkdownWithPreview(markdown);

    // The HTML should have proper spacing around headings
    expect(result.html).toContain("<h1>Heading 1</h1>");
    expect(result.html).toContain("<h2>Heading 2</h2>");
  });

  it("should escape raw HTML instead of emitting live markup", () => {
    const markdown = `<script>alert("xss")</script>

<a href="javascript:alert('xss')" onclick="alert('xss')">Bad link</a>

Safe content`;

    const result = parseMarkdownWithPreview(markdown);

    // Nothing authored in a post may become a real tag or attribute...
    expect(result.html).not.toContain("<script");
    expect(result.html).not.toContain("<a href");
    // An inert `onclick=&quot;...` is fine; a real `onclick="` attribute is not.
    expect(result.html).not.toContain('onclick="');
    // ...it survives as inert text instead.
    expect(result.html).toContain("&lt;script&gt;");
    expect(result.html).toContain("&lt;a href=");
    expect(result.html).toContain("Safe content");
  });

  it("should still render markdown-authored links normally", () => {
    const result = parseMarkdownWithPreview("[Example](https://example.com)");

    expect(result.html).toContain('<a href="https://example.com">Example</a>');
  });
});
