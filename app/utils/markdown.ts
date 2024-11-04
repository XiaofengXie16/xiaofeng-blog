import MarkdownIt from "markdown-it";
import matter from "gray-matter";

const md = new MarkdownIt();

export const parseMarkdownWithPreview = (
  markdownText: string,
  previewLength = 200,
) => {
  const { data, content } = matter(markdownText);

  const html = md.render(content);

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
