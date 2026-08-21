import { describe, expect, it } from "vite-plus/test";
import { getAllBlogPostSummaries, getAllBlogPosts, getBlogPostBySlug } from "../utils/blogData";

describe("blogData", () => {
  it("should expose normalized metadata for all posts", () => {
    const posts = getAllBlogPosts();

    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(post.filename).toMatch(/\.md$/);
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.preview).toBeTruthy();
      expect(Array.isArray(post.tags)).toBe(true);
    }
  });

  it("should sort posts deterministically", () => {
    const posts = getAllBlogPosts();
    const sorted = [...posts].sort((a, b) => {
      if (a.date && b.date && a.date !== b.date) return b.date.localeCompare(a.date);
      if (a.date && !b.date) return -1;
      if (!a.date && b.date) return 1;
      return a.title.localeCompare(b.title);
    });

    expect(posts.map((post) => post.slug)).toEqual(sorted.map((post) => post.slug));
  });

  it("should find posts by slug", () => {
    const [firstPost] = getAllBlogPosts();

    expect(firstPost).toBeDefined();
    expect(getBlogPostBySlug(firstPost.slug)?.title).toBe(firstPost.title);
    expect(getBlogPostBySlug("missing-post")).toBeUndefined();
  });

  it("should omit rendered html from list summaries", () => {
    const summaries = getAllBlogPostSummaries();
    const posts = getAllBlogPosts();

    expect(summaries).toHaveLength(posts.length);
    for (const summary of summaries) {
      // The list payload must not carry article bodies.
      expect(summary).not.toHaveProperty("html");
    }
  });

  it("should keep the metadata the list view renders", () => {
    const [summary] = getAllBlogPostSummaries();
    const [post] = getAllBlogPosts();

    expect(summary).toBeDefined();
    expect(post).toBeDefined();
    expect(summary?.slug).toBe(post?.slug);
    expect(summary?.title).toBe(post?.title);
    expect(summary?.preview).toBe(post?.preview);
    expect(summary?.tags).toEqual(post?.tags);
    expect(summary?.date).toBe(post?.date);
  });
});
