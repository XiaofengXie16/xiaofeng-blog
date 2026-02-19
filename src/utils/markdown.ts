import matter from "gray-matter";

export const parseMarkdownWithPreview = (markdownText: string, previewLength = 200) => {
  const { data, content } = matter(markdownText);

  // Add newlines before headings for better spacing
  const formattedContent = content.replace(/^(#{1,6})\s/gm, "\n$1 ").replace(/\n\n\n+/g, "\n\n");

  const html = Bun.markdown.html(formattedContent, {
    autolinks: true,
    hardSoftBreaks: true,
  });

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
