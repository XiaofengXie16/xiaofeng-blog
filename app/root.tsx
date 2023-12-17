import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { withSentry } from "@sentry/remix";

import "./tailwind.css";
export const meta = () => {
    return [
        { title: "Xiaofeng's Blog" },
        { charset: "utf-8" },
        { viewport: "width=device-width,initial-scale=1" },
    ];
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
        <LiveReload />
      </body>
    </html>
  );
}
export default withSentry(App);
