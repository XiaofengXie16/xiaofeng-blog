import { createFileRoute, Link } from "@tanstack/react-router"
import { getAllBlogPosts } from "~/utils/blogData";

export const Route = createFileRoute('/blog/')({
  loader: () => ({ posts: getAllBlogPosts() }),
  component: Posts,
})

function Posts() {
  const { posts } = Route.useLoaderData();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary pb-2">
          Blog
        </h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          Thoughts, tutorials, and insights on software engineering.
        </p>
      </div>

      <div className="space-y-8">
        {posts.map(({ filename, preview, title, slug }, index) => (
          <Link
            key={filename}
            to={`/blog/$slug` as '/blog/$slug'}
            params={{ slug }}
            className="block group relative p-8 bg-surface/50 backdrop-blur-sm border border-white/5 rounded-3xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-primary transform rotate-12 group-hover:rotate-0 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-4 group-hover:text-primary transition-colors">
              {title}
            </h2>

            <p className="text-text-muted text-lg leading-relaxed mb-6 max-w-2xl">
              {preview}
            </p>

            <div className="flex items-center text-sm font-medium text-primary">
              Read Article
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
