/** Start once a CSS-visible canvas approaches the viewport, then stop observing. */
export function whenNearViewport(canvas: HTMLCanvasElement, start: () => void) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      // display:none canvases (the mobile bookshelf) must not initialize WebGL.
      if (!entry?.isIntersecting || !canvas.clientWidth || !canvas.clientHeight) return;
      observer.disconnect();
      start();
    },
    { rootMargin: "200px" },
  );
  observer.observe(canvas);
  return () => observer.disconnect();
}
