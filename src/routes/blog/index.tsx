import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchAllBlogPosts } from "~/server/blog.functions";
import { pageMeta } from "~/constants/site";
import { Cloud, Grain } from "~/components/design/Atmosphere";
import { PageTitle, Tag } from "~/components/design/Section";
import { formatPostDate } from "~/utils/format";

export const Route = createFileRoute("/blog/")({
  loader: async () => ({ posts: await fetchAllBlogPosts() }),
  head: () =>
    pageMeta({
      title: "Blog | Xiaofeng Xie",
      description:
        "Software engineering articles by Xiaofeng Xie on architecture, frontend systems, and developer tooling.",
      path: "/blog",
    }),
  component: Posts,
});

const ALL = "all";

function Posts() {
  const { posts } = Route.useLoaderData();
  const [topic, setTopic] = useState<string>(ALL);

  const topics = [ALL, ...new Set(posts.flatMap((p) => p.tags))];
  const visible = topic === ALL ? posts : posts.filter((p) => p.tags.includes(topic));

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-[#A3ADEC] via-[#D7C6E4] via-60% to-[#F5D2B5] pb-32">
        <Cloud
          style={{
            width: 520,
            height: 170,
            left: -60,
            top: 160,
            background: "#FBDCC0",
            opacity: 0.85,
          }}
        />
        <Cloud
          style={{
            width: 420,
            height: 150,
            right: -40,
            top: 90,
            background: "#FFE8D4",
            opacity: 0.75,
            animationDuration: "33s",
          }}
        />
        <Grain />
        <div className="relative z-[2] mx-auto max-w-[1240px] px-5 pt-44 sm:px-8">
          <PageTitle
            kicker="notes from the workbench"
            title="Writing"
            intro="Long-form notes on frontend architecture, micro-frontends and the tools I lean on every day."
          />
        </div>
      </section>

      <section className="relative -mt-16 overflow-hidden pb-30">
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          className="absolute top-30 left-0 h-[900px] w-full"
          aria-hidden="true"
        >
          <path
            d="M1500 120 C 1120 260, 840 40, 520 260 S 80 520, -60 460"
            fill="none"
            stroke="#C9C4EE"
            strokeWidth="110"
            strokeLinecap="round"
            opacity=".3"
          />
          <path
            d="M1500 120 C 1120 260, 840 40, 520 260 S 80 520, -60 460"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
          />
        </svg>
        <div className="relative mx-auto flex max-w-[1240px] flex-col gap-9 px-5 sm:px-8">
          {topics.length > 1 && (
            <div
              role="group"
              aria-label="Filter by topic"
              className="glass flex flex-wrap gap-1.5 self-start rounded-[28px] p-1.5"
            >
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={topic === t}
                  onClick={() => setTopic(t)}
                  className={`min-h-11 cursor-pointer rounded-full border-0 px-[18px] font-sans text-sm font-medium ${
                    topic === t
                      ? "bg-ink text-white"
                      : "bg-transparent text-ink-soft hover:bg-white/40"
                  }`}
                >
                  {t === ALL ? "All posts" : t}
                </button>
              ))}
            </div>
          )}

          <ol className="m-0 flex list-none flex-col gap-5 p-0">
            {visible.map((post, index) => (
              <li key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="glass grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-12 gap-y-6 rounded-[32px] p-8 text-ink no-underline transition-transform duration-300 hover:translate-x-1.5 sm:p-10"
                >
                  <div className="flex flex-col gap-2.5">
                    <span className="font-hand text-[26px] text-rust">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {post.date && (
                      <time dateTime={post.date} className="text-sm text-muted">
                        {formatPostDate(post.date)}
                      </time>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col gap-3.5 sm:col-span-2">
                    <h2 className="m-0 text-[28px] leading-[1.1] font-medium tracking-[-0.03em] sm:text-4xl">
                      {post.title}
                    </h2>
                    <p className="m-0 font-serif text-xl leading-relaxed text-ink-soft">
                      {post.description ?? post.preview}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ol>

          {visible.length === 0 && (
            <p className="m-0 p-10 text-center font-hand text-3xl text-violet">
              nothing here yet — this future is still being written
            </p>
          )}
        </div>
      </section>
    </>
  );
}
