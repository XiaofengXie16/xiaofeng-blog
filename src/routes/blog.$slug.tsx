import { createFileRoute, Link } from "@tanstack/react-router"
import invariant from "tiny-invariant";

import { getBlogPostBySlug } from "~/utils/blogData";

type LoaderData = {
  title: string;
  content: string;
};

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const { slug } = params;
    invariant(slug, "Expected 'slug' parameter");

    const post = getBlogPostBySlug(slug);

    if (!post) {
      throw new Response("Blog post not found", { status: 404 });
    }

    return {
      title: post.title,
      content: post.html,
    } satisfies LoaderData;
  },
  component: BlogPost,
})

function BlogPost() {
  const { title, content } = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <nav className="mb-12">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center text-xl font-medium text-gray-200 hover:text-pink-200 transition-colors"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Read, Think and Code
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center text-xl font-medium text-gray-200 hover:text-pink-200 transition-colors"
            >
              <span>All Posts</span>
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </nav>

        <article className="prose prose-invert prose-lg max-w-none">
          <h1 className="mb-12 text-4xl font-bold tracking-tight text-pink-200 sm:text-5xl">
            {title}
          </h1>

          <div
            className="
              prose-h2:text-3xl prose-h2:font-bold prose-h2:text-pink-200 prose-h2:mt-16 prose-h2:mb-8
              prose-h3:text-2xl prose-h3:font-semibold prose-h3:text-pink-200/90 prose-h3:mt-12 prose-h3:mb-6
              prose-h4:text-xl prose-h4:font-medium prose-h4:text-pink-200/80 prose-h4:mt-8 prose-h4:mb-4
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
              prose-ul:text-gray-300 prose-ul:my-6 prose-li:my-3 prose-li:text-lg
              prose-a:text-pink-200 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-pink-200/90 prose-strong:font-semibold
              prose-code:text-pink-200/90 prose-code:bg-gray-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-gray-800/50 prose-pre:p-4 prose-pre:rounded-lg
              [&>*]:text-gray-300
              [&>h2]:text-pink-200
              [&>h3]:text-pink-200/90
              [&>h4]:text-pink-200/80
              [&>a]:text-pink-200
              [&>strong]:text-pink-200/90
              [&>code]:text-pink-200/90
              marker:text-pink-200/70
              [&>h2+p]:mt-6
              [&>h3+p]:mt-4
              [&>h4+p]:mt-3
              [&>p+ul]:mt-4
              [&>.pros-cons]:mt-6
              [&>.pros-cons>*]:mb-2
              [&>*+h2]:mt-16
              [&>*+h3]:mt-12
              [&>*+h4]:mt-8
              [&>hr]:my-12
              [&>hr]:border-gray-700
              [&>blockquote]:border-l-4
              [&>blockquote]:border-pink-200/30
              [&>blockquote]:pl-4
              [&>blockquote]:italic
              [&>blockquote]:text-gray-400
              [&>img]:rounded-lg
              [&>img]:shadow-lg
              [&>img]:my-12
              [&>.pros-cons-list]:pl-6
              [&>.pros-cons-list>li]:mb-4
              [&>.pros-cons-list>li:before]:content-['-']
              [&>.pros-cons-list>li:before]:text-pink-200/70
              [&>.pros-cons-list>li:before]:mr-2
            "
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      </div>
    </main>
  );
}
