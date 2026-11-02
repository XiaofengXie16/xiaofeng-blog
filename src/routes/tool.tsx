import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TOOLS } from "~/constants/tool";
import { CATEGORY, type Category } from "~/constants/category";
import { pageMeta } from "~/constants/site";
import { Cloud, Grain } from "~/components/design/Atmosphere";
import { FilterPills } from "~/components/design/FilterPills";
import { PageTitle } from "~/components/design/Section";
import { BlockBuilder } from "~/components/figures/Figures";
import { PlushFigure } from "~/components/three/PlushFigure";
import { cycle } from "~/utils/array";

export const Route = createFileRoute("/tool")({
  head: () =>
    pageMeta({
      title: "Tools | Xiaofeng Xie",
      description:
        "Developer tools, terminal utilities, and productivity software Xiaofeng Xie uses day to day.",
      path: "/tool",
    }),
  component: Tool,
});

const ALL = "all";
type Filter = Category | typeof ALL;
// Short chip labels so every filter fits on one row; cards keep the full name.
// Typed by Category, so a new category can't ship without a label.
const SHORT_LABELS: Record<Filter, string> = {
  [ALL]: "All",
  [CATEGORY.DEVELOPMENT_TOOL]: "Dev tools",
  [CATEGORY.TERMINAL_UTILITY]: "Terminal",
  [CATEGORY.TERMINAL_THEME]: "Themes",
  [CATEGORY.CSS_FRAMEWORK]: "CSS",
  [CATEGORY.JAVASCRIPT_FRAMEWORK]: "JS frameworks",
  [CATEGORY.TEST_FRAMEWORK]: "Testing",
  [CATEGORY.JAVASCRIPT_RUNTIME]: "Runtimes",
  [CATEGORY.PRODUCTIVITY_TOOL]: "Productivity",
};

const TINTS = ["bg-cobalt/15", "bg-[#E88A4F]/20", "bg-[#7DA453]/25", "bg-[#9B8CDC]/25"] as const;

function Tool() {
  const [category, setCategory] = useState<Filter>(ALL);
  const categories = [...new Set(TOOLS.map((t) => t.category))];
  const visible = category === ALL ? TOOLS : TOOLS.filter((t) => t.category === category);

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-[#F2B98F] via-[#F2CDB6] via-40% to-[#C7CDF2] pb-16">
        <Cloud
          style={{
            width: 520,
            height: 170,
            left: -60,
            top: 140,
            background: "#FFE6CF",
            opacity: 0.85,
          }}
        />
        <Cloud
          style={{
            width: 460,
            height: 160,
            right: -60,
            top: 260,
            background: "#E6D7F4",
            opacity: 0.7,
            animationDuration: "34s",
          }}
        />
        <Grain />
        <div className="relative z-[2] mx-auto flex max-w-[1240px] flex-wrap items-end gap-8 px-5 pt-40 sm:px-8">
          <div className="min-w-0 flex-[999_1_560px] pb-6">
            <PageTitle
              kicker="what's on the workbench"
              kickerClass="text-indigo"
              title="Toolkit"
              intro="The editors, terminals, runtimes and small utilities I reach for every day."
            />
          </div>
          <div className="hidden flex-[1_1_240px] justify-center md:flex">
            <PlushFigure
              figure="builder"
              className="h-[420px] w-[300px]"
              fallback={<BlockBuilder className="decor h-[394px] w-[230px]" />}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1240px] flex-col gap-9 px-5 pt-10 pb-30 sm:px-8">
        <FilterPills
          label="Filter by category"
          options={[ALL, ...categories]}
          value={category}
          onChange={setCategory}
          optionLabel={(c) => SHORT_LABELS[c]}
          layout="scroll"
        />

        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,270px),1fr))] gap-5 p-0">
          {visible.map((tool) => (
            <li key={tool.name}>
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass flex h-full min-h-[190px] flex-col gap-3 rounded-[28px] p-6 text-ink no-underline transition-transform duration-300 hover:-translate-y-1 hover:-rotate-[0.4deg]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${cycle(TINTS, categories.indexOf(tool.category))}`}
                  >
                    <img
                      src={tool.icon}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-7 w-7 object-contain"
                    />
                  </span>
                  <span className="font-hand text-xl text-[#6A5B9A]">
                    {tool.category.toLowerCase()}
                  </span>
                </div>
                <span className="text-[22px] font-medium tracking-[-0.02em]">{tool.name}</span>
                <span className="line-clamp-3 text-[15px] leading-normal text-ink-soft">
                  {tool.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
