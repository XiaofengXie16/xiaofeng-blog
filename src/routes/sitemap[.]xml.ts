import { createFileRoute } from "@tanstack/react-router";
import { PAGES } from "~/constants/pages";
import { getSiteUrl } from "~/constants/site";
import { getAllBlogPostSummaries } from "~/utils/blogData";
import { buildSitemap } from "~/utils/feeds";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          buildSitemap({
            origin: getSiteUrl(),
            paths: PAGES.map((page) => page.to),
            posts: getAllBlogPostSummaries(),
          }),
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          },
        ),
    },
  },
});
