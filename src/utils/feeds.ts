/** Builders for the XML feeds (sitemap.xml and rss.xml). Pure, so they can be tested. */

type FeedPost = {
  slug: string;
  title: string;
  date?: string;
  description?: string;
  preview: string;
  tags: readonly string[];
};

const XML_ESCAPES: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
};

export const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => XML_ESCAPES[char] ?? char);

/** RFC 822 date for RSS, or undefined when the date is missing or invalid. */
export function toRfc822(date: string | undefined) {
  if (!date) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toUTCString();
}

const postUrl = (origin: string, slug: string) => `${origin}/blog/${slug}`;

export function buildSitemap({
  origin,
  paths,
  posts,
}: {
  origin: string;
  paths: readonly string[];
  posts: readonly FeedPost[];
}) {
  const urls = [
    ...paths.map((path) => ({ loc: `${origin}${path}`, lastmod: undefined })),
    ...posts.map((post) => ({ loc: postUrl(origin, post.slug), lastmod: post.date })),
  ];
  const entries = urls
    .map(
      ({ loc, lastmod }) =>
        `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ""}</url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

export function buildRss({
  origin,
  title,
  description,
  posts,
}: {
  origin: string;
  title: string;
  description: string;
  posts: readonly FeedPost[];
}) {
  const items = posts
    .map((post) => {
      const link = escapeXml(postUrl(origin, post.slug));
      const pubDate = toRfc822(post.date);
      const lines = [
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <description>${escapeXml(post.description ?? post.preview)}</description>`,
        ...(pubDate ? [`      <pubDate>${pubDate}</pubDate>`] : []),
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
      ];
      return `    <item>\n${lines.join("\n")}\n    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(origin)}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <atom:link href="${escapeXml(`${origin}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}
