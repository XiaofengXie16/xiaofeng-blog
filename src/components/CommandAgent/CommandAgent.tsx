import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { TOOLS } from "~/constants/tool";
import { BOOKS } from "~/constants/book";
import { askAI } from "~/server/ai";

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
  const [cursorVisible, setCursorVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cursor blink — only when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Keyboard shortcut and custom event to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toggle-command-agent", handleToggle);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("toggle-command-agent", handleToggle);
    };
  }, []);

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

  // Send AI query
  const chatHistoryRef = useRef(chatHistory);
  chatHistoryRef.current = chatHistory;

  const sendAIQuery = async (userQuery: string) => {
    if (!userQuery.trim() || isLoading) return;

    const currentHistory = chatHistoryRef.current;
    const newHistory: ChatMessage[] = [...currentHistory, { role: "user", content: userQuery }];
    setChatHistory(newHistory);
    setQuery("");
    setIsLoading(true);

    try {
      const result = await askAI({
        data: {
          query: userQuery,
          history: newHistory.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

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
      { path: "/", label: "HOME", desc: "Go to the landing page" },
      { path: "/blog", label: "BLOG", desc: "Browse all blog posts" },
      { path: "/reading-list", label: "READING LIST", desc: "Books and reading recommendations" },
      { path: "/tool", label: "TOOLS", desc: "Developer tools and utilities" },
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
    navigate: "NAV",
    tool: "TOOL",
    book: "BOOK",
    "ai-action": "AI",
  };

  const typeColors: Record<string, string> = {
    navigate: "text-primary",
    tool: "text-secondary",
    book: "text-neon-yellow",
    "ai-action": "text-neon-green",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh]">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={close}
        aria-label="Close command agent"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 animate-scale-in">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 via-secondary/30 to-primary/50 opacity-60 blur-[1px]" />

        <div className="relative bg-background border border-primary/20 overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/10 bg-surface/50">
            <span className="terminal-text text-xs text-primary/50">SYSTEM</span>
            <span className="terminal-text text-xs text-text-muted">//</span>
            <span className="terminal-text text-xs text-text-muted">COMMAND_AGENT v2.0</span>
            <div className="ml-auto flex items-center gap-3">
              {/* Mode toggle */}
              <div className="flex items-center border border-white/10">
                <button
                  type="button"
                  onClick={() => setMode("search")}
                  className={`terminal-text text-[10px] px-2 py-1 transition-all ${
                    mode === "search"
                      ? "bg-primary/20 text-primary"
                      : "text-text-muted hover:text-primary"
                  }`}
                >
                  SEARCH
                </button>
                <button
                  type="button"
                  onClick={() => setMode("ai")}
                  className={`terminal-text text-[10px] px-2 py-1 transition-all ${
                    mode === "ai"
                      ? "bg-neon-green/20 text-neon-green"
                      : "text-text-muted hover:text-neon-green"
                  }`}
                >
                  AI
                </button>
              </div>
              <span className="status-dot !w-[6px] !h-[6px]" />
            </div>
          </div>

          {/* Input area */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-primary/10">
            <span
              className={`terminal-text text-sm shrink-0 ${mode === "ai" ? "text-neon-green" : "text-primary"}`}
            >
              {mode === "ai" ? (cursorVisible ? "?" : "\u00A0") : cursorVisible ? ">" : "\u00A0"}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={
                mode === "ai" ? "Ask me anything about this site..." : "Type a command or search..."
              }
              className="flex-1 bg-transparent text-text-main terminal-text text-sm outline-none placeholder:text-text-muted/50"
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="terminal-text text-xs text-text-muted hover:text-primary transition-colors"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Content area */}
          {mode === "search" ? (
            /* Search results */
            <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto">
              {results.length === 0 && query.trim() && (
                <div className="px-4 py-8 text-center">
                  <p className="terminal-text text-sm text-text-muted">NO_MATCH_FOUND</p>
                  <p className="terminal-text text-xs text-neon-green/60 mt-3 animate-pulse">
                    Switching to AI mode...
                  </p>
                </div>
              )}

              {results.map((item, index) => (
                <button
                  type="button"
                  key={`${item.type}-${item.label}`}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all group ${
                    index === selectedIndex
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : "border-l-2 border-l-transparent hover:bg-surface-hover/50"
                  }`}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span
                    className={`terminal-text text-xs ${typeColors[item.type]} shrink-0 w-5 text-center opacity-70`}
                  >
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`terminal-text text-sm ${
                          index === selectedIndex ? "text-primary" : "text-text-main"
                        } transition-colors truncate`}
                      >
                        {item.label}
                      </span>
                      <span
                        className={`terminal-text text-[10px] ${typeColors[item.type]} opacity-60 shrink-0`}
                      >
                        [{typeLabels[item.type]}]
                      </span>
                    </div>
                    <p className="terminal-text text-xs text-text-muted/60 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  <span
                    className={`terminal-text text-xs text-primary transition-opacity ${
                      index === selectedIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    &#x2192;
                  </span>
                </button>
              ))}
            </div>
          ) : (
            /* AI chat */
            <div ref={chatRef} className="max-h-[50vh] overflow-y-auto">
              {chatHistory.length === 0 && !isLoading && (
                <div className="px-4 py-6">
                  <p className="terminal-text text-xs text-text-muted/60 mb-4">
                    &gt; AI_AGENT_READY // Ask about tools, books, blog posts, or anything about
                    this site
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
                        className="terminal-text text-[11px] text-text-muted px-3 py-1.5 border border-white/10 hover:border-neon-green/30 hover:text-neon-green hover:bg-neon-green/5 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 ${msg.role === "user" ? "border-l-2 border-l-primary/30" : "border-l-2 border-l-neon-green/30 bg-surface/30"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`terminal-text text-[10px] ${msg.role === "user" ? "text-primary" : "text-neon-green"}`}
                    >
                      {msg.role === "user" ? "YOU" : "AGENT"}
                    </span>
                  </div>
                  <p className="terminal-text text-sm text-text-main leading-relaxed">
                    {msg.content}
                  </p>

                  {/* Action buttons from AI */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.actions.map((action, j) => (
                        <button
                          key={j}
                          type="button"
                          onClick={() => handleAction(action)}
                          className="terminal-text text-xs text-neon-green px-3 py-1.5 border border-neon-green/30 hover:bg-neon-green/10 hover:border-neon-green/60 transition-all flex items-center gap-2"
                        >
                          <span>{action.type === "navigate" ? ">_" : "[]"}</span>
                          <span>{action.label || action.path || action.url}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="px-4 py-3 border-l-2 border-l-neon-green/30 bg-surface/30">
                  <div className="flex items-center gap-2">
                    <span className="terminal-text text-[10px] text-neon-green">AGENT</span>
                  </div>
                  <p className="terminal-text text-sm text-text-muted animate-pulse mt-1">
                    Processing query...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-primary/10 bg-surface/30">
            <div className="flex items-center gap-3">
              <span className="terminal-text text-[10px] text-text-muted/50">
                <kbd className="px-1 py-0.5 border border-white/10 bg-white/5">tab</kbd>{" "}
                {mode === "search" ? "AI mode" : "search"}
              </span>
              {mode === "search" ? (
                <>
                  <span className="terminal-text text-[10px] text-text-muted/50">
                    <kbd className="px-1 py-0.5 border border-white/10 bg-white/5">↑↓</kbd> navigate
                  </span>
                  <span className="terminal-text text-[10px] text-text-muted/50">
                    <kbd className="px-1 py-0.5 border border-white/10 bg-white/5">↵</kbd> select
                  </span>
                </>
              ) : (
                <span className="terminal-text text-[10px] text-text-muted/50">
                  <kbd className="px-1 py-0.5 border border-white/10 bg-white/5">↵</kbd> send
                </span>
              )}
              <span className="terminal-text text-[10px] text-text-muted/50">
                <kbd className="px-1 py-0.5 border border-white/10 bg-white/5">esc</kbd> close
              </span>
            </div>
            <span
              className={`terminal-text text-[10px] ${mode === "ai" ? "text-neon-green/40" : "text-text-muted/40"}`}
            >
              {mode === "ai"
                ? "llama-3.1"
                : `${results.length} result${results.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
