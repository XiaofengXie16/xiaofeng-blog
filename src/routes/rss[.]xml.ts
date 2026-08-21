import { createFileRoute } from "@tanstack/react-router";
import { SITE_DESCRIPTION, SITE_TITLE, getSiteUrl } from "~/constants/site";
import { getAllBlogPostSummaries } from "~/utils/blogData";

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      default:
        return "&quot;";
    }
  });

const toRfc822 = (date: string | undefined) => {
  if (!date) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toUTCString();
};

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: () => {
        const origin = getSiteUrl();
        const posts = getAllBlogPostSummaries();

        const items = posts
          .map((post) => {
            const link = `${origin}/blog/${post.slug}`;
            const pubDate = toRfc822(post.date);
            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(post.description ?? post.preview)}</description>${
        pubDate ? `\n      <pubDate>${pubDate}</pubDate>` : ""
      }${post.tags.map((tag) => `\n      <category>${escapeXml(tag)}</category>`).join("")}
    </item>`;
          })
          .join("\n");

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(origin)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${escapeXml(`${origin}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
