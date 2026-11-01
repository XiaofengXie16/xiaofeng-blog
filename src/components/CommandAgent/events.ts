/** Event the header, home page and other triggers use to toggle the palette. */
export const TOGGLE_COMMAND_AGENT = "toggle-command-agent";

export function openCommandAgent() {
  window.dispatchEvent(new CustomEvent(TOGGLE_COMMAND_AGENT));
}
