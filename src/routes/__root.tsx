import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import stylesheet from "../tailwind.css?url"
import { getRouter } from '../router'
import { Layout } from "../components/Layout/Layout"

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
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
      { title: "Xiaofeng's Blog" },
      { name: "description", content: "Personal blog of Xiaofeng Xie - Software Engineer" }
    ],
    links: [
      { rel: "stylesheet", href: stylesheet },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "true" },
      { href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap", rel: "stylesheet" }
    ],
  }),
  errorComponent: ErrorBoundary,
  component: RootLayout,
})

function ErrorBoundary({ error }: { error: unknown }) {
  // Log error to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('ErrorBoundary caught an error:', error);
  }

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return "An unexpected error occurred. Don't worry, it happens!";
  };

  const getErrorStack = (error: unknown): string | null => {
    if (error instanceof Error && process.env.NODE_ENV === 'development') {
      return error.stack ?? null;
    }
    return null;
  };

  const errorMessage = getErrorMessage(error);
  const errorStack = getErrorStack(error);

  return (
    <html
      lang="en"
      className="h-full bg-background text-text-main"
    >
      <head>
        <title>Oh no!</title>
        <HeadContent />
      </head>
      <body className="flex justify-center items-center min-h-screen">
        <div className="relative p-8 max-w-xl mx-4 text-center">
          <h1 className="text-3xl font-bold text-primary mb-6 max-w-full">
            Oops! Something went wrong...
          </h1>
          <p className="text-lg text-text-muted mb-6">
            {errorMessage}
          </p>

          {errorStack && (
            <details className="mb-6">
              <summary className="cursor-pointer text-text-main mb-2">Show Error Details</summary>
              <pre className="bg-surface p-4 rounded-lg text-sm text-text-muted overflow-x-auto max-h-32 border border-surface-hover animate-fade-in text-left">
                {errorStack}
              </pre>
            </details>
          )}

          <a
            href="/"
            className="inline-block bg-primary text-white text-sm font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl animate-fade-in"
          >
            Take me Home
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
  )
}
