import { describe, it, expect } from "vite-plus/test";
import { buildAskAIHistory } from "../components/CommandAgent/askAIPayload";

describe("buildAskAIHistory", () => {
  it("returns the prior turns unchanged when fewer than six", () => {
    const priorTurns = [
      { role: "user" as const, content: "what tools do you use?" },
      { role: "assistant" as const, content: "Here are a few." },
    ];

    expect(buildAskAIHistory(priorTurns)).toEqual(priorTurns);
  });

  it("keeps only the six most recent prior turns", () => {
    const priorTurns = Array.from({ length: 8 }, (_, i) => ({
      role: "user" as const,
      content: `turn ${i}`,
    }));

    expect(buildAskAIHistory(priorTurns)).toEqual(priorTurns.slice(-6));
  });

  it("leaves the current turn out of the history so the request carries it once", () => {
    const chatHistory = [
      { role: "user" as const, content: "first" },
      { role: "assistant" as const, content: "reply" },
    ];
    const currentQuery = "the current question";

    const payloadHistory = buildAskAIHistory(chatHistory);
    const messages = [...payloadHistory, { role: "user" as const, content: currentQuery }];

    expect(payloadHistory.some((message) => message.content === currentQuery)).toBe(false);
    expect(messages.filter((message) => message.content === currentQuery)).toHaveLength(1);
  });
});
