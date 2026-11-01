import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import invariant from "tiny-invariant";

import { fetchBlogPostBySlug } from "~/server/blog.functions";
import { pageMeta } from "~/constants/site";
import { Cloud, Grain } from "~/components/design/Atmosphere";
import { ArrowRight } from "~/components/design/Section";
import { CapsuleReader } from "~/components/figures/Figures";
import { ReadingProgress } from "~/components/blog/ReadingProgress";
import { formatPostDate } from "~/utils/format";

type LoaderData = {
  title: string;
  content: string;
  description: string;
  slug: string;
  date?: string;
  tags: string[];
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;
    invariant(slug, "Expected 'slug' parameter");

    const post = await fetchBlogPostBySlug({ data: slug });

    if (!post) {
      throw notFound();
    }

    return {
      title: post.title,
      content: post.html,
      description: post.description ?? post.preview,
      slug,
      date: post.date,
      tags: post.tags,
    } satisfies LoaderData;
  },
  head: ({ loaderData }) =>
    pageMeta({
      title: `${loaderData?.title ?? "Blog Post"} | Xiaofeng Xie`,
      description: loaderData?.description ?? "Software engineering article by Xiaofeng Xie.",
      path: `/blog/${loaderData?.slug ?? ""}`,
      type: "article",
    }),
  component: BlogPost,
  notFoundComponent: PostNotFound,
});

function PostNotFound() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#A3ADEC] to-[#F5D2B5] px-5 pt-48 pb-32 text-center">
      <Grain />
      <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6">
        <p className="glow m-0 -rotate-2 font-hand text-4xl text-[#F4F7FF]">
          this future wasn't written
        </p>
        <h1 className="m-0 text-5xl font-medium tracking-[-0.04em] text-olive sm:text-6xl">
          Post not found
        </h1>
        <p className="m-0 text-lg text-ink-soft">
          The post you're looking for doesn't exist, or it moved.
        </p>
        <Link
          to="/blog"
          className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-ink px-[26px] font-medium text-white no-underline hover:bg-indigo-deep"
        >
          Back to all writing <ArrowRight />
        </Link>
      </div>
    </section>
  );
}

function BlogPost() {
  const { title, content, date, tags } = Route.useLoaderData();

  return (
    <>
      <ReadingProgress />
      <section className="relative overflow-hidden bg-linear-to-b from-[#9AA6EA] via-[#CFC4E8] via-55% to-[#F5D6BC] pb-24">
        <Cloud
          style={{
            width: 560,
            height: 170,
            left: -80,
            top: 180,
            background: "#FBDCC0",
            opacity: 0.85,
          }}
        />
        <Cloud
          style={{
            width: 420,
            height: 140,
            right: 0,
            top: 80,
            background: "#FFE8D4",
            opacity: 0.7,
            animationDuration: "31s",
          }}
        />
        <Grain />
        <div className="relative z-[2] mx-auto flex max-w-[1240px] flex-wrap items-end gap-12 px-5 pt-40 sm:px-8">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-[22px]">
            <Link
              to="/blog"
              className="self-start py-2.5 text-[15px] font-medium text-ink no-underline hover:text-indigo"
            >
              ← All writing
            </Link>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="glass rounded-full px-3 py-1.5 text-[13px] text-indigo"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="m-0 text-[44px] leading-[1.02] font-medium tracking-[-0.045em] text-olive sm:text-[76px]">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-[15px] text-ink-soft">
              <span className="font-semibold">Xiaofeng Xie</span>
              {date && (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={date}>{formatPostDate(date)}</time>
                </>
              )}
            </div>
          </div>
          <div className="pointer-events-none hidden flex-[1_1_260px] justify-center md:flex">
            <CapsuleReader className="h-[330px] w-[300px]" />
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-[1240px] px-5 pt-20 pb-24 sm:px-8">
        <div
          className="
            prose prose-lg mx-auto max-w-[720px] font-serif text-[#2A2E4D]
            prose-p:text-[21px] prose-p:leading-[1.7] prose-li:text-[21px]
            prose-headings:font-sans prose-headings:font-medium prose-headings:tracking-[-0.03em] prose-headings:text-ink
            prose-h2:mt-14 prose-h2:text-[34px] prose-h3:text-[26px]
            prose-a:text-indigo prose-a:decoration-indigo/30 prose-a:underline-offset-4 hover:prose-a:decoration-indigo
            prose-strong:text-ink marker:text-rust
            prose-code:rounded-md prose-code:bg-lilac/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:text-indigo-deep
            prose-code:before:content-none prose-code:after:content-none
            prose-pre:rounded-[22px] prose-pre:bg-[#14152E] prose-pre:text-[#DCE2FF]
            prose-blockquote:rounded-[28px] prose-blockquote:border-0 prose-blockquote:bg-linear-to-br prose-blockquote:from-[#9BA6EA]/20 prose-blockquote:to-[#F5D6BC]/35
            prose-blockquote:px-8 prose-blockquote:py-6 prose-blockquote:font-hand prose-blockquote:text-[30px] prose-blockquote:leading-tight prose-blockquote:not-italic prose-blockquote:text-indigo
            prose-img:rounded-[22px]
            prose-pre:text-[15px] prose-pre:leading-[1.7] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[#DCE2FF]
          "
          // Rendered from the site's own markdown files at build time.
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>

      <section className="mx-auto max-w-[1240px] px-5 pb-30 sm:px-8">
        <Link
          to="/blog"
          className="glass flex flex-wrap items-center justify-between gap-5 rounded-[32px] bg-linear-to-r from-[#9BA6EA]/35 to-[#F5D6BC]/50 px-10 py-9 text-ink no-underline"
        >
          <span className="flex flex-col gap-2">
            <span className="font-hand text-2xl text-rust">keep reading</span>
            <span className="text-[28px] font-medium tracking-[-0.02em]">More writing</span>
          </span>
          <ArrowRight size={28} />
        </Link>
      </section>
    </>
  );
}
