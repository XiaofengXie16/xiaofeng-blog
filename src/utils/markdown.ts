import matter from "gray-matter";
import { Marked } from "marked";

// Match the options previously passed to Bun.markdown.html:
//   autolinks      -> GFM autolink extension (on by default in `marked` with gfm:true)
//   hardSoftBreaks -> treat single newlines as <br>
const marked = new Marked({ gfm: true, breaks: true });

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*("|')\s*javascript:[\s\S]*?\2/gi, "")
    .replace(/\s(href|src)\s*=\s*javascript:[^\s>]+/gi, "");
}

export const parseMarkdownWithPreview = (markdownText: string, previewLength = 200) => {
  const { data, content } = matter(markdownText);

  // Add newlines before headings for better spacing
  const formattedContent = content.replace(/^(#{1,6})\s/gm, "\n$1 ").replace(/\n\n\n+/g, "\n\n");

  const rawHtml = marked.parse(formattedContent, { async: false }) as string;
  const html = sanitizeHtml(rawHtml);

  const plainText = html.replace(/<[^>]+>/g, "");
  const preview =
    plainText.slice(0, previewLength) + (plainText.length > previewLength ? "..." : "");

  // Convert any Date objects in frontMatter back to strings
  const processedData = { ...data };
  if (processedData.date instanceof Date) {
    processedData.date = processedData.date.toISOString().split("T")[0];
  }

  return {
    frontMatter: processedData,
    html,
    preview,
  };
};
