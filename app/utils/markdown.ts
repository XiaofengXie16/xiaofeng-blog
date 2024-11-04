import MarkdownIt from 'markdown-it';
import matter from "gray-matter";

const md = new MarkdownIt();

// Convert markdown to HTML and extract a preview (first 200 characters or so)
export function parseMarkdown(markdownText: string) {
    // Parse front matter and content using gray-matter
    const { data, content } = matter(markdownText);
    const html = md.render(content);
    return {
        frontMatter: data, // Contains the front matter as an object
        html,
    };
}


export function markdownPreview(markdownText: string, previewLength = 200): string {
    const { content } = matter(markdownText); // Parse only the content, ignoring front matter
    const renderedText = md.render(content);
    const plainText = renderedText.replace(/<[^>]+>/g, ""); // Remove HTML tags
    return plainText.slice(0, previewLength) + (plainText.length > previewLength ? "..." : "");
}
