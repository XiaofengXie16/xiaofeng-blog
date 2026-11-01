import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BOOKS, BOOK_TAGS } from "~/constants/book";
import { pageMeta } from "~/constants/site";
import { Grain } from "~/components/design/Atmosphere";
import { PageTitle } from "~/components/design/Section";
import { Shelf3D } from "~/components/three/Shelf3D";
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

const UPPER_RIBBON = "M-80 640 C 260 520, 520 760, 820 620 S 1300 460, 1540 560";
const LOWER_RIBBON = "M-80 1180 C 300 1040, 640 1300, 980 1120 S 1360 980, 1540 1060";

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
          d={UPPER_RIBBON}
          fill="none"
          stroke="#fff"
          strokeWidth="120"
          strokeLinecap="round"
          opacity=".38"
        />
        <path d={UPPER_RIBBON} fill="none" stroke="#fff" strokeWidth="3" opacity=".9" />
        <path
          d={LOWER_RIBBON}
          fill="none"
          stroke="#D9C2EE"
          strokeWidth="140"
          strokeLinecap="round"
          opacity=".45"
        />
        <path d={LOWER_RIBBON} fill="none" stroke="#fff" strokeWidth="3" opacity=".8" />
      </svg>
      <Grain />

      <div className="relative z-[2] mx-auto flex max-w-[1240px] flex-col gap-14 px-5 pt-44 pb-30 sm:px-8">
        <PageTitle
          kicker="books that changed how I build"
          kickerClass="text-rust"
          title="Reading list"
          intro={`${BOOKS.length} books I keep recommending. Pick one off the shelf.`}
        />

        <Shelf3D mode="select" books={BOOKS} tags={BOOK_TAGS} picked={picked} onPick={setPicked} />

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
