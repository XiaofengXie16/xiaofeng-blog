// Groq shut down llama-3.1-8b-instant on 2026-08-16; gpt-oss-20b is Groq's
// recommended successor. https://console.groq.com/docs/deprecations
export const AI_MODEL = "openai/gpt-oss-20b";

// Short form for UI chrome (the command palette footer).
export const AI_MODEL_LABEL = AI_MODEL.split("/").pop() ?? AI_MODEL;
