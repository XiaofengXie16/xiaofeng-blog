---
"xiaofeng-blog": minor
---

Redesign the site in a painterly "many futures" style, replacing the cyberpunk theme

- New look on every page: grainy dusk-sky headers with drifting clouds, flowing glass ribbons, frosted glass cards and capsules, handwritten glowing notes, Instrument Sans / Caveat / Newsreader type
- Original illustrated figures: a sky writer on the home hero, a reader on posts, a builder on the toolkit and a night-time desk writer. Figures are treated as decoration: paper grain is painted into them and their colors are softened toward the background
- Interactive ornaments: click the home sky (or the "Write a future" button) to write a glowing future that drifts away, and makers standing along a ribbon as scenery (no cards) who paint, cook, type, water, strum and take photos on hover or keyboard focus
- Writing gets topic filters, the toolkit gets category filters, the reading list becomes selectable glass capsules, posts get a reading progress bar
- The ⌘K palette is restyled in night glass; search, Ask AI, Hotkeys and the rate limit are unchanged, and the assistant's persona now matches the new site
- Removes the unused cyberpunk effects and button components
- Works around TanStack Redact rendering `stopColor`/`stopOpacity` verbatim (gradients rendered black) by setting them through `style`, with a test guarding against regressions
