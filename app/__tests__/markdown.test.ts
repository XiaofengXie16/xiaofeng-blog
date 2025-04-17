import { describe, it, expect } from 'vitest';
import { parseMarkdownWithPreview } from '../utils/markdown';

describe('parseMarkdownWithPreview', () => {
  it('should parse markdown with front matter', () => {
    const markdown = `---
title: Test Post
date: 2023-01-01
---

# Heading 1

This is a paragraph with **bold** text.`;

    const result = parseMarkdownWithPreview(markdown);

    // Check front matter
    expect(result.frontMatter).toEqual({
      title: 'Test Post',
      date: '2023-01-01'
    });

    // Check HTML contains expected elements
    expect(result.html).toContain('<h1>Heading 1</h1>');
    expect(result.html).toContain('<strong>bold</strong>');

    // Check preview
    expect(result.preview).toBeDefined();
    expect(result.preview.length).toBeLessThanOrEqual(200);
  });

  it('should truncate preview to specified length', () => {
    const markdown = `---
title: Test Post
---

${'Lorem ipsum dolor sit amet. '.repeat(20)}`; // Long text

    const result = parseMarkdownWithPreview(markdown, 50);
    
    expect(result.preview.length).toBeLessThanOrEqual(53); // 50 + '...'
    expect(result.preview.endsWith('...')).toBe(true);
  });

  it('should format headings with extra newlines', () => {
    const markdown = `---
title: Test Post
---
# Heading 1
## Heading 2
Some text`;

    const result = parseMarkdownWithPreview(markdown);
    
    // The HTML should have proper spacing around headings
    expect(result.html).toContain('<h1>Heading 1</h1>');
    expect(result.html).toContain('<h2>Heading 2</h2>');
  });
});
