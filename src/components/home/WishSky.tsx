import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { pickFuture } from "~/utils/futures";

type Wish = { id: number; text: string; left: string; top: string };

const WISH_LIFETIME_MS = 5600;
const MAX_WISHES = 10;

/**
 * The home hero's sky. Clicking anywhere that isn't a link or button writes a
 * glowing handwritten "future" that drifts up into the clouds. The button it
 * renders does the same at a random spot, for keyboard users.
 */
export function WishSky({ className, children }: { className?: string; children: ReactNode }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [count, setCount] = useState(0);
  const nextId = useRef(0);
  const lastText = useRef<string | undefined>(undefined);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const addWish = (left: string, top: string) => {
    const id = nextId.current++;
    const text = pickFuture(lastText.current);
    lastText.current = text;
    setWishes((prev) => [...prev, { id, text, left, top }].slice(-MAX_WISHES));
    setCount((c) => c + 1);
    timers.current.push(
      window.setTimeout(
        () => setWishes((prev) => prev.filter((w) => w.id !== id)),
        WISH_LIFETIME_MS,
      ),
    );
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a, button")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    addWish(`${event.clientX - rect.left}px`, `${event.clientY - rect.top}px`);
  };

  return (
    // The click target is ornamental; the "Write a future" button below is
    // the accessible way to trigger the same effect.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <section onClick={handleClick} className={className}>
      {wishes.map((w) => (
        <span key={w.id} aria-hidden="true">
          <span className="wish glow" style={{ left: w.left, top: w.top }}>
            {w.text}
          </span>
          <span className="wish-spark" style={{ left: w.left, top: w.top }} />
        </span>
      ))}
      {children}
      <div className="relative z-[2] flex justify-center pb-24">
        <button
          type="button"
          onClick={() => addWish(`${15 + Math.random() * 70}%`, `${20 + Math.random() * 45}%`)}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border border-dashed border-ink/35 bg-transparent px-[18px] font-sans text-sm text-ink-soft hover:bg-white/25"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 19l7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18zM2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          Write a future in the sky
          <span className="font-hand text-lg text-violet" aria-live="polite">
            ({count} written)
          </span>
        </button>
      </div>
    </section>
  );
}
