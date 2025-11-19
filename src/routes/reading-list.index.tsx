import { createFileRoute } from "@tanstack/react-router"
import { BOOKS } from "~/constants/book";

export const Route = createFileRoute('/reading-list/')({
  component: ReadingList,
})

function ReadingList() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent pb-2">
          Reading List
        </h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          Books and articles that have shaped my perspective on software, leadership, and life.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {BOOKS.map(({ name, icon, link }, index) => (
          <li
            key={name}
            className="group list-none animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <a
              href={link}
              className="block h-full bg-surface/50 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-secondary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/10"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60 z-10" />
                <img
                  src={icon}
                  alt={name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6 relative z-20 -mt-20">
                <h2 className="text-xl font-bold text-white group-hover:text-secondary transition-colors text-center drop-shadow-lg">
                  {name}
                </h2>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
