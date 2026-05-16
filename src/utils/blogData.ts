import { parseMarkdownWithPreview } from "~/utils/markdown";

export type BlogPost = {
  filename: string;
  slug: string;
  title: string;
  html: string;
  preview: string;
  description?: string;
  date?: string;
  tags: string[];
};

const markdownFiles = import.meta.glob("../blogs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function normalizeString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parsePost(filePath: string, rawContent: string): BlogPost {
  const filename = filePath.split("/").pop() ?? filePath;
  const { frontMatter, html, preview } = parseMarkdownWithPreview(rawContent, 400);

  const frontMatterTitle = normalizeString(frontMatter.title);
  const frontMatterSlug = normalizeString(frontMatter.slug);
  const description = normalizeString(frontMatter.description);
  const date = normalizeString(frontMatter.date);

  const slug = frontMatterSlug || filename.replace(/\.md$/, "");
  const title = frontMatterTitle || slug;

  return {
    filename,
    slug,
    title,
    html,
    preview: description ?? preview,
    description,
    date,
    tags: normalizeTags(frontMatter.tags),
  };
}

function comparePosts(a: BlogPost, b: BlogPost): number {
  if (a.date && b.date && a.date !== b.date) {
    return b.date.localeCompare(a.date);
  }
  if (a.date && !b.date) return -1;
  if (!a.date && b.date) return 1;
  return a.title.localeCompare(b.title);
}

// Lazy-initialize posts to avoid running gray-matter/marked on the client
let _posts: BlogPost[] | null = null;
function getPosts(): BlogPost[] {
  if (!_posts) {
    _posts = Object.entries(markdownFiles)
      .map(([filePath, rawContent]) => parsePost(filePath, rawContent))
      .sort(comparePosts);
  }
  return _posts;
}

export const getAllBlogPosts = (): BlogPost[] => [...getPosts()];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined =>
  getPosts().find((post) => post.slug === slug);
