import { createFileRoute } from "@tanstack/react-router"
import { TOOLS } from "~/constants/tool";

export const Route = createFileRoute('/tool')({
  component: Tool,
})

function Tool() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary pb-2">
          Development Tools
        </h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          The software and hardware that powers my workflow.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(({ description, icon, name, category, link }, index) => (
          <a
            key={name}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-6 bg-surface/50 backdrop-blur-sm border border-white/5 rounded-2xl hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5 animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white/5 rounded-xl group-hover:bg-accent/10 transition-colors">
                <img src={icon} alt={name} className="w-8 h-8" />
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-text-muted border border-white/5">
                {category}
              </span>
            </div>

            <h3 className="text-xl font-bold text-text-main mb-2 group-hover:text-accent transition-colors">
              {name}
            </h3>

            <p className="text-text-muted text-sm leading-relaxed">
              {description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
