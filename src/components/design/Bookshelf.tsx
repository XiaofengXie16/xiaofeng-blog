import { shortTitle } from "~/utils/format";

type Book = { name: string; icon: string; link: string };

// Slightly uneven heights and leans so the row reads as a real shelf.
const HEIGHTS = [214, 198, 226, 206, 192, 220];
const LEANS = [-2, 0.5, -0.5, 1.5, -1, 1];
const TAG_COLORS = ["text-moss", "text-rust", "text-violet"];
const COVER_TOP = 40; // room above the tallest book for the picked one to lift
const SHELF_TOP = COVER_TOP + Math.max(...HEIGHTS);

type Props = {
  books: readonly Book[];
  /** Handwritten label under each book. */
  tags?: readonly string[];
} & ({ mode: "link" } | { mode: "select"; picked: number; onPick: (index: number) => void });

/**
 * Book covers standing on a floating glass shelf. In "link" mode each book
 * opens its page; in "select" mode each is a toggle and the picked one lifts
 * off the shelf. Scrolls sideways on narrow screens instead of wrapping.
 */
export function Bookshelf(props: Props) {
  const { books, tags } = props;

  return (
    // From md up the shelf never scrolls, so only the books take the pointer
    // and decorations behind the shelf stay hoverable.
    <div className="-mx-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0 md:pointer-events-none! md:[&_.book]:pointer-events-auto!">
      <ul
        className="relative m-0 flex w-max min-w-full list-none items-start justify-center gap-6 p-0 px-4 sm:gap-8"
        style={{ paddingTop: COVER_TOP }}
      >
        {/* The shelf ledge the covers stand on */}
        <li
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 h-4 rounded-full border border-white/80 bg-white/55 shadow-[0_22px_34px_-14px_rgba(53,48,110,.5)] backdrop-blur-md"
          style={{ top: SHELF_TOP }}
        />

        {books.map((book, i) => {
          const height = HEIGHTS[i % HEIGHTS.length];
          const picked = props.mode === "select" && props.picked === i;
          const tag = tags?.[i % tags.length];
          const cover = (
            <>
              <span className="flex items-end" style={{ height: SHELF_TOP - COVER_TOP }}>
                <span
                  className={`book-cover relative block overflow-hidden rounded-[3px_9px_9px_3px] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
                    picked ? "is-picked" : ""
                  }`}
                  style={{
                    height,
                    width: Math.round(height * 0.66),
                    ["--lean" as string]: `${LEANS[i % LEANS.length]}deg`,
                  }}
                >
                  <img
                    src={book.icon}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="block h-full w-full object-cover"
                  />
                  {/* Spine shading and a soft gloss so covers read as objects */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-3 bg-linear-to-r from-black/35 via-black/10 to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-br from-white/25 via-transparent to-black/10"
                  />
                </span>
              </span>
              <span className="mt-7 flex max-w-[150px] flex-col items-center gap-1 text-center">
                {tag && (
                  <span
                    className={`font-hand text-lg leading-none ${TAG_COLORS[i % TAG_COLORS.length]}`}
                  >
                    {tag}
                  </span>
                )}
                <span className="text-[15px] leading-snug font-medium text-ink">
                  {shortTitle(book.name)}
                </span>
              </span>
            </>
          );

          const itemClass =
            "book flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 font-sans text-ink no-underline";

          return (
            <li key={book.name} className="relative z-[1]">
              {props.mode === "link" ? (
                <a href={book.link} target="_blank" rel="noopener noreferrer" className={itemClass}>
                  {cover}
                </a>
              ) : (
                <button
                  type="button"
                  aria-pressed={picked}
                  onClick={() => props.onPick(i)}
                  className={itemClass}
                >
                  {cover}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
