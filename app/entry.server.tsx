/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
// @ts-ignore
import { renderToReadableStream } from "react-dom/server.browser";

export default async function handleRequest(
  request: Request,
  status: number,
  headers: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  let userAgent = request.headers.get("user-agent");

  let stream = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: any) {
        console.error(error);
        status = 500;
      },
    },
  );

  if (userAgent && isbot(userAgent)) await stream.allReady;
  else headers.set("Transfer-Encoding", "chunked");

  headers.set("Content-Type", "text/html; charset=utf-8");

  return new Response(stream, { status, headers });
}
