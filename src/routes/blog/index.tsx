import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchAllBlogPosts } from "~/server/blog.functions";

export const Route = createFileRoute("/blog/")({
  loader: async () => ({ posts: await fetchAllBlogPosts() }),
  head: () => ({
    meta: [
      { title: "Blog | Xiaofeng Xie" },
      {
        name: "description",
        content:
          "Software engineering articles by Xiaofeng Xie on architecture, frontend systems, and developer tooling.",
      },
      { property: "og:title", content: "Blog | Xiaofeng Xie" },
      {
        property: "og:description",
        content:
          "Software engineering articles by Xiaofeng Xie on architecture, frontend systems, and developer tooling.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Posts,
});

function Posts() {
  const { posts } = Route.useLoaderData();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-fade-in">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main">Writing</h1>
        <p className="mt-4 text-lg text-text-muted max-w-2xl">
          Thoughts on software engineering, architecture, and the tools we build with.
        </p>
      </header>

      {/* Posts */}
      <div className="divide-y divide-border-subtle">
        {posts.map(({ date, filename, preview, tags, title, slug }) => (
          <Link
            key={filename}
            to="/blog/$slug"
            params={{ slug }}
            className="group block py-8 first:pt-0"
          >
            <article className="flex flex-col sm:flex-row gap-2 sm:gap-8">
              {date && (
                <span className="terminal-text text-xs text-text-muted shrink-0 sm:w-24 sm:pt-1.5">
                  {date}
                </span>
              )}
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-text-main group-hover:text-primary transition-colors leading-snug">
                  {title}
                </h2>
                <p className="mt-2 text-text-muted leading-relaxed line-clamp-3">{preview}</p>
                {tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="terminal-text text-xs text-text-muted px-2 py-0.5 rounded border border-border-subtle bg-surface"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-text-muted">No posts yet — check back soon.</p>
        </div>
      )}
    </div>
  );
}
