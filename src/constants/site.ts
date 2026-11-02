// Canonical origin for absolute URLs (sitemap, RSS, canonical + og tags).
// The site is served at www.xiaofengxie.dev (the Fly app is only an origin).
// Override at build time with VITE_SITE_URL, or at runtime (server routes
// only) with SITE_URL.
const DEFAULT_SITE_URL = "https://www.xiaofengxie.dev";

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, "");

export const SITE_URL = stripTrailingSlash(import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL);

/** Server-only: allows a runtime SITE_URL to win over the build-time value. */
export const getSiteUrl = () => stripTrailingSlash(process.env.SITE_URL || SITE_URL);

const SITE_NAME = "Xiaofeng Xie";
export const SITE_TITLE = "Xiaofeng's Blog";
export const SITE_DESCRIPTION = "Personal blog of Xiaofeng Xie - Software Engineer";
const OG_IMAGE_PATH = "/og-image.png";

type PageMetaInput = {
  title: string;
  description: string;
  /** Route path, e.g. "/blog" or "/blog/my-post". */
  path: string;
  type?: "website" | "article";
  /** ISO date an article was published (articles only). */
  publishedTime?: string;
};

/** Shared meta + canonical link for a route's `head()`. */
export const pageMeta = ({
  title,
  description,
  path,
  type = "website",
  publishedTime,
}: PageMetaInput) => {
  const url = `${SITE_URL}${path}`;
  const image = `${SITE_URL}${OG_IMAGE_PATH}`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      ...(publishedTime ? [{ property: "article:published_time", content: publishedTime }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
};

/**
 * schema.org BlogPosting data for a post, as a JSON-LD script for `head()`.
 * `<` is escaped so a title can never close the script tag early.
 */
export const articleJsonLd = (post: {
  title: string;
  description: string;
  slug: string;
  date?: string;
  tags: readonly string[];
}) => ({
  type: "application/ld+json",
  children: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    image: `${SITE_URL}${OG_IMAGE_PATH}`,
    ...(post.date ? { datePublished: post.date } : {}),
    keywords: post.tags.join(", "),
    author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
  }).replace(/</g, "\\u003c"),
});
