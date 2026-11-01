import { useEffect, useRef, useState } from "react";
import { Bookshelf } from "~/components/design/Bookshelf";
import { shortTitle } from "~/utils/format";
import type { ShelfHandle } from "./shelf3d";

type Book = { name: string; icon: string; link: string };
type Props = {
  books: readonly Book[];
  tags?: readonly string[];
} & ({ mode: "link" } | { mode: "select"; picked: number; onPick: (index: number) => void });

const TAG_COLORS = ["text-moss", "text-rust", "text-violet"];

/**
 * The bookshelf in 3D from md up: real books on a soft ledge, with a row of
 * labels underneath that are the accessible links/buttons (focusing one pulls
 * its book out). Narrow screens, and browsers without WebGL, get the flat
 * scrolling shelf instead.
 */
export function Shelf3D(props: Props) {
  const { books, tags } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<ShelfHandle | null>(null);
  const propsRef = useRef(props);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    propsRef.current = props;
  });

  const picked = props.mode === "select" ? props.picked : null;
  useEffect(() => {
    handleRef.current?.setPicked(picked);
  }, [picked, state]);

  const covers = books.map((b) => b.icon).join("|");
  useEffect(() => {
    let cancelled = false;
    import("./shelf3d")
      .then(({ mountShelf3D }) => {
        const canvas = canvasRef.current;
        if (cancelled || !canvas) return;
        handleRef.current = mountShelf3D(canvas, {
          covers: covers.split("|"),
          onActivate: (i) => {
            const p = propsRef.current;
            if (p.mode === "select") p.onPick(i);
            else {
              const link = p.books[i]?.link;
              if (link) window.open(link, "_blank", "noopener,noreferrer");
            }
          },
        });
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("failed");
      });
    return () => {
      cancelled = true;
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [covers]);

  if (state === "failed") return <Bookshelf {...props} />;

  const highlight = (i: number | null) => handleRef.current?.setHighlight(i);
  const labelClass =
    "group flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-0 bg-transparent px-2 py-2 text-center font-sans text-ink no-underline transition-colors hover:bg-white/40";

  return (
    <>
      <div className="hidden md:block">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`block h-[340px] w-full transition-opacity duration-700 ${state === "ready" ? "opacity-100" : "opacity-0"}`}
        />
        <ul
          className="m-0 grid list-none gap-2 p-0"
          style={{ gridTemplateColumns: `repeat(${books.length}, minmax(0, 1fr))` }}
        >
          {books.map((book, i) => {
            const tag = tags?.[i % tags.length];
            const content = (
              <>
                {tag && (
                  <span
                    className={`font-hand text-lg leading-none ${TAG_COLORS[i % TAG_COLORS.length]}`}
                  >
                    {tag}
                  </span>
                )}
                <span className="text-[15px] leading-snug font-medium group-aria-pressed:text-indigo-deep">
                  {shortTitle(book.name)}
                </span>
              </>
            );
            const events = {
              onMouseEnter: () => highlight(i),
              onMouseLeave: () => highlight(null),
              onFocus: () => highlight(i),
              onBlur: () => highlight(null),
            };
            return (
              <li key={book.name} className="flex justify-center">
                {props.mode === "link" ? (
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={labelClass}
                    {...events}
                  >
                    {content}
                  </a>
                ) : (
                  <button
                    type="button"
                    aria-pressed={props.picked === i}
                    onClick={() => props.onPick(i)}
                    className={labelClass}
                    {...events}
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="md:hidden">
        <Bookshelf {...props} />
      </div>
    </>
  );
}
