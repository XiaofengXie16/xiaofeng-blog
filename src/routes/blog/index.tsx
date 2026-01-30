import { createFileRoute, Link } from "@tanstack/react-router"
import { getAllBlogPosts } from "~/utils/blogData";

export const Route = createFileRoute('/blog/')({
  loader: () => ({ posts: getAllBlogPosts() }),
  component: Posts,
})

function Posts() {
  const { posts } = Route.useLoaderData();

  return (
    <div className="relative max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      {/* Header Section */}
      <div className="mb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 terminal-text text-sm text-text-muted">
          <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
          <span className="text-primary">/</span>
          <span className="text-primary">BLOG</span>
        </div>

        {/* Title with HUD styling */}
        <div className="relative inline-block">
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary to-transparent" />
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="text-text-main">Data</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Stream</span>
          </h1>
        </div>

        <p className="mt-6 text-lg text-text-muted max-w-2xl terminal-text">
          <span className="text-primary">&gt;</span> Transmitting thoughts on software engineering, architecture, and innovation...
        </p>

        {/* Stats bar */}
        <div className="mt-8 flex flex-wrap items-center gap-6 p-4 border border-white/5 bg-surface/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="status-dot" />
            <span className="terminal-text text-xs text-text-muted">FEED_ACTIVE</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="terminal-text text-xs text-text-muted">
            ENTRIES: <span className="text-primary">{posts.length}</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="terminal-text text-xs text-text-muted">
            STATUS: <span className="text-neon-green">TRANSMITTING</span>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="space-y-6">
        {posts.map(({ filename, preview, title, slug }, index) => (
          <Link
            key={filename}
            to={`/blog/$slug` as '/blog/$slug'}
            params={{ slug }}
            className="group block relative animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <article className="relative cyber-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30">
              {/* Post Number */}
              <div className="absolute top-4 right-4 terminal-text text-xs text-text-muted opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all">
                [{String(index + 1).padStart(2, '0')}]
              </div>

              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/30 group-hover:border-primary/60 group-hover:w-8 group-hover:h-8 transition-all duration-300" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-secondary/30 group-hover:border-secondary/60 group-hover:w-8 group-hover:h-8 transition-all duration-300" />

              {/* Content */}
              <div className="relative">
                {/* Category Tag */}
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-primary/20 bg-primary/5">
                  <span className="w-2 h-2 bg-primary animate-pulse" />
                  <span className="terminal-text text-xs text-primary tracking-wider">ARTICLE</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-4 group-hover:text-primary transition-colors leading-tight">
                  {title}
                </h2>

                <p className="text-text-muted leading-relaxed mb-6 line-clamp-3">
                  {preview}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <span className="terminal-text text-xs text-text-muted">
                      ID: <span className="text-primary">{slug.slice(0, 8).toUpperCase()}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 terminal-text text-sm text-text-muted group-hover:text-primary transition-colors">
                    <span>&gt;</span>
                    <span>ACCESS_DATA</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Glow Line */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-500" />
            </article>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-20 cyber-card">
          <div className="terminal-text text-lg text-text-muted mb-4">
            <span className="text-primary">&gt;</span> NO_DATA_FOUND
          </div>
          <p className="text-text-muted">
            The data stream is currently empty. Check back soon for new transmissions.
          </p>
        </div>
      )}
    </div>
  );
}
