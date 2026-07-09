import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import invariant from "tiny-invariant";

import { fetchBlogPostBySlug } from "~/server/blog.functions";

type LoaderData = {
  title: string;
  content: string;
  description: string;
  slug: string;
  date?: string;
  tags: string[];
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;
    invariant(slug, "Expected 'slug' parameter");

    const post = await fetchBlogPostBySlug({ data: slug });

    if (!post) {
      throw notFound();
    }

    return {
      title: post.title,
      content: post.html,
      description: post.description ?? post.preview,
      slug,
      date: post.date,
      tags: post.tags,
    } satisfies LoaderData;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Blog Post"} | Xiaofeng Xie` },
      {
        name: "description",
        content: loaderData?.description ?? "Software engineering article by Xiaofeng Xie.",
      },
      { property: "og:title", content: `${loaderData?.title ?? "Blog Post"} | Xiaofeng Xie` },
      {
        property: "og:description",
        content: loaderData?.description ?? "Software engineering article by Xiaofeng Xie.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: BlogPost,
  notFoundComponent: PostNotFound,
});

function PostNotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center animate-fade-in">
      <p className="terminal-text text-sm text-text-muted mb-4">404</p>
      <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-4">Post not found</h1>
      <p className="text-lg text-text-muted mb-10">
        This post doesn't exist — it may have been moved or removed.
      </p>
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border-subtle text-text-main hover:bg-surface transition-colors"
      >
        ← Back to all posts
      </Link>
    </div>
  );
}

function BlogPost() {
  const { title, content, date, tags } = Route.useLoaderData();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in">
      {/* Back link */}
      <nav className="mb-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
        >
          ← All posts
        </Link>
      </nav>

      <article>
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main leading-tight mb-5">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
            <span>Xiaofeng Xie</span>
            {date && (
              <>
                <span aria-hidden="true">·</span>
                <time className="terminal-text text-xs">{date}</time>
              </>
            )}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
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
        </header>

        {/* Content */}
        <div
          className="
            prose prose-invert prose-lg max-w-none

            /* Headings */
            prose-headings:text-text-main prose-headings:font-semibold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-5
            prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
            prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3

            /* Body */
            prose-p:text-text-main/85 prose-p:leading-relaxed
            prose-ul:text-text-main/85 prose-ol:text-text-main/85 prose-li:my-1.5
            marker:text-text-muted

            /* Links */
            prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/30
            hover:prose-a:border-primary

            /* Emphasis */
            prose-strong:text-text-main prose-strong:font-semibold
            prose-em:text-text-main

            /* Code */
            prose-code:text-primary-hover prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.875em] prose-code:font-normal
            prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-surface prose-pre:border prose-pre:border-border-subtle prose-pre:rounded-lg prose-pre:p-5

            /* Blockquotes */
            prose-blockquote:border-l-2 prose-blockquote:border-primary/50 prose-blockquote:text-text-muted prose-blockquote:not-italic

            /* Images & rules */
            prose-img:rounded-lg prose-img:border prose-img:border-border-subtle prose-img:my-10
            prose-hr:border-border-subtle prose-hr:my-14
          "
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border-subtle">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
          >
            ← All posts
          </Link>
        </footer>
      </article>
    </div>
  );
}
