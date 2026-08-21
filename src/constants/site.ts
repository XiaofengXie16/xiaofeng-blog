// Canonical origin for absolute URLs (sitemap, RSS, canonical + og tags).
//
// `xiaofeng.dev` belongs to someone else, so the Fly hostname is the default.
// Override at build time with VITE_SITE_URL, or at runtime (server routes
// only) with SITE_URL.
const DEFAULT_SITE_URL = "https://xiaofeng-blog.fly.dev";

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, "");

export const SITE_URL = stripTrailingSlash(import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL);

/** Server-only: allows a runtime SITE_URL to win over the build-time value. */
export const getSiteUrl = () => stripTrailingSlash(process.env.SITE_URL || SITE_URL);

export const SITE_NAME = "Xiaofeng Xie";
export const SITE_TITLE = "Xiaofeng's Blog";
export const SITE_DESCRIPTION = "Personal blog of Xiaofeng Xie - Software Engineer";
export const OG_IMAGE_PATH = "/og-image.png";

type PageMetaInput = {
  title: string;
  description: string;
  /** Route path, e.g. "/blog" or "/blog/my-post". */
  path: string;
  type?: "website" | "article";
};

/** Shared meta + canonical link for a route's `head()`. */
export const pageMeta = ({ title, description, path, type = "website" }: PageMetaInput) => {
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
    ],
    links: [{ rel: "canonical", href: url }],
  };
};
