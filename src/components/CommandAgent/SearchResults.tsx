import { useEffect, useRef } from "react";
import type { SearchItem, SearchKind } from "~/utils/search";

const KIND: Record<SearchKind, { label: string; icon: string; color: string }> = {
  page: { label: "PAGE", icon: ">_", color: "text-[#9FB4FF]" },
  tool: { label: "TOOL", icon: "[]", color: "text-[#C7B5FF]" },
  book: { label: "BOOK", icon: "{}", color: "text-[#B5D58C]" },
};

type Props = {
  results: readonly SearchItem[];
  query: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onActivate: (item: SearchItem) => void;
};

/** The palette's search results; the selected row follows the keyboard and the mouse. */
export function SearchResults({ results, query, selectedIndex, onSelect, onActivate }: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the keyboard-selected row in view.
  useEffect(() => {
    listRef.current?.children[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <div ref={listRef} className="flex max-h-[50vh] flex-col gap-0.5 overflow-y-auto p-2.5">
      {results.length === 0 && query.trim() && (
        <p className="m-0 p-7 text-center font-hand text-[26px] text-[#B9C4FF]">
          nothing here — switching to Ask AI…
        </p>
      )}

      {results.map((item, index) => {
        const kind = KIND[item.kind];
        return (
          <button
            type="button"
            key={`${item.kind}-${item.label}`}
            className={`flex min-h-[60px] w-full cursor-pointer items-center gap-3.5 rounded-2xl border-0 px-3.5 py-2.5 text-left font-sans transition-colors ${
              index === selectedIndex
                ? "bg-[rgba(130,155,255,.16)] shadow-[inset_0_0_0_1px_rgba(170,190,255,.3)]"
                : "bg-transparent hover:bg-white/5"
            }`}
            onClick={() => onActivate(item)}
            onMouseEnter={() => onSelect(index)}
          >
            <span
              className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/7 font-mono text-sm ${kind.color}`}
              aria-hidden="true"
            >
              {kind.icon}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-base font-medium text-white">{item.label}</span>
              <span className="truncate text-[13px] text-[#9CA2D4]">{item.description}</span>
            </span>
            <span className={`text-[11px] font-semibold tracking-[0.12em] ${kind.color}`}>
              {kind.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
