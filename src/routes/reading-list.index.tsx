import { createFileRoute, Link } from "@tanstack/react-router"
import { BOOKS } from "~/constants/book";

export const Route = createFileRoute('/reading-list/')({
  component: ReadingList,
})

function ReadingList() {
  return (
    <div className="relative max-w-7xl mx-auto px-6 py-12 animate-fade-in">
      {/* Header Section */}
      <div className="mb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 terminal-text text-sm text-text-muted">
          <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
          <span className="text-secondary">/</span>
          <span className="text-secondary">READING</span>
        </div>

        {/* Title */}
        <div className="relative inline-block">
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-secondary to-transparent" />
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="text-text-main">Knowledge</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent"> Archive</span>
          </h1>
        </div>

        <p className="mt-6 text-lg text-text-muted max-w-2xl terminal-text">
          <span className="text-secondary">&gt;</span> Books and resources that have shaped my perspective on software, leadership, and life...
        </p>

        {/* Stats bar */}
        <div className="mt-8 flex flex-wrap items-center gap-6 p-4 border border-white/5 bg-surface/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary animate-pulse" />
            <span className="terminal-text text-xs text-text-muted">ARCHIVE_ACTIVE</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="terminal-text text-xs text-text-muted">
            VOLUMES: <span className="text-secondary">{BOOKS.length}</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="terminal-text text-xs text-text-muted">
            STATUS: <span className="text-neon-green">INDEXED</span>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {BOOKS.map(({ name, icon, link }, index) => (
          <li
            key={name}
            className="group list-none animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <a
              href={link}
              className="block h-full relative"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Main Card */}
              <div className="relative h-full cyber-card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-secondary/30">
                {/* Index Number */}
                <div className="absolute top-4 left-4 z-20 terminal-text text-xs text-white/50 group-hover:text-secondary transition-colors">
                  [{String(index + 1).padStart(2, '0')}]
                </div>

                {/* External Link Indicator */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>

                {/* Book Cover */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  {/* Holographic Overlay */}
                  <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                  {/* Scan Line Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000 z-10" />

                  {/* Image */}
                  <img
                    src={icon}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Bottom Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  {/* Category Tag */}
                  <div className="inline-flex items-center gap-2 mb-3 px-2 py-1 border border-secondary/30 bg-surface/80 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 bg-secondary" />
                    <span className="terminal-text text-[10px] text-secondary tracking-wider">VOLUME</span>
                  </div>

                  <h2 className="text-lg font-bold text-white group-hover:text-secondary transition-colors leading-tight">
                    {name}
                  </h2>

                  {/* Access Indicator */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="terminal-text text-xs text-text-muted">
                      READY
                    </span>
                    <span className="terminal-text text-xs text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      ACCESS
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-secondary/30 group-hover:border-secondary/60 group-hover:w-8 group-hover:h-8 transition-all duration-300 z-20" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-accent/30 group-hover:border-accent/60 group-hover:w-8 group-hover:h-8 transition-all duration-300 z-20" />

                {/* Bottom Glow */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-accent group-hover:w-full transition-all duration-500 z-20" />
              </div>
            </a>
          </li>
        ))}
      </ul>

      {/* Decorative Element */}
      <div className="fixed bottom-10 left-10 pointer-events-none opacity-20">
        <div className="w-32 h-32 border border-secondary/50 rotate-45 animate-float" />
      </div>
    </div>
  );
}
