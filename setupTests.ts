// This file is referenced in vitest.config.ts
// It's used for global test setup

import "@testing-library/jest-dom";

// Bun.markdown is only available in the Bun runtime, not in jsdom.
// Provide a minimal CommonMark-compatible stub for tests.
if (typeof globalThis.Bun === "undefined") {
  const inline = (s: string) =>
    s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  const markdownHtml = (text: string): string => {
    const lines = text.split("\n");
    const out: string[] = [];
    let para: string[] = [];
    let listItems: string[] = [];
    let inCode = false;
    let codeLines: string[] = [];

    const flushPara = () => {
      if (para.length) {
        out.push(`<p>${para.join("\n")}</p>`);
        para = [];
      }
    };
    const flushList = () => {
      if (listItems.length) {
        out.push(`<ul>\n${listItems.map((i) => `<li>${i}</li>`).join("\n")}\n</ul>`);
        listItems = [];
      }
    };

    for (const line of lines) {
      if (line.startsWith("```")) {
        if (inCode) {
          out.push(`<pre><code>${codeLines.join("\n")}</code></pre>`);
          codeLines = [];
          inCode = false;
        } else {
          flushPara();
          flushList();
          inCode = true;
        }
        continue;
      }
      if (inCode) {
        codeLines.push(line);
        continue;
      }

      const h = line.trim().match(/^(#{1,6})\s+(.+)/);
      if (h) {
        flushPara();
        flushList();
        out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);
        continue;
      }

      const li = line.match(/^[-*]\s+(.+)/);
      if (li) {
        flushPara();
        listItems.push(inline(li[1]));
        continue;
      }

      if (line.trim() === "") {
        flushPara();
        flushList();
        continue;
      }

      para.push(inline(line));
    }
    flushPara();
    flushList();
    return out.join("\n");
  };

  (globalThis as Record<string, unknown>).Bun = {
    markdown: { html: markdownHtml },
  };
}

// This extends Jest/Vitest's expect with DOM-specific matchers
// like toBeInTheDocument, toHaveTextContent, etc.
