import { createFileRoute } from "@tanstack/react-router";
import { SITE_DESCRIPTION, SITE_TITLE, getSiteUrl } from "~/constants/site";
import { getAllBlogPostSummaries } from "~/utils/blogData";
import { buildRss } from "~/utils/feeds";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          buildRss({
            origin: getSiteUrl(),
            title: SITE_TITLE,
            description: SITE_DESCRIPTION,
            posts: getAllBlogPostSummaries(),
          }),
          {
            headers: {
              "Content-Type": "application/rss+xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          },
        ),
    },
  },
});
