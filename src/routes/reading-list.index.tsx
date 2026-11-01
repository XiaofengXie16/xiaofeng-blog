import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BOOKS } from "~/constants/book";
import { pageMeta } from "~/constants/site";
import { Grain } from "~/components/design/Atmosphere";
import { PageTitle } from "~/components/design/Section";
import { shortTitle } from "~/utils/format";

export const Route = createFileRoute("/reading-list/")({
  head: () =>
    pageMeta({
      title: "Reading List | Xiaofeng Xie",
      description:
        "Books on software design, engineering leadership, and systems that Xiaofeng Xie recommends.",
      path: "/reading-list",
    }),
  component: ReadingList,
});

const HEIGHTS = [320, 280, 330, 300, 290, 350];
const COLORS = ["text-moss", "text-rust", "text-violet"];

function ReadingList() {
  const [picked, setPicked] = useState(0);
  const current = BOOKS[picked];

  return (
    <div className="relative overflow-hidden bg-linear-to-b from-[#F3D9C6] via-[#EADCEB] via-35% to-[#B9C0EE]">
      <svg
        viewBox="0 0 1440 1500"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M-80 640 C 260 520, 520 760, 820 620 S 1300 460, 1540 560"
          fill="none"
          stroke="#fff"
          strokeWidth="120"
          strokeLinecap="round"
          opacity=".38"
        />
        <path
          d="M-80 640 C 260 520, 520 760, 820 620 S 1300 460, 1540 560"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          opacity=".9"
        />
        <path
          d="M-80 1180 C 300 1040, 640 1300, 980 1120 S 1360 980, 1540 1060"
          fill="none"
          stroke="#D9C2EE"
          strokeWidth="140"
          strokeLinecap="round"
          opacity=".45"
        />
        <path
          d="M-80 1180 C 300 1040, 640 1300, 980 1120 S 1360 980, 1540 1060"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          opacity=".8"
        />
      </svg>
      <svg
        viewBox="0 0 1440 1500"
        preserveAspectRatio="none"
        className="absolute inset-0 hidden h-full w-full md:block"
        aria-hidden="true"
      >
        <use
          href="#walker"
          opacity=".7"
          x="210"
          y="560"
          width="22"
          height="55"
          style={{ color: "#2F5BD3" }}
        />
        <use
          href="#walker"
          opacity=".7"
          x="236"
          y="566"
          width="20"
          height="50"
          style={{ color: "#E07A3F" }}
        />
        <use
          href="#walker"
          opacity=".7"
          x="1180"
          y="980"
          width="22"
          height="55"
          style={{ color: "#7DA453" }}
        />
        <use
          href="#walker"
          opacity=".7"
          x="640"
          y="1170"
          width="20"
          height="50"
          style={{ color: "#F4F7FF" }}
        />
      </svg>
      <Grain />

      <div className="relative z-[2] mx-auto flex max-w-[1240px] flex-col gap-14 px-5 pt-44 pb-30 sm:px-8">
        <PageTitle
          kicker="books that changed how I build"
          kickerClass="text-rust"
          title="Reading list"
          intro={`${BOOKS.length} books I keep recommending. Pick a capsule to open it.`}
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-end gap-7">
          {BOOKS.map((book, i) => {
            const on = i === picked;
            return (
              <button
                key={book.name}
                type="button"
                aria-pressed={on}
                onClick={() => setPicked(i)}
                className={`glass animate-bob flex cursor-pointer flex-col items-center justify-end gap-2.5 rounded-full px-5 pt-9 pb-11 text-center font-sans transition-[transform,box-shadow] duration-500 ${
                  on
                    ? "-translate-y-4 bg-white/70 shadow-[0_0_0_2px_#fff,0_0_46px_6px_rgba(140,165,255,.75),0_30px_50px_-20px_rgba(53,48,110,.5)]"
                    : "hover:-translate-y-2"
                }`}
                style={{ height: HEIGHTS[i % HEIGHTS.length], animationDelay: `-${i}s` }}
              >
                <img
                  src={book.icon}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="mb-1 h-20 w-14 rounded-md object-cover shadow-md"
                />
                <span className="text-[17px] leading-tight font-medium text-ink">
                  {shortTitle(book.name)}
                </span>
                <span className={`font-hand text-lg ${COLORS[i % COLORS.length]}`}>
                  {on ? "open" : "tap to open"}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="glass flex flex-wrap items-center gap-x-12 gap-y-8 rounded-[36px] p-8 sm:p-10"
          aria-live="polite"
        >
          <img
            src={current.icon}
            alt={`Cover of ${shortTitle(current.name)}`}
            className="h-36 w-24 rounded-lg object-cover shadow-lg"
          />
          <div className="flex min-w-0 flex-[999_1_360px] flex-col gap-3">
            <span className="font-hand text-[26px] text-violet">on the shelf</span>
            <h2 className="m-0 text-3xl leading-[1.1] font-medium tracking-[-0.03em] sm:text-[40px]">
              {current.name}
            </h2>
          </div>
          <a
            href={current.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] flex-none items-center gap-2.5 rounded-full bg-ink px-6 font-medium text-white no-underline hover:bg-indigo-deep"
          >
            Visit the book
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
