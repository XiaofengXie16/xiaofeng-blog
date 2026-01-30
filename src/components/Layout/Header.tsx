import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

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

    const navLinks = [
        { to: "/", label: "HOME", code: "00" },
        { to: "/blog", label: "BLOG", code: "01" },
        { to: "/reading-list", label: "READING", code: "02" },
        { to: "/tool", label: "TOOLS", code: "03" },
    ];

    return (
        <header className="relative z-[110]">
            {/* Main Header Bar */}
            <div className="bg-background/80 backdrop-blur-xl border-b border-primary/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="group flex items-center gap-3">
                        <div className="relative">
                            {/* Logo Icon */}
                            <div className="w-10 h-10 border border-primary/50 flex items-center justify-center group-hover:border-primary transition-colors">
                                <span className="terminal-text text-primary font-bold text-lg group-hover:glow-text-subtle transition-all">X</span>
                            </div>
                            {/* Corner Accents */}
                            <div className="absolute -top-1 -left-1 w-2 h-2 border-l-2 border-t-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r-2 border-b-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="terminal-text text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                                XIAOFENG<span className="text-primary">.DEV</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center">
                        <div className="flex items-center border border-white/5 bg-surface/30 backdrop-blur-sm">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="group relative px-6 py-3 flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary hover:bg-primary/5 transition-all border-r border-white/5 last:border-r-0"
                                >
                                    <span className="terminal-text text-xs text-primary/50 group-hover:text-primary transition-colors">
                                        {link.code}
                                    </span>
                                    <span className="terminal-text tracking-wider">
                                        {link.label}
                                    </span>
                                    {/* Active/Hover Indicator */}
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                </Link>
                            ))}
                        </div>

                        {/* Status Indicator */}
                        <div className="ml-6 flex items-center gap-2 px-3 py-1.5 border border-neon-green/30 bg-neon-green/5">
                            <span className="status-dot" />
                            <span className="terminal-text text-xs text-neon-green">ONLINE</span>
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden relative w-12 h-12 flex items-center justify-center border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="flex flex-col gap-1.5 items-center justify-center">
                            <span className={`w-5 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`w-5 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-5 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation - fixed overlay so it always appears above page content */}
            <div
                className={`md:hidden fixed inset-0 z-[120] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                aria-hidden={!isMenuOpen}
            >
                {/* Backdrop */}
                <button
                    type="button"
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                />
                {/* Menu panel - below header bar (top-20 = 5rem) */}
                <div className="absolute top-20 left-0 right-0 z-10 bg-background border-b border-primary/10 shadow-xl">
                    <nav className="max-w-7xl mx-auto px-6 py-6">
                        <div className="space-y-2">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="group flex items-center gap-4 p-4 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <span className="terminal-text text-xs text-primary w-6">
                                        [{link.code}]
                                    </span>
                                    <span className="terminal-text text-lg text-text-muted group-hover:text-primary transition-colors tracking-wider">
                                        {link.label}
                                    </span>
                                    <svg className="w-4 h-4 ml-auto text-primary opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Status */}
                        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="status-dot" />
                                <span className="terminal-text text-xs text-neon-green">SYSTEM_ACTIVE</span>
                            </div>
                            <span className="terminal-text text-xs text-text-muted">v1.0.0</span>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};
