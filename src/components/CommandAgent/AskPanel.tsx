import { useEffect, useRef } from "react";
import type { AssistantAction } from "~/server/assistant";

export type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  actions?: AssistantAction[];
};

const SUGGESTIONS = [
  "What tools do you recommend for terminal?",
  "Tell me about the blog posts",
  "What books should I read as an engineer?",
  "What is this site about?",
];

const pillClass =
  "inline-flex min-h-10 cursor-pointer items-center rounded-full border border-[rgba(180,195,255,.35)] bg-transparent px-4 font-sans text-sm text-moon hover:bg-white/8";

type Props = {
  messages: readonly ChatMessage[];
  isLoading: boolean;
  onAsk: (question: string) => void;
  onAction: (action: AssistantAction) => void;
};

/** The palette's Ask AI conversation: suggestions, the thread and follow-up actions. */
export function AskPanel({ messages, isLoading, onAsk, onAction }: Props) {
  const threadRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view.
  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages, isLoading]);

  return (
    <div
      ref={threadRef}
      className="flex max-h-[50vh] min-h-[220px] flex-col gap-4 overflow-y-auto px-6 py-5"
      aria-live="polite"
    >
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col gap-4">
          <p className="glow m-0 -rotate-1 font-hand text-[28px] text-[#F4F7FF]">
            ask me anything about this site
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onAsk(suggestion)}
                className={pillClass}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg) =>
        msg.role === "user" ? (
          <p
            key={msg.id}
            className="m-0 max-w-[80%] self-end rounded-[18px_18px_4px_18px] bg-[rgba(110,140,255,.25)] px-4 py-3 text-base leading-normal"
          >
            {msg.content}
          </p>
        ) : (
          <div key={msg.id} className="flex max-w-[88%] flex-col gap-3 self-start">
            <p className="m-0 rounded-[18px_18px_18px_4px] bg-white/7 px-[18px] py-3.5 text-base leading-relaxed text-moon">
              {msg.content}
            </p>
            {msg.actions && msg.actions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {msg.actions.map((action) => (
                  <button
                    key={`${action.type}-${action.path ?? action.url}`}
                    type="button"
                    onClick={() => onAction(action)}
                    className={pillClass}
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
  );
}
