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

  return {
    frontMatter: data,
    html,
    preview,
  };
};
