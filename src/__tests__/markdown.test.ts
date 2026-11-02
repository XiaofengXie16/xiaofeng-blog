import { describe, it, expect } from "bun:test";
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

describe("parseMarkdownWithPreview edge cases", () => {
  describe("input shapes", () => {
    it("should handle markdown without frontmatter", () => {
      const markdown = "# Heading\n\nThis is a paragraph.";
      const result = parseMarkdownWithPreview(markdown);

      expect(result.frontMatter).toEqual({});
      expect(result.html).toContain("<h1>Heading</h1>");
      expect(result.html).toContain("<p>This is a paragraph.</p>");
      expect(result.preview).toContain("Heading");
    });

    it("should handle empty markdown", () => {
      const result = parseMarkdownWithPreview("");

      expect(result.frontMatter).toEqual({});
      expect(result.html).toBe("");
      expect(result.preview).toBe("");
    });

    it("should handle markdown with only frontmatter", () => {
      const markdown = `---
title: Test
date: 2023-01-01
---`;
      const result = parseMarkdownWithPreview(markdown);

      expect(result.frontMatter).toEqual({
        title: "Test",
        date: "2023-01-01",
      });
      expect(result.html).toBe("");
      expect(result.preview).toBe("");
    });

    it("should process Date objects in frontmatter", () => {
      const dateObj = new Date("2023-01-01");
      const markdown = `---
title: Test
date: ${dateObj.toISOString()}
---

Content here`;

      const result = parseMarkdownWithPreview(markdown);

      expect(result.frontMatter.date).toBe("2023-01-01");
    });

    it("should handle special markdown elements", () => {
      const markdown = `---
title: Test
---

# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2

\`inline code\`

\`\`\`
code block
\`\`\`

[Link](https://example.com)`;

      const result = parseMarkdownWithPreview(markdown);

      expect(result.html).toContain("<h1>Heading 1</h1>");
      expect(result.html).toContain("<h2>Heading 2</h2>");
      expect(result.html).toContain("<strong>Bold text</strong>");
      expect(result.html).toContain("<em>italic text</em>");
      expect(result.html).toContain("<ul>");
      expect(result.html).toContain("<li>List item 1</li>");
      expect(result.html).toContain("<code>inline code</code>");
      expect(result.html).toContain("<pre><code>code block");
      expect(result.html).toContain('<a href="https://example.com">Link</a>');
    });

    it("should preserve link formatting", () => {
      const markdown = "Visit [Google](https://google.com) for search.";
      const result = parseMarkdownWithPreview(markdown);

      expect(result.html).toContain('href="https://google.com"');
      expect(result.html).toContain(">Google</a>");
    });
  });
});
