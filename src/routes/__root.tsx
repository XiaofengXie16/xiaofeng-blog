import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import stylesheet from "../tailwind.css?url";
import { getRouter } from "../router";
import { Layout } from "../components/Layout/Layout";
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
  component: RootLayout,
});

function ErrorBoundary({ error }: { error: unknown }) {
  // Log error to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("ErrorBoundary caught an error:", error);
  }

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "An unexpected error occurred. Don't worry, it happens!";
  };

  const getErrorStack = (error: unknown): string | null => {
    if (error instanceof Error && process.env.NODE_ENV === "development") {
      return error.stack ?? null;
    }
    return null;
  };

  const errorMessage = getErrorMessage(error);
  const errorStack = getErrorStack(error);

  return (
    <html lang="en" className="h-full">
      <head>
        <title>Oh no!</title>
        <HeadContent />
      </head>
      <body className="flex min-h-screen items-center justify-center bg-linear-to-b from-[#A3ADEC] to-[#F5D2B5] font-sans text-ink">
        <div className="mx-4 flex max-w-xl flex-col items-center gap-6 p-8 text-center">
          <p className="glow m-0 -rotate-2 font-hand text-4xl text-[#F4F7FF]">
            a cloud got in the way
          </p>
          <h1 className="m-0 text-4xl font-medium tracking-[-0.04em] text-olive">
            Something went wrong
          </h1>
          <p className="m-0 text-lg text-ink-soft">{errorMessage}</p>

          {errorStack && (
            <details className="w-full text-left">
              <summary className="cursor-pointer text-ink">Show error details</summary>
              <pre className="mt-2 max-h-32 overflow-x-auto rounded-2xl bg-[#14152E] p-4 text-sm text-[#DCE2FF]">
                {errorStack}
              </pre>
            </details>
          )}

          <a
            href="/"
            className="inline-flex min-h-[52px] items-center rounded-full bg-ink px-8 font-medium text-white no-underline hover:bg-indigo-deep"
          >
            Take me home
          </a>
        </div>
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
