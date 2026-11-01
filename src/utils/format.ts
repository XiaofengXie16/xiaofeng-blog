/** "2025-10-13" → "Oct 13, 2025". Unparseable input is returned as-is. */
export function formatPostDate(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return date;
  const [, y, m, d] = match;
  const parsed = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Drops a subtitle after a colon: "Why Nations Fail: The Origins…" → "Why Nations Fail". */
export function shortTitle(title: string): string {
  return title.split(":")[0].trim();
}
