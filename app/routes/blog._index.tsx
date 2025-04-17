import { LoaderFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import path from "path";
import fs from "fs/promises";
import { parseMarkdownWithPreview } from "~/utils/markdown";

import { BlogCard } from "~/components/Card";
import { BLOG_FOLDER_PATH } from "~/constants/blog";

type Post = {
  filename: string;
  title: string;
  slug: string;
  preview: string;
  html: string;
};

export const loader: LoaderFunction = async () => {
  const filenames = await fs.readdir(BLOG_FOLDER_PATH);

  const posts = await Promise.all(
    filenames
      .filter((filename: string) => filename.endsWith(".md"))
      .map(async (filename: string) => {
        const filePath = path.join(BLOG_FOLDER_PATH, filename);
        const content = await fs.readFile(filePath, "utf-8");
        const { frontMatter, html, preview } = parseMarkdownWithPreview(
          content,
          400,
        );
        return {
          filename,
          title: frontMatter.title,
          slug: frontMatter.slug,
          preview,
          html,
        };
      }),
  );
  return { posts };
};

export default function Posts() {
  const { posts } = useLoaderData<{ posts: Post[] }>();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <nav className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center text-xl font-medium text-gray-200 hover:text-pink-200 transition-colors"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Read, Think and Code
          </Link>
        </nav>

        <h1 className="mb-12 text-4xl font-bold tracking-tight text-pink-200 sm:text-5xl">
          Blogs
        </h1>

        <div className="space-y-8">
          {posts.map(({filename, preview, title, slug}) => (
            <BlogCard
              key={filename}
              description={preview}
              name={title}
              link={`/blog/${slug}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
