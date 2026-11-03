import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAsyncRateLimitedCallback } from "@tanstack/react-pacer";
import { TOOLS } from "~/constants/tool";
import { BOOKS } from "~/constants/book";
import { PAGES } from "~/constants/pages";
import { AI_MODEL_LABEL } from "~/constants/ai";
import { askAI } from "~/server/ai.functions";
import type { AskAIInput, AssistantAction } from "~/server/assistant";
import { buildSearchIndex, searchItems, type SearchItem } from "~/utils/search";
import { SearchIcon } from "~/components/Layout/Header";
import { AskPanel, type ChatMessage } from "./AskPanel";
import { SearchResults } from "./SearchResults";

const AI_RATE_LIMIT = 5;
const AI_RATE_WINDOW_MS = 60_000;
/** Turns of context sent with each question. */
const HISTORY_TURNS = 6;

// Site content only changes at build time, so the index is built once.
const SEARCH_INDEX = buildSearchIndex({ pages: PAGES, tools: TOOLS, books: BOOKS });

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

/**
 * The ⌘K palette: fuzzy search over pages, tools and books, and an Ask AI
 * mode backed by the site assistant. Rendered once in the layout.
 */
export const CommandAgent = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [mode, setMode] = useState<"search" | "ai">("search");
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextMessageId = useRef(0);
  const navigate = useNavigate();

  const results = searchItems(SEARCH_INDEX, query);
  const close = onClose;

  // Drive the native top-layer dialog from `isOpen`. showModal() gives us the
  // focus trap, inert background and ::backdrop for free. Each opening starts
  // fresh: an empty search with no conversation.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      setMode("search");
      setQuery("");
      setSelectedIndex(0);
      setMessages([]);
      dialog.showModal();
      // showModal() focuses the first focusable descendant (the mode toggle);
      // the query input is what the user actually wants.
      inputRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Escape dismissal happens in the UA, outside React. Only `cancel` fires
  // reliably here (a `close` listener never runs), and React's synthetic
  // onCancel/onClose do not fire for <dialog> either — so bind natively.
  // Cancelling the default keeps a single close path: state flips first, then
  // the effect above closes the dialog. Without this, isOpen stays true after
  // Escape and the next Cmd+K appears to do nothing.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    const handleClose = () => onClose();
    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
    };
  }, [onClose]);

  // A search with no results hands over to Ask AI after a short pause.
  const noResults = mode === "search" && query.trim() !== "" && results.length === 0;
  useEffect(() => {
    if (!noResults) return;
    const timer = setTimeout(() => setMode("ai"), 200);
    return () => clearTimeout(timer);
  }, [noResults]);

  // Cap AI queries per visitor so a stuck Enter key or rapid retries can't
  // drain the Groq quota. Over the limit, the call resolves to undefined
  // without hitting the server. Client-side only: a UX guard, not abuse
  // protection.
  const rateLimitedAskAI = useAsyncRateLimitedCallback((data: AskAIInput) => askAI({ data }), {
    limit: AI_RATE_LIMIT,
    window: AI_RATE_WINDOW_MS,
    windowType: "sliding",
  });

  const addMessage = (message: Omit<ChatMessage, "id">) =>
    setMessages((prev) => [...prev, { ...message, id: nextMessageId.current++ }]);

  const ask = async (question: string) => {
    if (!question.trim() || isLoading) return;
    // `messages` from this render is current: every caller is an event
    // handler recreated each render, so there is no stale-closure risk.
    const history = [...messages, { role: "user" as const, content: question }]
      .slice(-HISTORY_TURNS)
      .map(({ role, content }) => ({ role, content }));
    addMessage({ role: "user", content: question });
    setQuery("");
    setIsLoading(true);

    try {
      const reply = await rateLimitedAskAI({ query: question, history });
      addMessage(
        reply
          ? { role: "assistant", content: reply.response, actions: reply.actions }
          : {
              role: "assistant",
              content: `RATE_LIMITED: max ${AI_RATE_LIMIT} queries per minute. Try again shortly.`,
            },
      );
    } catch {
      addMessage({ role: "assistant", content: "Connection error. Try again." });
    } finally {
      setIsLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const activate = async (item: SearchItem) => {
    if (item.to !== undefined) await navigate({ to: item.to });
    else openExternal(item.href);
    close();
  };

  const runAction = async (action: AssistantAction) => {
    if (action.type === "navigate" && action.path) {
      await navigate({ to: action.path });
      close();
    } else if (action.type === "open" && action.url) {
      openExternal(action.url);
    }
  };

  const switchMode = (next: "search" | "ai") => {
    setMode(next);
    setSelectedIndex(0);
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      switchMode(mode === "search" ? "ai" : "search");
      return;
    }

    if (mode === "ai") {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        await ask(query);
      }
      return;
    }

    const selected = results[selectedIndex];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && selected) {
      e.preventDefault();
      await activate(selected);
    }
  };

  const tabClass = (active: boolean) =>
    `min-h-9 cursor-pointer rounded-full border-0 px-3.5 font-sans text-[13px] font-medium transition-colors ${
      active ? "bg-moon text-night-soft" : "bg-transparent text-[#B9C4FF] hover:text-white"
    }`;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Ask or search"
      className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-moon backdrop:bg-[#06061A]/75 backdrop:backdrop-blur-md"
    >
      {/* Clicking the empty area outside the panel dismisses. */}
      <div
        className="flex h-full w-full items-start justify-center pt-[12vh]"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="glass-night relative mx-4 w-full max-w-[680px] overflow-hidden rounded-[28px] font-sans">
          <div className="flex items-center gap-3.5 border-b border-[rgba(180,195,255,.16)] px-5 py-4 text-[#B9C4FF]">
            <SearchIcon size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              aria-label={mode === "ai" ? "Ask a question" : "Search the site"}
              placeholder={
                mode === "ai"
                  ? "Ask anything about this site…"
                  : "Search posts, books, tools — or press Tab to ask"
              }
              className="min-h-11 min-w-0 flex-1 border-0 bg-transparent font-sans text-lg text-white outline-none placeholder:text-[#8E94C4]"
              autoComplete="off"
              spellCheck={false}
            />
            <div
              role="tablist"
              aria-label="Mode"
              className="flex gap-1 rounded-full bg-white/6 p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "search"}
                onClick={() => switchMode("search")}
                className={tabClass(mode === "search")}
              >
                Search
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "ai"}
                onClick={() => switchMode("ai")}
                className={tabClass(mode === "ai")}
              >
                Ask AI
              </button>
            </div>
          </div>

          {mode === "search" ? (
            <SearchResults
              results={results}
              query={query}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onActivate={activate}
            />
          ) : (
            <AskPanel messages={messages} isLoading={isLoading} onAsk={ask} onAction={runAction} />
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(180,195,255,.16)] px-5 py-3 text-xs text-[#8E94C4]">
            <span>
              {mode === "search" ? "↑↓ navigate · ↵ open · " : "↵ send · "}Tab switch mode · Esc
              close
            </span>
            <span>
              {mode === "ai"
                ? `${AI_MODEL_LABEL} · ${AI_RATE_LIMIT} questions a minute`
                : `${results.length} result${results.length === 1 ? "" : "s"}`}
            </span>
          </div>
        </div>
      </div>
    </dialog>
  );
};
