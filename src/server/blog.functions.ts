import { createServerFn } from "@tanstack/react-start";
import { getAllBlogPosts, getBlogPostBySlug } from "~/utils/blogData";

function validateSlugInput(input: unknown): string {
  if (typeof input !== "string" || !input.trim()) {
    throw new Error("Expected a non-empty blog slug");
  }
  return input.trim();
}

export const fetchAllBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  return getAllBlogPosts();
});

export const fetchBlogPostBySlug = createServerFn({ method: "GET" })
  .inputValidator(validateSlugInput)
  .handler(async ({ data: slug }) => {
    return getBlogPostBySlug(slug) ?? null;
  });
