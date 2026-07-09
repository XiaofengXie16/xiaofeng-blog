import { createFileRoute } from "@tanstack/react-router";
import { BOOKS } from "~/constants/book";

export const Route = createFileRoute("/reading-list/")({
  head: () => ({
    meta: [
      { title: "Reading List | Xiaofeng Xie" },
      {
        name: "description",
        content: "Books that shaped Xiaofeng Xie's perspective on software, leadership, and life.",
      },
    ],
  }),
  component: ReadingList,
});

function ReadingList() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-fade-in">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main">
          Reading list
        </h1>
        <p className="mt-4 text-lg text-text-muted max-w-2xl">
          Books that have shaped my perspective on software, leadership, and life.
        </p>
      </header>

      {/* Books Grid */}
      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {BOOKS.map(({ name, icon, link }) => (
          <li key={name} className="list-none">
            <a href={link} className="group block h-full" target="_blank" rel="noopener noreferrer">
              <div className="card overflow-hidden h-full">
                <div className="aspect-[3/4] overflow-hidden bg-surface-hover">
                  <img
                    src={icon}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-sm font-medium text-text-main group-hover:text-primary transition-colors leading-snug">
                    {name}
                  </h2>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
