import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TOOLS } from "~/constants/tool";
import { pageMeta } from "~/constants/site";
import { Cloud, Grain } from "~/components/design/Atmosphere";
import { PageTitle } from "~/components/design/Section";
import { BlockBuilder } from "~/components/figures/Figures";

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
const TINTS = ["bg-cobalt/15", "bg-[#E88A4F]/20", "bg-[#7DA453]/25", "bg-[#9B8CDC]/25"];

function Tool() {
  const [category, setCategory] = useState<string>(ALL);
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
          <div className="pointer-events-none hidden flex-[1_1_240px] justify-center md:flex">
            <BlockBuilder className="h-[394px] w-[230px]" />
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1240px] flex-col gap-9 px-5 pt-10 pb-30 sm:px-8">
        <div
          role="group"
          aria-label="Filter by category"
          className="glass flex flex-wrap gap-1.5 self-start rounded-[28px] p-1.5"
        >
          {[ALL, ...categories].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`min-h-11 cursor-pointer rounded-full border-0 px-[18px] font-sans text-sm font-medium ${
                category === c
                  ? "bg-ink text-white"
                  : "bg-transparent text-ink-soft hover:bg-white/40"
              }`}
            >
              {c === ALL ? "Everything" : c}
            </button>
          ))}
        </div>

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
                    className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${TINTS[categories.indexOf(tool.category) % TINTS.length]}`}
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
