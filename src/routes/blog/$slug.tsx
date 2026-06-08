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
    <div className="max-w-4xl mx-auto px-6 py-24 text-center animate-fade-in">
      <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 border border-secondary/30 bg-secondary/5">
        <span className="w-2 h-2 bg-secondary animate-pulse" />
        <span className="terminal-text text-xs text-secondary tracking-wider">ERROR_404</span>
      </div>
      <h1 className="text-3xl md:text-5xl font-bold text-text-main mb-4">
        <span className="text-text-main">POST</span>
        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
          {" "}
          NOT_FOUND
        </span>
      </h1>
      <p className="text-lg text-text-muted mb-10 terminal-text">
        <span className="text-primary">&gt;</span> This transmission does not exist in the data
        stream.
      </p>
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 px-6 py-3 cyber-card hover:border-primary/30 transition-all terminal-text text-sm text-text-muted hover:text-primary"
      >
        <span>&gt;</span> BACK_TO_ARCHIVE
      </Link>
    </div>
  );
}

function BlogPost() {
  const { title, content, date, tags, slug } = Route.useLoaderData();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      {/* Navigation Header */}
      <nav className="mb-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 terminal-text text-sm text-text-muted">
            <Link to="/" className="hover:text-primary transition-colors">
              HOME
            </Link>
            <span className="text-primary">/</span>
            <Link to="/blog" className="hover:text-primary transition-colors">
              BLOG
            </Link>
            <span className="text-primary">/</span>
            <span className="text-primary truncate max-w-37.5">
              {slug.slice(0, 20).toUpperCase()}...
            </span>
          </div>

          {/* All Posts Link */}
          <Link
            to="/blog"
            className="group flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all terminal-text text-sm text-text-muted hover:text-primary"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            ALL_POSTS
          </Link>
        </div>
      </nav>

      {/* Article Container */}
      <article className="relative">
        {/* Article Header */}
        <header className="mb-12 pb-8 border-b border-white/5">
          {/* Category Tag */}
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 border border-primary/30 bg-primary/5">
            <span className="w-2 h-2 bg-primary animate-pulse" />
            <span className="terminal-text text-xs text-primary tracking-wider">ARTICLE</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-text-main leading-tight mb-6">
            {title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 terminal-text text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <span className="status-dot" />
              <span>
                AUTHOR: <span className="text-primary">XIAOFENG</span>
              </span>
            </div>
            <span className="hidden sm:inline text-white/20">|</span>
            <span>
              ID: <span className="text-primary">{slug.slice(0, 8).toUpperCase()}</span>
            </span>
            {date && (
              <>
                <span className="hidden sm:inline text-white/20">|</span>
                <span>
                  DATE: <span className="text-primary">{date}</span>
                </span>
              </>
            )}
            <span className="hidden sm:inline text-white/20">|</span>
            <span>
              STATUS: <span className="text-neon-green">PUBLISHED</span>
            </span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="terminal-text text-[10px] tracking-wider px-2 py-1 border border-secondary/20 text-secondary/80 bg-secondary/5"
                >
                  #{tag.toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div
          className="
            prose prose-invert prose-lg max-w-none

            /* Headings */
            prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:font-bold prose-h2:text-primary prose-h2:mt-16 prose-h2:mb-6
            prose-h2:pl-4 prose-h2:border-l-2 prose-h2:border-primary
            prose-h3:text-xl prose-h3:md:text-2xl prose-h3:font-semibold prose-h3:text-secondary prose-h3:mt-12 prose-h3:mb-4
            prose-h4:text-lg prose-h4:md:text-xl prose-h4:font-medium prose-h4:text-accent prose-h4:mt-8 prose-h4:mb-3

            /* Paragraphs */
            prose-p:text-text-muted prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base prose-p:md:text-lg

            /* Lists */
            prose-ul:text-text-muted prose-ul:my-6 prose-li:my-2 prose-li:text-base prose-li:md:text-lg
            prose-ol:text-text-muted prose-ol:my-6
            marker:text-primary

            /* Links */
            prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/30
            hover:prose-a:border-primary hover:prose-a:text-primary

            /* Strong & Emphasis */
            prose-strong:text-text-main prose-strong:font-semibold
            prose-em:text-secondary

            /* Code */
            prose-code:text-primary prose-code:bg-surface prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:border prose-code:border-primary/20
            prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-surface prose-pre:border prose-pre:border-white/5 prose-pre:p-6 prose-pre:rounded-none
            prose-pre:shadow-[inset_0_0_30px_rgba(0,240,255,0.03)]

            /* Blockquotes */
            [&>blockquote]:border-l-2 [&>blockquote]:border-secondary [&>blockquote]:pl-6 [&>blockquote]:py-2
            [&>blockquote]:italic [&>blockquote]:text-text-muted [&>blockquote]:bg-surface/30
            [&>blockquote]:my-8

            /* Images */
            [&>img]:rounded-none [&>img]:border [&>img]:border-white/10 [&>img]:shadow-2xl [&>img]:my-12

            /* HR */
            [&>hr]:my-16 [&>hr]:border-white/10
            [&>hr]:relative [&>hr]:overflow-visible

            /* Spacing */
            [&>h2+p]:mt-6 [&>h3+p]:mt-4 [&>h4+p]:mt-3
            [&>p+ul]:mt-4 [&>p+ol]:mt-4
            [&>*+h2]:mt-16 [&>*+h3]:mt-12 [&>*+h4]:mt-8
          "
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="terminal-text text-xs text-text-muted">END_OF_TRANSMISSION</div>

            <Link
              to="/blog"
              className="group flex items-center gap-3 px-6 py-3 cyber-card hover:border-primary/30 transition-all terminal-text text-sm"
            >
              <svg
                className="w-4 h-4 text-primary transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-text-muted group-hover:text-primary transition-colors">
                BACK_TO_ARCHIVE
              </span>
            </Link>
          </div>
        </footer>

        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/20 -translate-x-4 -translate-y-4 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-secondary/20 translate-x-4 translate-y-4 pointer-events-none" />
      </article>
    </div>
  );
}
