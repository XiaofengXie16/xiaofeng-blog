import { describe, it, expect } from 'vitest';
import { parseMarkdownWithPreview } from '../utils/markdown';

describe('Markdown Utilities', () => {
  describe('parseMarkdownWithPreview', () => {
    it('should handle markdown without frontmatter', () => {
      const markdown = '# Heading\n\nThis is a paragraph.';
      const result = parseMarkdownWithPreview(markdown);

      expect(result.frontMatter).toEqual({});
      expect(result.html).toContain('<h1>Heading</h1>');
      expect(result.html).toContain('<p>This is a paragraph.</p>');
      expect(result.preview).toContain('Heading');
    });

    it('should handle empty markdown', () => {
      const result = parseMarkdownWithPreview('');

      expect(result.frontMatter).toEqual({});
      expect(result.html).toBe('');
      expect(result.preview).toBe('');
    });

    it('should handle markdown with only frontmatter', () => {
      const markdown = `---
title: Test
date: 2023-01-01
---`;
      const result = parseMarkdownWithPreview(markdown);

      expect(result.frontMatter).toEqual({
        title: 'Test',
        date: '2023-01-01'
      });
      expect(result.html).toBe('');
      expect(result.preview).toBe('');
    });

    it('should process Date objects in frontmatter', () => {
      const dateObj = new Date('2023-01-01');
      const markdown = `---
title: Test
date: ${dateObj.toISOString()}
---

Content here`;
      
      const result = parseMarkdownWithPreview(markdown);

      expect(result.frontMatter.date).toBe('2023-01-01');
    });

    it('should handle special markdown elements', () => {
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

      expect(result.html).toContain('<h1>Heading 1</h1>');
      expect(result.html).toContain('<h2>Heading 2</h2>');
      expect(result.html).toContain('<strong>Bold text</strong>');
      expect(result.html).toContain('<em>italic text</em>');
      expect(result.html).toContain('<ul>');
      expect(result.html).toContain('<li>List item 1</li>');
      expect(result.html).toContain('<code>inline code</code>');
      expect(result.html).toContain('<pre><code>code block');
      expect(result.html).toContain('<a href="https://example.com">Link</a>');
    });

    it('should preserve link formatting', () => {
      const markdown = 'Visit [Google](https://google.com) for search.';
      const result = parseMarkdownWithPreview(markdown);

      expect(result.html).toContain('href="https://google.com"');
      expect(result.html).toContain('>Google</a>');
    });
  });
});
