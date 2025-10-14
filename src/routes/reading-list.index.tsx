import { createFileRoute, Link } from "@tanstack/react-router"
import { BOOKS } from "~/constants/book";

export const Route = createFileRoute('/reading-list/')({
  component: ReadingList,
})

function ReadingList() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <nav className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center text-xl font-medium text-gray-200 hover:text-pink-200 transition-colors"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Read, Think and Code
          </Link>
        </nav>

        <h1 className="mb-12 text-4xl font-bold tracking-tight text-pink-200 sm:text-5xl">
          Reading List
        </h1>

        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {BOOKS.map(({ name, icon, link }) => (
            <li key={name} className="group list-none">
              <a
                href={link}
                className="block transition duration-200 group-hover:opacity-90"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-800/50">
                  <img
                    src={icon}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h2 className="mt-4 text-center text-xl font-medium text-gray-200 group-hover:text-pink-200">
                  {name}
                </h2>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
