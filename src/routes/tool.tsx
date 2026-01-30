import { createFileRoute, Link } from "@tanstack/react-router"
import { TOOLS } from "~/constants/tool";

export const Route = createFileRoute('/tool')({
  component: Tool,
})

function Tool() {
  // Group tools by category
  const toolsByCategory = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof TOOLS>);

  const categories = Object.keys(toolsByCategory);

  return (
    <div className="relative max-w-7xl mx-auto px-6 py-12 animate-fade-in">
      {/* Header Section */}
      <div className="mb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 terminal-text text-sm text-text-muted">
          <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
          <span className="text-accent">/</span>
          <span className="text-accent">TOOLS</span>
        </div>

        {/* Title */}
        <div className="relative inline-block">
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-accent to-transparent" />
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="text-text-main">Arsenal</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary"> Matrix</span>
          </h1>
        </div>

        <p className="mt-6 text-lg text-text-muted max-w-2xl terminal-text">
          <span className="text-accent">&gt;</span> The software and hardware that powers the development workflow...
        </p>

        {/* Stats bar */}
        <div className="mt-8 flex flex-wrap items-center gap-6 p-4 border border-white/5 bg-surface/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent animate-pulse" />
            <span className="terminal-text text-xs text-text-muted">ARSENAL_LOADED</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="terminal-text text-xs text-text-muted">
            TOTAL_UNITS: <span className="text-accent">{TOOLS.length}</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="terminal-text text-xs text-text-muted">
            CATEGORIES: <span className="text-accent">{categories.length}</span>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(({ description, icon, name, category, link }, index) => (
          <a
            key={name}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative animate-slide-up"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <div className="relative h-full cyber-card p-6 transition-all duration-500 hover:-translate-y-1 hover:border-accent/30">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-accent/30 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-primary/30 group-hover:border-primary/60 group-hover:w-6 group-hover:h-6 transition-all duration-300" />

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="relative p-3 border border-white/10 group-hover:border-accent/30 group-hover:bg-accent/5 transition-all duration-300">
                  <img src={icon} alt={name} className="w-8 h-8" />
                  {/* Pulse effect on hover */}
                  <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
                </div>

                <span className="terminal-text text-xs px-3 py-1.5 border border-white/10 bg-surface/50 text-text-muted group-hover:border-accent/30 group-hover:text-accent transition-all">
                  {category}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-text-main mb-2 group-hover:text-accent transition-colors flex items-center gap-2">
                {name}
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </h3>

              <p className="text-text-muted text-sm leading-relaxed mb-4">
                {description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="terminal-text text-xs text-text-muted">
                  [{String(index + 1).padStart(2, '0')}]
                </span>
                <span className="terminal-text text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  LAUNCH &gt;
                </span>
              </div>

              {/* Bottom Glow */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-primary group-hover:w-full transition-all duration-500" />
            </div>
          </a>
        ))}
      </div>

      {/* Circuit Pattern Decoration */}
      <div className="fixed bottom-0 right-0 w-64 h-64 pointer-events-none opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="var(--color-primary)" />
            </linearGradient>
          </defs>
          <path
            d="M10 50 H30 V30 H50 M50 30 V10 M50 30 H70 V50 H90 M70 50 V70 H50 V90 M50 70 H30 V50"
            fill="none"
            stroke="url(#circuit-grad)"
            strokeWidth="0.5"
          />
          <circle cx="30" cy="50" r="2" fill="var(--color-accent)" />
          <circle cx="50" cy="30" r="2" fill="var(--color-primary)" />
          <circle cx="70" cy="50" r="2" fill="var(--color-accent)" />
          <circle cx="50" cy="70" r="2" fill="var(--color-primary)" />
        </svg>
      </div>
    </div>
  );
}
