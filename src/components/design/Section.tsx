import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

/** Handwritten kicker over a large sans title, with an optional "see all" link. */
export function SectionHeading({
  kicker,
  title,
  kickerClass = "text-rust",
  link,
  as: Tag = "h2",
}: {
  kicker: string;
  title: ReactNode;
  kickerClass?: string;
  link?: { to: string; label: string };
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-2.5">
        <p className={`m-0 font-hand text-[28px] ${kickerClass}`}>{kicker}</p>
        <Tag className="m-0 text-[40px] leading-none font-medium tracking-[-0.035em] sm:text-[56px]">
          {title}
        </Tag>
      </div>
      {link && (
        <Link
          to={link.to}
          className="py-3 text-base font-medium text-indigo hover:text-indigo-deep"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}

/** Page-level title block used under each painted page header. */
export function PageTitle({
  kicker,
  title,
  intro,
  kickerClass = "text-white [text-shadow:0_0_14px_rgba(120,140,255,.7)]",
}: {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  kickerClass?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className={`m-0 font-hand text-[30px] ${kickerClass}`}>{kicker}</p>
      <h1 className="m-0 text-[56px] leading-none font-medium tracking-[-0.045em] text-olive sm:text-[88px]">
        {title}
      </h1>
      {intro && <p className="m-0 max-w-[620px] text-xl leading-relaxed text-ink-soft">{intro}</p>}
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-cobalt/10 px-3 py-1.5 text-[13px] text-indigo">
      {children}
    </span>
  );
}

export const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
