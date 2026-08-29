import { createFileRoute } from "@tanstack/react-router";
import { getSiteUrl } from "~/constants/site";
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

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const origin = getSiteUrl();
        const posts = getAllBlogPostSummaries();

        const staticPaths = ["/", "/blog", "/reading-list", "/tool", "/services"];
        const urls = [
          ...staticPaths.map((path) => ({ loc: `${origin}${path}`, lastmod: undefined })),
          ...posts.map((post) => ({
            loc: `${origin}/blog/${post.slug}`,
            lastmod: post.date,
          })),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod }) =>
      `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ""}</url>`,
  )
  .join("\n")}
</urlset>
`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
