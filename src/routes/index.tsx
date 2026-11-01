import { createFileRoute, Link } from "@tanstack/react-router";
import { pageMeta } from "~/constants/site";
import { BOOKS, BOOK_TAGS } from "~/constants/book";
import { fetchAllBlogPosts } from "~/server/blog.functions";
import { Cloud, Grain } from "~/components/design/Atmosphere";
import { ArrowRight, SectionHeading, Tag } from "~/components/design/Section";
import { RibbonWalkers } from "~/components/design/RibbonWalkers";
import { DeskWriter, SkyWriter } from "~/components/figures/Figures";
import { PlushWriter } from "~/components/three/PlushWriter";
import { Shelf3D } from "~/components/three/Shelf3D";
import { Makers } from "~/components/figures/Makers";
import { WishSky } from "~/components/home/WishSky";
import { SearchIcon } from "~/components/Layout/Header";
import { openCommandAgent } from "~/components/CommandAgent/events";
import { formatPostDate } from "~/utils/format";

export const Route = createFileRoute("/")({
  loader: async () => ({ posts: (await fetchAllBlogPosts()).slice(0, 2) }),
  head: () =>
    pageMeta({
      title: "Xiaofeng Xie - Software Engineer",
      description:
        "Software engineer writing about architecture, frontend systems, and developer tooling.",
      path: "/",
    }),
  component: Index,
});

const HERO_RIBBON = "M-40 690 C 260 560, 520 760, 820 640 S 1300 480, 1500 560";

