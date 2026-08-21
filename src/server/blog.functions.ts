import { createServerFn } from "@tanstack/react-start";
import { getAllBlogPostSummaries, getBlogPostBySlug } from "~/utils/blogData";

function validateSlugInput(input: unknown): string {
  if (typeof input !== "string" || !input.trim()) {
    throw new Error("Expected a non-empty blog slug");
  }
  return input.trim();
}

export const fetchAllBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  return getAllBlogPostSummaries();
});

export const fetchBlogPostBySlug = createServerFn({ method: "GET" })
  .validator(validateSlugInput)
  .handler(async ({ data: slug }) => {
    return getBlogPostBySlug(slug) ?? null;
  });
