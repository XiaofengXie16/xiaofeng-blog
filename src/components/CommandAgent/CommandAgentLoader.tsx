import { useCallback, useEffect, useState } from "react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { TOGGLE_COMMAND_AGENT } from "./events";
import type { CommandAgent } from "./CommandAgent";

/** Keep the shortcut available without loading search, AI, or their data. */
export function CommandAgentLoader() {
  const [isOpen, setIsOpen] = useState(false);
  const [Panel, setPanel] = useState<typeof CommandAgent | null>(null);
  const [failed, setFailed] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    setFailed(false);
    setIsOpen((open) => !open);
  }, []);

  useHotkey("Mod+K", toggle, {
    requireReset: true,
    meta: { name: "Toggle command agent" },
  });

  useEffect(() => {
    window.addEventListener(TOGGLE_COMMAND_AGENT, toggle);
    return () => window.removeEventListener(TOGGLE_COMMAND_AGENT, toggle);
  }, [toggle]);

  useEffect(() => {
    if (!isOpen || Panel) return;
    let cancelled = false;
    void import("./CommandAgent")
      .then((module) => {
        if (!cancelled) setPanel(() => module.CommandAgent);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, Panel]);

  // Keep the loaded panel mounted so closing it doesn't reset its rate limiter.
  if (Panel) return <Panel isOpen={isOpen} onClose={close} />;
  if (!isOpen) return null;
  return (
    <div
      role="status"
      className="fixed right-4 bottom-4 z-50 rounded-2xl bg-cream p-4 text-ink shadow-lg"
    >
      {failed ? "Search couldn't load. Close and try again." : "Loading search…"}
      <button type="button" onClick={close} className="ml-3 underline">
        Close
      </button>
    </div>
  );
}
