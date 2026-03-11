import { parseMarkdownWithPreview } from "~/utils/markdown";

type BlogPost = {
  filename: string;
  slug: string;
  title: string;
  html: string;
  preview: string;
};

const markdownFiles = import.meta.glob("../blogs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parsePost(filePath: string, rawContent: string): BlogPost {
  const filename = filePath.split("/").pop() ?? filePath;
  const { frontMatter, html, preview } = parseMarkdownWithPreview(rawContent, 400);

  const frontMatterTitle = typeof frontMatter.title === "string" ? frontMatter.title.trim() : "";
  const frontMatterSlug = typeof frontMatter.slug === "string" ? frontMatter.slug.trim() : "";

  const slug = frontMatterSlug || filename.replace(/\.md$/, "");
  const title = frontMatterTitle || slug;

  return {
    filename,
    slug,
    title,
    html,
    preview,
  };
}

// Lazy-initialize posts to avoid running gray-matter/Bun.markdown on the client
let _posts: BlogPost[] | null = null;
function getPosts(): BlogPost[] {
  if (!_posts) {
    _posts = Object.entries(markdownFiles).map(([filePath, rawContent]) =>
      parsePost(filePath, rawContent),
    );
  }
  return _posts;
}

export const getAllBlogPosts = (): BlogPost[] => [...getPosts()];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined =>
  getPosts().find((post) => post.slug === slug);