function Index() {
  const { posts } = Route.useLoaderData();

  return (
    <>
      <Hero />

      {/* Latest writing */}
      <section className="relative overflow-hidden bg-cream pt-28 pb-24">
        <svg
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          className="absolute top-10 left-0 h-[600px] w-full"
          aria-hidden="true"
        >
          <path
            d="M-40 420 C 300 260, 700 520, 1040 330 S 1400 220, 1500 260"
            fill="none"
            stroke="#C9C4EE"
            strokeWidth="90"
            strokeLinecap="round"
            opacity=".35"
          />
          <path
            d="M-40 420 C 300 260, 700 520, 1040 330 S 1400 220, 1500 260"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            opacity=".9"
          />
        </svg>
        <Grain opacity={0.14} />
        <div className="relative mx-auto flex max-w-[1240px] flex-col gap-12 px-5 sm:px-8">
          <SectionHeading
            kicker="fresh from the desk"
            title="Latest writing"
            link={{ to: "/blog", label: "All posts" }}
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] gap-7">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="glass lift flex flex-col gap-[18px] rounded-[32px] p-9 text-ink no-underline"
              >
                {post.date && (
                  <time dateTime={post.date} className="text-[13px] text-muted">
                    {formatPostDate(post.date)}
                  </time>
                )}
                <h3 className="m-0 text-[32px] leading-[1.12] font-medium tracking-[-0.025em]">
                  {post.title}
                </h3>
                <p className="m-0 font-serif text-[19px] leading-relaxed text-ink-soft">
                  {post.description ?? post.preview}
                </p>
                {post.tags.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Makers */}
      <section
        aria-label="Decorative scene: makers at work"
        className="relative overflow-hidden bg-linear-to-b from-cream to-[#F4E6E3] pt-10 pb-16"
      >
        <svg
          viewBox="0 0 1440 500"
          preserveAspectRatio="none"
          className="absolute bottom-8 left-0 h-[300px] w-full"
          aria-hidden="true"
        >
          <path
            d="M-40 260 C 300 160, 640 330, 980 200 S 1380 120, 1500 160"
            fill="none"
            stroke="#F3C29C"
            strokeWidth="80"
            strokeLinecap="round"
            opacity=".35"
          />
          <path
            d="M-40 260 C 300 160, 640 330, 980 200 S 1380 120, 1500 160"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            opacity=".9"
          />
        </svg>
        <Grain opacity={0.14} />
        <div className="relative mx-auto flex max-w-[1240px] flex-col gap-2 px-5 sm:px-8">
          <p className="m-0 -rotate-1 self-end font-hand text-[22px] text-rust/70">
            everyone's making something — hover to wake them
          </p>
          <Makers />
        </div>
      </section>

      {/* On the shelf */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#F4E6E3] via-[#EFE3F0] to-lilac py-28">
        <Grain opacity={0.16} />
        <div className="relative mx-auto flex max-w-[1240px] flex-col gap-12 px-5 sm:px-8">
          <SectionHeading
            kicker="ideas I keep returning to"
            kickerClass="text-violet"
            title="On the shelf"
            link={{ to: "/reading-list", label: "Full reading list" }}
          />
          <Shelf3D mode="link" books={BOOKS} tags={BOOK_TAGS} />
        </div>
      </section>

      {/* Night: ask the site */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_60%_20%,#262A5C_0%,#11122A_55%,#08081A_100%)] pt-36 pb-32 text-moon">
        <svg
          viewBox="0 0 1440 700"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M-60 560 C 280 380, 620 640, 960 420 S 1380 260, 1520 330"
            fill="none"
            stroke="#9FB4FF"
            strokeWidth="1.5"
            opacity=".55"
          />
          <path
            d="M-60 590 C 300 420, 640 670, 980 450 S 1390 300, 1520 370"
            fill="none"
            stroke="#C7B5FF"
            strokeWidth="1"
            opacity=".4"
          />
          <path
            d="M-60 620 C 320 460, 660 700, 1000 480 S 1400 340, 1520 410"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            opacity=".7"
          />
        </svg>
        <Grain opacity={0.08} screen />
        <div className="pointer-events-none absolute bottom-0 left-[5%] hidden lg:block">
          <DeskWriter className="decor-night h-[290px] w-[320px]" />
        </div>
        <div className="relative mx-auto flex max-w-[900px] flex-col items-center gap-7 px-5 text-center sm:px-8">
          <p className="glow m-0 -rotate-2 font-hand text-5xl leading-none text-[#F4F7FF] sm:text-[64px]">
            ask me what I'd build next
          </p>
          <p className="m-0 max-w-[560px] text-[19px] leading-relaxed text-moon-muted">
            The site has a built-in assistant. Search posts, books and tools, or ask a question in
            plain words.
          </p>
          <button
            type="button"
            onClick={openCommandAgent}
            className="flex min-h-16 w-full max-w-[620px] cursor-pointer items-center gap-3.5 rounded-[22px] border border-[rgba(190,205,255,.35)] bg-white/6 px-[22px] text-left font-sans text-[17px] text-moon-muted shadow-[0_0_40px_-8px_rgba(120,150,255,.5)] hover:bg-white/10"
          >
            <SearchIcon size={20} />
            <span className="flex-1">Which book should I read first?</span>
            <kbd className="rounded-lg bg-white/10 px-2 py-1 font-sans text-[13px] text-moon">
              ⌘K
            </kbd>
          </button>
        </div>
      </section>
    </>
  );
}

function Hero() {
  return (
    <WishSky className="relative min-h-[820px] cursor-crosshair overflow-hidden bg-linear-to-b from-[#8E9BE6] via-[#B4BCF0] via-35% to-[#F6CFAE]">
      <Cloud
        style={{
          width: 520,
          height: 180,
          left: -80,
          top: 120,
          background: "#F9D9BC",
          opacity: 0.85,
        }}
      />
      <Cloud
        style={{
          width: 460,
          height: 150,
          right: -60,
          top: 70,
          background: "#FBE3CC",
          opacity: 0.8,
          animationDuration: "32s",
        }}
      />
      <Cloud
        style={{
          width: 640,
          height: 200,
          left: "30%",
          top: 520,
          background: "#FFE9D6",
          opacity: 0.7,
          animationDuration: "38s",
        }}
      />
      <Cloud
        style={{
          width: 380,
          height: 140,
          right: "12%",
          top: 380,
          background: "#C9B8EC",
          opacity: 0.7,
          animationDuration: "29s",
        }}
      />

      <svg
        viewBox="0 0 1440 820"
        preserveAspectRatio="none"
        className="absolute inset-0 hidden h-full w-full md:block"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ribbonA" x1="0" x2="1">
            <stop offset="0" style={{ stopColor: "#fff", stopOpacity: 0 }} />
            <stop offset=".45" style={{ stopColor: "#fff", stopOpacity: 0.85 }} />
            <stop offset="1" style={{ stopColor: "#F3B98D", stopOpacity: 0.2 }} />
          </linearGradient>
          <linearGradient id="ribbonB" x1="0" x2="1">
            <stop offset="0" style={{ stopColor: "#E88A4F", stopOpacity: 0 }} />
            <stop offset=".5" style={{ stopColor: "#E88A4F", stopOpacity: 0.75 }} />
            <stop offset="1" style={{ stopColor: "#7DA453", stopOpacity: 0.4 }} />
          </linearGradient>
        </defs>
        <path
          d={HERO_RIBBON}
          fill="none"
          stroke="url(#ribbonB)"
          strokeWidth="34"
          strokeLinecap="round"
        />
        <path
          d="M-40 720 C 280 600, 540 790, 840 670 S 1310 520, 1500 600"
          fill="none"
          stroke="url(#ribbonA)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M-60 300 C 300 220, 600 360, 980 250 S 1380 150, 1520 200"
          fill="none"
          stroke="url(#ribbonA)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity=".7"
        />
      </svg>

      <Grain opacity={0.22} />

      {/* Above the hero copy (z-[3]) so they can be hovered; only the walkers take pointer events. */}
      <RibbonWalkers
        d={HERO_RIBBON}
        viewBox="0 0 1440 820"
        className="absolute inset-0 z-[3] hidden h-full w-full md:block"
        walkers={[
          { at: 0.66, color: "#E07A3F" },
          { at: 0.68, color: "#7DA453" },
          { at: 0.85, color: "#F4F7FF", size: 18, opacity: 0.6 },
        ]}
      />

      {/*
       * The writer sits on a centered 1440px stage so he lines up with the copy.
       * The stage is above the copy (z-[3]) so he can be hovered and clicked;
       * it ignores pointer events everywhere else.
       */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-[3] hidden h-[820px] w-[1440px] -translate-x-1/2 lg:block">
        <PlushWriter
          className="pointer-events-auto absolute top-[190px] left-[40px] h-[440px] w-[300px]"
          fallback={
            <SkyWriter className="decor pointer-events-auto absolute top-[147px] left-[134px] h-[491px] w-[222px]" />
          }
        />
      </div>

      <div className="relative z-[2] mx-auto flex max-w-[1240px] flex-col items-center gap-7 px-5 pt-44 pb-16 text-center sm:px-8 sm:pt-52">
        <p className="glow m-0 -rotate-3 font-hand text-[34px] text-[#F4F7FF]">
          a future worth building
        </p>
        <h1 className="m-0 text-[56px] leading-[0.98] font-medium tracking-[-0.045em] text-olive sm:text-[104px]">
          Read. Think. Code.
        </h1>
        <p className="m-0 max-w-[620px] text-xl leading-relaxed text-ink-soft">
          Software engineer crafting digital experiences. Notes on frontend architecture, developer
          tooling, and the books that shape how I build.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            to="/blog"
            className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-ink px-[26px] text-base font-medium text-white no-underline hover:bg-indigo-deep"
          >
            Read the writing <ArrowRight />
          </Link>
          <button
            type="button"
            onClick={openCommandAgent}
            className="glass inline-flex min-h-[52px] cursor-pointer items-center rounded-full px-6 font-sans text-base font-medium text-ink"
          >
            Ask the site anything
          </button>
        </div>
      </div>
    </WishSky>
  );
}
