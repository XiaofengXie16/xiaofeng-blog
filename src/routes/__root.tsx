import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import stylesheet from "~/tailwind.css?url";
import { getRouter } from "~/router";
import { Layout } from "~/components/Layout/Layout";
import { NotFound } from "~/components/NotFound";
import { SkyMessage, pillButtonClass } from "~/components/design/SkyMessage";
import { SITE_DESCRIPTION, SITE_TITLE, pageMeta } from "~/constants/site";

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...pageMeta({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: "/" }).meta,
    ],
    links: [
      { rel: "stylesheet", href: stylesheet },
      { rel: "alternate", type: "application/rss+xml", title: SITE_TITLE, href: "/rss.xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        href: "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Instrument+Sans:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap",
        rel: "stylesheet",
      },
    ],
  }),
  errorComponent: ErrorBoundary,
  notFoundComponent: NotFound,
  component: RootLayout,
});

function ErrorBoundary({ error }: { error: unknown }) {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) console.error("ErrorBoundary caught an error:", error);

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "An unexpected error occurred. Don't worry, it happens!";
  const stack = isDev && error instanceof Error ? error.stack : undefined;

  // The error replaces the whole document (no layout), so it renders its own shell.
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <HeadContent />
      </head>
      <body className="font-sans text-ink">
        <SkyMessage
          kicker="a cloud got in the way"
          title="Something went wrong"
          className="flex min-h-screen items-center justify-center pt-32"
          action={
            <a href="/" className={pillButtonClass}>
              Take me home
            </a>
          }
        >
          <p className="m-0 text-lg text-ink-soft">{message}</p>
          {stack && (
            <details className="w-full text-left">
              <summary className="cursor-pointer text-ink">Show error details</summary>
              <pre className="mt-2 max-h-32 overflow-x-auto rounded-2xl bg-[#14152E] p-4 text-sm text-[#DCE2FF]">
                {stack}
              </pre>
            </details>
          )}
        </SkyMessage>
        <Scripts />
      </body>
    </html>
  );
}

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <Scripts />
        <TanStackRouterDevtools />
      </body>
    </html>
  );
}
