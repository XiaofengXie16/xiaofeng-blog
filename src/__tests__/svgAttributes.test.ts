import { describe, expect, test } from "bun:test";
import { Glob } from "bun";

// TanStack Redact renders `stopColor`/`stopOpacity` props verbatim instead of
// as `stop-color`/`stop-opacity`, which leaves gradients black. Gradient stops
// must set them through `style` instead.
describe("SVG gradient stops", () => {
  test("never use stopColor/stopOpacity as attributes", async () => {
    const offenders: string[] = [];
    for await (const file of new Glob("src/**/*.tsx").scan(".")) {
      const text = await Bun.file(file).text();
      if (/\bstop(Color|Opacity)=/.test(text)) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });
});
