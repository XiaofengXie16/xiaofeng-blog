import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import path from "path";
import fs from "fs/promises";
import { markdownPreview, parseMarkdown } from "~/utils/markdown";

import { BlogCard } from "~/components/Card";
import { BLOG_FOLDER_PATH } from "~/constants/blog";

export const loader: LoaderFunction = async () => {
  const filenames = await fs.readdir(BLOG_FOLDER_PATH);

  const posts = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".md"))
      .map(async (filename) => {
        const filePath = path.join(BLOG_FOLDER_PATH, filename);
        const content = await fs.readFile(filePath, "utf-8");
        const { frontMatter, html } = parseMarkdown(content);
        return {
          filename,
          title: frontMatter.title,
          slug: frontMatter.slug,
          preview: markdownPreview(content, 400),
          html,
        };
      }),
  );
  console.log(posts);
  return { posts };
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <main
      className={
        "flex h-screen w-screen flex-col items-center overflow-auto overflow-x-hidden bg-gray-700 pt-20 pr-5 pl-5"
      }
    >
      <section className={"md:ml-40 md:mr-40"}>
        <Link
          to={"/"}
          className={
            "mb-10 block items-start text-2xl font-extrabold text-white hover:underline text-center sm:text-left"
          }
        >
          Read, Think and Code
        </Link>
        <h1
          className={
            "mb-10 text-4xl font-extrabold text-pink-200 text-center sm:text-left"
          }
        >
          Blogs
        </h1>
        <ul className={"flex list-none flex-col items-start gap-5 pb-20"}>
          {posts.map(
            ({
              filename,
              preview,
              title,
              slug,
            }: {
              filename: string;
              preview: string;
              title: string;
              slug: string;
            }) => (
              <BlogCard
                key={filename}
                description={preview}
                name={title}
                link={`/blog/${slug}`}
              />
            ),
          )}
        </ul>
      </section>
    </main>
  );
}
