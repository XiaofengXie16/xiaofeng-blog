import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

const navLinks = [
  { to: "/blog", label: "Blog" },
  { to: "/reading-list", label: "Reading" },
  { to: "/tool", label: "Tools" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-[110] bg-background/85 backdrop-blur-lg border-b border-border-subtle">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-semibold text-text-main hover:text-primary transition-colors">
          Xiaofeng Xie
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm text-text-muted hover:text-text-main rounded-md hover:bg-surface transition-colors"
              activeProps={{ className: "text-text-main bg-surface" }}
            >
              {link.label}
            </Link>
          ))}

          {/* Command palette trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-command-agent"))}
            className="ml-3 flex items-center gap-2 px-3 py-1.5 text-sm text-text-muted border border-border-subtle rounded-md hover:border-text-muted/50 hover:text-text-main transition-colors"
          >
            Search
            <kbd className="terminal-text text-[10px] text-text-muted px-1.5 py-0.5 border border-border-subtle rounded bg-surface">
              ⌘K
            </kbd>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-md border border-border-subtle hover:bg-surface transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <div className="flex flex-col gap-1.5 items-center justify-center">
            <span
              className={`w-4 h-0.5 bg-text-main transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`w-4 h-0.5 bg-text-main transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`w-4 h-0.5 bg-text-main transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-0 top-16 z-[120] transition-opacity duration-200 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        aria-hidden={!isMenuOpen}
      >
        {/* Backdrop */}
        <button
          type="button"
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        />
        {/* Menu panel */}
        <div className="absolute top-0 left-0 right-0 bg-background border-b border-border-subtle shadow-xl">
          <nav className="max-w-5xl mx-auto px-6 py-4 space-y-1">
            <Link
              to="/"
              className="block px-4 py-3 rounded-md text-text-muted hover:text-text-main hover:bg-surface transition-colors"
              activeProps={{ className: "text-text-main bg-surface" }}
              activeOptions={{ exact: true }}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-3 rounded-md text-text-muted hover:text-text-main hover:bg-surface transition-colors"
                activeProps={{ className: "text-text-main bg-surface" }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
