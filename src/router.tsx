import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // Start loading a page's data when its link is hovered or focused.
    defaultPreload: "intent",
  });

  return router;
}
