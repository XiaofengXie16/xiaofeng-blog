import { createFileRoute } from "@tanstack/react-router";
import { TOOLS } from "~/constants/tool";

export const Route = createFileRoute("/tool")({
  head: () => ({
    meta: [
      { title: "Tools | Xiaofeng Xie" },
      {
        name: "description",
        content: "The software and hardware that powers Xiaofeng Xie's development workflow.",
      },
    ],
  }),
  component: Tool,
});

function Tool() {
  // Group tools by category
  const toolsByCategory = TOOLS.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    },
    {} as Record<string, typeof TOOLS>,
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-fade-in">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main">Tools</h1>
        <p className="mt-4 text-lg text-text-muted max-w-2xl">
          The software that powers my development workflow, day in and day out.
        </p>
      </header>

      {/* Tools by category */}
      <div className="space-y-14">
        {Object.entries(toolsByCategory).map(([category, tools]) => (
          <section key={category}>
            <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-5">
              {category}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map(({ description, icon, name, link }) => (
                <a
                  key={name}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card p-5 block"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-md bg-surface-hover border border-border-subtle flex items-center justify-center shrink-0">
                      <img src={icon} alt="" className="w-6 h-6" loading="lazy" decoding="async" />
                    </div>
                    <h3 className="font-medium text-text-main group-hover:text-primary transition-colors">
                      {name}
                    </h3>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed line-clamp-3">
                    {description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
