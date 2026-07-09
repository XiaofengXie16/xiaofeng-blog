import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchAllBlogPosts } from "~/server/blog.functions";

export const Route = createFileRoute("/")({
  loader: async () => ({ posts: await fetchAllBlogPosts() }),
  component: Index,
});

function Index() {
  const { posts } = Route.useLoaderData();
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-6 animate-fade-in">
      {/* Hero */}
      <section className="py-20 md:py-28">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main mb-6">
          Hi, I'm Xiaofeng.
        </h1>
        <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl">
          I'm a software engineer writing about frontend architecture, developer tooling, and system
          design. I care about building things that are simple, fast, and last.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-background font-medium hover:bg-primary-hover transition-colors"
          >
            Read the blog
            <ArrowRight />
          </Link>
          <a
            href="https://github.com/XiaofengXie16"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border-subtle text-text-main hover:bg-surface transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </section>

      {/* Recent writing */}
      <section className="pb-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-xl font-semibold text-text-main">Recent writing</h2>
          <Link
            to="/blog"
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            All posts →
          </Link>
        </div>

        <div className="space-y-2">
          {recentPosts.map(({ filename, title, preview, date, tags, slug }) => (
            <Link
              key={filename}
              to="/blog/$slug"
              params={{ slug }}
              className="group block -mx-4 px-4 py-5 rounded-lg hover:bg-surface transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                {date && (
                  <span className="terminal-text text-xs text-text-muted shrink-0 sm:w-24">
                    {date}
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="font-medium text-text-main group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted line-clamp-2">{preview}</p>
                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="terminal-text text-xs text-text-muted">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Elsewhere on the site */}
      <section className="pb-24">
        <h2 className="text-xl font-semibold text-text-main mb-8">More</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/reading-list" className="card group p-6 block">
            <h3 className="font-medium text-text-main group-hover:text-primary transition-colors mb-2">
              Reading list
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Books that shaped how I think about software, leadership, and everything in between.
            </p>
          </Link>
          <Link to="/tool" className="card group p-6 block">
            <h3 className="font-medium text-text-main group-hover:text-primary transition-colors mb-2">
              Tools
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              The software I use every day — editors, terminals, frameworks, and utilities.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );
}
