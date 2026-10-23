export type AskAIHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

// Prior turns only. The current turn travels in `query` and the server appends
// it, so `history` must not repeat it at the tail.
const HISTORY_LIMIT = 6;

export function buildAskAIHistory(priorTurns: AskAIHistoryMessage[]): AskAIHistoryMessage[] {
  return priorTurns
    .slice(-HISTORY_LIMIT)
    .map((turn) => ({ role: turn.role, content: turn.content }));
}
