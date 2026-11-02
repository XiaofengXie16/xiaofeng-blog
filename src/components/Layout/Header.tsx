import { Link } from "@tanstack/react-router";
import { NAV_LINKS } from "~/constants/pages";
import { openCommandAgent } from "../CommandAgent/events";

const linkClass =
  "rounded-full px-2.5 py-3 text-[15px] sm:px-4 font-medium text-ink no-underline transition-colors hover:bg-white/40";

/**
 * Floats over each page's painted header so the sky runs behind it. Pages
 * start with enough top padding to clear it.
 */
export const Header = () => (
  <header className="absolute inset-x-0 top-0 z-20">
    {/* Phones: logo + search on one row, links on the next. Wider: one row. */}
    <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-6 sm:px-8">
      <Link to="/" className="order-1 flex items-baseline gap-2.5 text-ink no-underline">
        <span className="text-[22px] font-semibold tracking-[-0.02em]">Xiaofeng Xie</span>
        <span className="font-hand text-[22px] text-violet">builds things</span>
      </Link>
      <nav
        aria-label="Primary"
        className="order-3 -mx-2.5 flex basis-full flex-wrap items-center gap-0.5 sm:order-2 sm:mx-0 sm:ml-auto sm:basis-auto sm:gap-1.5"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={linkClass}
            activeProps={{ className: "bg-white/45 font-semibold", "aria-current": "page" }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={openCommandAgent}
        aria-label="Ask or search (⌘K)"
        className="glass order-2 inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2.5 rounded-full p-2.5 text-sm font-medium text-ink sm:order-3 sm:py-2.5 sm:pr-3.5 sm:pl-4"
      >
        <SearchIcon />
        <span className="hidden sm:inline">Ask or search</span>
        <kbd className="hidden rounded-md bg-ink/8 px-1.5 py-0.5 font-sans text-xs text-ink-soft sm:inline">
          ⌘K
        </kbd>
      </button>
    </div>
  </header>
);

export const SearchIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
