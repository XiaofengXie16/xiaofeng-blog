import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from "react-router";
// import { withSentry } from "@sentry/remix";

import stylesheet from "./tailwind.css?url";

export const links = () => [
    { rel: "stylesheet", href: stylesheet },
];

export const meta = () => {
  return [
    { title: "Xiaofeng's Blog" },
    { charset: "utf-8" },
    { viewport: "width=device-width,initial-scale=1" },
  ];
};

export const ErrorBoundary = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <html
      lang="en"
      className="h-full bg-gray-700 text-gray-300"
    >
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex justify-center items-center min-h-screen">
        <div className="relative p-8 max-w-xl mx-4 text-center">
          <h1 className="text-3xl font-bold text-pink-300 mb-6 max-w-full">
            Oops! Something went wrong...
          </h1>
          <p className="text-lg text-gray-400 mb-6">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred. Don’t worry, it happens!"}
          </p>

          {error instanceof Error && (
            <pre className="bg-gray-700 p-4 rounded-lg text-sm text-gray-400 overflow-x-auto mb-6 max-h-32 border border-gray-600 animate-fade-in">
              {error.stack}
            </pre>
          )}

          <a
            href="/"
            className="inline-block bg-gradient-to-br from-pink-500 to-pink-600 text-white text-sm font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl animate-fade-in"
          >
            Take me Home
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
};
function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default App;
// export default withSentry(App);
