import { createFileRoute, Link } from "@tanstack/react-router"
import { ToolCard } from "~/components/Card";
import { TOOLS } from "~/constants/tool";

export const Route = createFileRoute('/tool')({
  component: Tool,
})

function Tool() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-pink-500 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
      >
        Skip to main content
      </a>
      <div id="main-content" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <nav className="mb-12" aria-label="Breadcrumb navigation">
          <Link
            to="/"
            className="inline-flex items-center text-xl font-medium text-gray-200 hover:text-pink-200 transition-colors"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Read, Think and Code
          </Link>
        </nav>

        <h1 className="mb-12 text-4xl font-bold tracking-tight text-pink-200 sm:text-5xl">
          Development Tools
        </h1>

        <div className="space-y-8">
          {TOOLS.map(({ description, icon, name, category, link }) => (
            <ToolCard
              key={name}
              description={description}
              icon={icon}
              category={category}
              name={name}
              link={link}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
