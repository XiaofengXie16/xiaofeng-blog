import fs from "fs/promises";
import path from "path";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { LoaderFunction } from "@remix-run/node";
import { BLOG_FOLDER_PATH } from "~/constants/blog";
import {parseMarkdownWithPreview} from "~/utils/markdown";

type LoaderData = {
  title: string;
  date: string;
  content: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  invariant(slug, "Expected 'slug' parameter");

  const folderPath = BLOG_FOLDER_PATH;
  const filenames = await fs.readdir(folderPath);

  const matchingFile = filenames.find(
    (filename) => filename.endsWith(".md") && filename.includes(slug),
  );
  if (!matchingFile) {
    throw new Response("Blog post not found", { status: 404 });
  }

  const filePath = path.join(folderPath, matchingFile);
  const fileContent = await fs.readFile(filePath, "utf-8");
  const { frontMatter, html } = parseMarkdownWithPreview(fileContent,400);

  return {
    title: frontMatter.title || slug,
    content: html,
  };
};

export default function BlogPost() {
  const { title, content } = useLoaderData<LoaderData>();

  return (
    <main
      className={
        "flex h-screen w-screen flex-col items-center overflow-auto overflow-x-hidden bg-gray-700 pt-20 pr-5 pl-5"
      }
    >
      <section className={"ml-40 mr-40"}>
        <Link
          to={"/"}
          className={
            "mb-10 block items-start text-2xl font-extrabold text-white hover:underline text-center sm:text-left"
          }
        >
          Read, Think and Code
        </Link>
        <div className="bg-gray-700 text-gray-300 min-h-screen flex justify-center px-5">
          <article className="max-w-4xl w-full">
            <h1 className="text-4xl font-extrabold text-pink-200 mb-20">
              {title}
            </h1>
            <div
              className="prose prose-invert max-w-none text-gray-300 text-lg pb-20"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        </div>
      </section>
    </main>
  );
}
