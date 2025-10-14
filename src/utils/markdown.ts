import MarkdownIt from "markdown-it";
import matter from "gray-matter";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

export const parseMarkdownWithPreview = (
  markdownText: string,
  previewLength = 200,
) => {
  const { data, content } = matter(markdownText);

  // Add newlines before headings for better spacing
  const formattedContent = content
    .replace(/^(#{1,6})\s/gm, '\n$1 ')
    .replace(/\n\n\n+/g, '\n\n'); // Remove excessive newlines

  const html = md.render(formattedContent);

  const plainText = html.replace(/<[^>]+>/g, "");
  const preview =
    plainText.slice(0, previewLength) +
    (plainText.length > previewLength ? "..." : "");

  // Convert any Date objects in frontMatter back to strings
  const processedData = { ...data };
  if (processedData.date instanceof Date) {
    processedData.date = processedData.date.toISOString().split('T')[0];
  }

  return {
    frontMatter: processedData,
    html,
    preview,
  };
};
