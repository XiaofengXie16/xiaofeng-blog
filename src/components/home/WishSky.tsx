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
  const nextId = useRef(0);
  const lastText = useRef<string | undefined>(undefined);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const addWish = (left: string, top: string) => {
    const id = nextId.current++;
    const text = pickFuture(lastText.current);
    lastText.current = text;
    setWishes((prev) => [...prev, { id, text, left, top }].slice(-MAX_WISHES));
    timers.current.push(
      window.setTimeout(
        () => setWishes((prev) => prev.filter((w) => w.id !== id)),
        WISH_LIFETIME_MS,
      ),
    );
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    // Links, buttons and the 3D figures (which have their own click) are left alone.
    if ((event.target as HTMLElement).closest("a, button, canvas")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    addWish(`${event.clientX - rect.left}px`, `${event.clientY - rect.top}px`);
  };

  return (
    // Purely ornamental: clicking the sky writes a future. There's no
    // keyboard equivalent on purpose; nothing here carries content.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <section onClick={handleClick} className={className}>
      {children}
      {/* After the children, so adding a wish never shifts (and remounts) them. */}
      {wishes.map((w) => (
        <span key={w.id} aria-hidden="true">
          <span className="wish glow" style={{ left: w.left, top: w.top }}>
            {w.text}
          </span>
          <span className="wish-spark" style={{ left: w.left, top: w.top }} />
        </span>
      ))}
    </section>
  );
}
