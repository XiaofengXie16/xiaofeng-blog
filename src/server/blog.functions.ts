import { createServerFn } from "@tanstack/react-start";
import { getAllBlogPosts, getBlogPostBySlug } from "~/utils/blogData";

export const fetchAllBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  return getAllBlogPosts();
});

export const fetchBlogPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: string) => input)
  .handler(async ({ data: slug }) => {
    return getBlogPostBySlug(slug) ?? null;
  });
