import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useAsyncRateLimitedCallback } from "@tanstack/react-pacer";
import { TOOLS } from "~/constants/tool";
import { BOOKS } from "~/constants/book";
import { askAI, type AskAIInput } from "~/server/ai.functions";
import { AI_MODEL_LABEL } from "~/constants/ai";
import { TOGGLE_COMMAND_AGENT } from "./events";

type ResultItem = {
  type: "navigate" | "tool" | "book" | "ai-action";
  label: string;
  description: string;
  action: () => void;
  icon: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  actions?: Array<{ type: string; path?: string; url?: string; label?: string }>;
};

const AI_RATE_LIMIT = 5;
const AI_RATE_WINDOW_MS = 60_000;

function fuzzyMatch(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return 100 + (q.length / t.length) * 50;
  const words = t.split(/\s+/);
  if (words.some((w) => w.startsWith(q))) return 80;
  let qi = 0;
  let score = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 10;
      qi++;
    }
  }
  return qi === q.length ? score : 0;
}

export const CommandAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<"search" | "ai">("search");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Drive the native top-layer dialog from `isOpen`. showModal() gives us the
  // focus trap, inert background and ::backdrop for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
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
      setIsOpen(false);
    };
    const handleClose = () => setIsOpen(false);
    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
    };
  }, []);

  // Cmd+K (Ctrl+K off macOS) toggles the palette. Mod chords still fire while
  // typing in the query input, and the browser default is prevented.
  // requireReset stops a held chord from flickering the dialog.
  useHotkey("Mod+K", () => setIsOpen((prev) => !prev), {
    requireReset: true,
    meta: { name: "Toggle command agent" },
  });

  // The header's SEARCH button opens the palette through a custom event.
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener(TOGGLE_COMMAND_AGENT, handleToggle);
    return () => window.removeEventListener(TOGGLE_COMMAND_AGENT, handleToggle);
  }, []);

  // Cap AI queries per visitor so a stuck Enter key or rapid retries can't
  // drain the Groq quota. Over the limit, the call resolves to undefined
  // without hitting the server. Client-side only: a UX guard, not abuse
  // protection.
  const rateLimitedAskAI = useAsyncRateLimitedCallback((data: AskAIInput) => askAI({ data }), {
    limit: AI_RATE_LIMIT,
    window: AI_RATE_WINDOW_MS,
    windowType: "sliding",
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      // Reset state when closed
      setMode("search");
      setChatHistory([]);
    }
  }, [isOpen]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const close = () => {
    setIsOpen(false);
  };

  const handleAction = async (action: {
    type: string;
    path?: string;
    url?: string;
    label?: string;
  }) => {
    if (action.type === "navigate" && action.path) {
      await navigate({ to: action.path });
      close();
    } else if (action.type === "open" && action.url) {
      window.open(action.url, "_blank", "noopener,noreferrer");
    }
  };

  const sendAIQuery = async (userQuery: string) => {
    if (!userQuery.trim() || isLoading) return;

    // `chatHistory` from this render is current: every caller is an event
    // handler recreated each render, so there is no stale-closure risk and
    // no need to mirror state into a ref during render.
    const newHistory: ChatMessage[] = [...chatHistory, { role: "user", content: userQuery }];
    setChatHistory(newHistory);
    setQuery("");
    setIsLoading(true);

    try {
      const result = await rateLimitedAskAI({
        query: userQuery,
        history: newHistory.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      if (!result) {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `RATE_LIMITED: max ${AI_RATE_LIMIT} queries per minute. Try again shortly.`,
          },
        ]);
        return;
      }

      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.response,
          actions: result.actions,
        },
      ]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Try again." },
      ]);
    } finally {
      setIsLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  // Build search index
  const allItems: ResultItem[] = (() => {
    const items: ResultItem[] = [];

    const pages = [
      { path: "/", label: "Home", desc: "Go to the landing page" },
      { path: "/blog", label: "Writing", desc: "Browse all blog posts" },
      { path: "/reading-list", label: "Reading list", desc: "Books and reading recommendations" },
      { path: "/tool", label: "Toolkit", desc: "Developer tools and utilities" },
    ];
    for (const page of pages) {
      items.push({
        type: "navigate",
        label: page.label,
        description: page.desc,
        icon: ">_",
        action: async () => {
          await navigate({ to: page.path });
          close();
        },
      });
    }

    for (const tool of TOOLS) {
      items.push({
        type: "tool",
        label: tool.name,
        description: tool.description.slice(0, 120) + (tool.description.length > 120 ? "..." : ""),
        icon: "[]",
        action: () => {
          window.open(tool.link, "_blank", "noopener,noreferrer");
          close();
        },
      });
    }

    for (const book of BOOKS) {
      items.push({
        type: "book",
        label: book.name,
        description: "From the reading list",
        icon: "{}",
        action: () => {
          window.open(book.link, "_blank", "noopener,noreferrer");
          close();
        },
      });
    }

    return items;
  })();

  // Filter and sort results
  const results = (() => {
    if (!query.trim()) {
      return allItems.filter((item) => item.type === "navigate");
    }
    return allItems
      .map((item) => ({
        item,
        score: Math.max(fuzzyMatch(query, item.label), fuzzyMatch(query, item.description) * 0.6),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ item }) => item);
  })();

  // Auto-switch to AI mode when search has no results
  const autoSwitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (autoSwitchTimerRef.current) {
      clearTimeout(autoSwitchTimerRef.current);
      autoSwitchTimerRef.current = null;
    }

    if (mode === "search" && query.trim() && results.length === 0) {
      autoSwitchTimerRef.current = setTimeout(() => {
        setMode("ai");
      }, 200);
    }

    return () => {
      if (autoSwitchTimerRef.current) {
        clearTimeout(autoSwitchTimerRef.current);
      }
    };
  }, [mode, query, results.length]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length, query]);

  useEffect(() => {
    if (resultsRef.current) {
      const selected = resultsRef.current.children[selectedIndex] as HTMLElement;
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleInputKeyDown = async (e: React.KeyboardEvent) => {
    // Tab to switch modes
    if (e.key === "Tab") {
      e.preventDefault();
      setMode((m) => (m === "search" ? "ai" : "search"));
      return;
    }

    if (mode === "ai") {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        await sendAIQuery(query);
      }
      return;
    }

    // Search mode keyboard nav
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      results[selectedIndex].action();
    }
  };

  const typeLabels: Record<string, string> = {
    navigate: "PAGE",
    tool: "TOOL",
    book: "BOOK",
    "ai-action": "AI",
  };

  const typeColors: Record<string, string> = {
    navigate: "text-[#9FB4FF]",
    tool: "text-[#C7B5FF]",
    book: "text-[#B5D58C]",
    "ai-action": "text-[#F3B98D]",
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
          {/* Input row */}
          <div className="flex items-center gap-3.5 border-b border-[rgba(180,195,255,.16)] px-5 py-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B9C4FF"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
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
                onClick={() => setMode("search")}
                className={tabClass(mode === "search")}
              >
                Search
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "ai"}
                onClick={() => setMode("ai")}
                className={tabClass(mode === "ai")}
              >
                Ask AI
              </button>
            </div>
          </div>

          {mode === "search" ? (
            <div
              ref={resultsRef}
              className="flex max-h-[50vh] flex-col gap-0.5 overflow-y-auto p-2.5"
            >
              {results.length === 0 && query.trim() && (
                <p className="m-0 p-7 text-center font-hand text-[26px] text-[#B9C4FF]">
                  nothing here — switching to Ask AI…
                </p>
              )}

              {results.map((item, index) => (
                <button
                  type="button"
                  key={`${item.type}-${item.label}`}
                  className={`flex min-h-[60px] w-full cursor-pointer items-center gap-3.5 rounded-2xl border-0 px-3.5 py-2.5 text-left font-sans transition-colors ${
                    index === selectedIndex
                      ? "bg-[rgba(130,155,255,.16)] shadow-[inset_0_0_0_1px_rgba(170,190,255,.3)]"
                      : "bg-transparent hover:bg-white/5"
                  }`}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span
                    className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/7 font-mono text-sm ${typeColors[item.type]}`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-base font-medium text-white">{item.label}</span>
                    <span className="truncate text-[13px] text-[#9CA2D4]">{item.description}</span>
                  </span>
                  <span
                    className={`text-[11px] font-semibold tracking-[0.12em] ${typeColors[item.type]}`}
                  >
                    {typeLabels[item.type]}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div
              ref={chatRef}
              className="flex max-h-[50vh] min-h-[220px] flex-col gap-4 overflow-y-auto px-6 py-5"
              aria-live="polite"
            >
              {chatHistory.length === 0 && !isLoading && (
                <div className="flex flex-col gap-4">
                  <p className="glow m-0 -rotate-1 font-hand text-[28px] text-[#F4F7FF]">
                    ask me anything about this site
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "What tools do you recommend for terminal?",
                      "Tell me about the blog posts",
                      "What books should I read as an engineer?",
                      "What is this site about?",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={async () => {
                          setQuery(suggestion);
                          await sendAIQuery(suggestion);
                        }}
                        className="min-h-10 cursor-pointer rounded-full border border-[rgba(180,195,255,.35)] bg-transparent px-4 font-sans text-sm text-moon hover:bg-white/8"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((msg, i) =>
                msg.role === "user" ? (
                  <p
                    key={i}
                    className="m-0 max-w-[80%] self-end rounded-[18px_18px_4px_18px] bg-[rgba(110,140,255,.25)] px-4 py-3 text-base leading-normal"
                  >
                    {msg.content}
                  </p>
                ) : (
                  <div key={i} className="flex max-w-[88%] flex-col gap-3 self-start">
                    <p className="m-0 rounded-[18px_18px_18px_4px] bg-white/7 px-[18px] py-3.5 text-base leading-relaxed text-moon">
                      {msg.content}
                    </p>
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {msg.actions.map((action, j) => (
                          <button
                            key={j}
                            type="button"
                            onClick={() => handleAction(action)}
                            className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-[rgba(180,195,255,.35)] bg-transparent px-4 font-sans text-sm text-moon hover:bg-white/8"
                          >
                            {action.label || action.path || action.url}
                            {action.type === "open" && <span aria-hidden="true">&nbsp;↗</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              )}

              {isLoading && (
                <p className="animate-shimmer m-0 self-start rounded-[18px_18px_18px_4px] bg-white/7 px-[18px] py-3.5 font-hand text-2xl text-[#B9C4FF]">
                  writing an answer…
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(180,195,255,.16)] px-5 py-3 text-xs text-[#8E94C4]">
            <span>
              {mode === "search" ? "↑↓ navigate · ↵ open · " : "↵ send · "}Tab switch mode · Esc
              close
            </span>
            <span>
              {mode === "ai"
                ? `${AI_MODEL_LABEL} · ${AI_RATE_LIMIT} questions a minute`
                : `${results.length} result${results.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
      </div>
    </dialog>
  );
};
