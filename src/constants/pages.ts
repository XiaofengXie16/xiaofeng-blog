/**
 * The site's top-level pages, in one place for the header nav, the command
 * palette and the sitemap.
 */
export const PAGES = [
  { to: "/", label: "Home", nav: null, description: "Go to the landing page" },
  { to: "/blog", label: "Writing", nav: "Writing", description: "Browse all blog posts" },
  {
    to: "/reading-list",
    label: "Reading list",
    nav: "Reading",
    description: "Books and reading recommendations",
  },
  { to: "/tool", label: "Toolkit", nav: "Toolkit", description: "Developer tools and utilities" },
] as const;

export type Page = (typeof PAGES)[number];
export type PagePath = Page["to"];

/** Pages shown in the header, with their short nav labels. */
export const NAV_LINKS = PAGES.flatMap((page) =>
  page.nav ? [{ to: page.to, label: page.nav }] : [],
);
