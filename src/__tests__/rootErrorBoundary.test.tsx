import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { render, waitFor } from "@testing-library/react";
import {
  RouterProvider,
  createMemoryHistory,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Route as rootRoute } from "~/routes/__root";

// A route that always throws while rendering, so the root route's
// `errorComponent` runs for a real render failure.
const boomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/boom",
  component: () => {
    throw new Error("boom in render");
  },
});

const renderAt = (pathname: string) => {
  const router = createRouter({
    routeTree: rootRoute.addChildren([boomRoute]),
    history: createMemoryHistory({ initialEntries: [pathname] }),
  });
  return render(<RouterProvider router={router} />);
};

// The boundary emits one JSON line through the shared logger; pull it out of
// the console.error calls React also makes for a thrown render error.
const loggedEvent = (spy: { mock: { calls: unknown[][] } }, event: string) => {
  for (const call of spy.mock.calls) {
    const line = String(call[0]);
    if (!line.startsWith("{")) continue;
    const record = JSON.parse(line) as Record<string, unknown>;
    if (record.event === event) return record;
  }
  return undefined;
};

describe("root route error boundary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports the failing route from router state, not window.location", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderAt("/boom");

    await waitFor(() => {
      expect(loggedEvent(spy, "route.render_error")).toBeDefined();
    });

    const record = loggedEvent(spy, "route.render_error");
    // jsdom's window.location is "/", so this only holds when the path is read
    // from the router's own location — the source that also exists on the server.
    expect(record).toMatchObject({
      level: "error",
      event: "route.render_error",
      path: "/boom",
      errorMessage: "boom in render",
    });
    expect(window.location.pathname).toBe("/");
  });
});
