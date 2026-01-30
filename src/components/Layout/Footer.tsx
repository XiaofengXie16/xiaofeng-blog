import GithubIcon from "../../assets/images/github.svg";
import LinkedinIcon from "../../assets/images/linkedin.svg";
import TwitterIcon from "../../assets/images/twitter.svg";

export const Footer = () => {
    return (
        <footer className="relative mt-auto border-t border-primary/10 bg-background/80 backdrop-blur-xl">
            {/* Top Line Accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left - Copyright */}
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-neon-green animate-pulse" />
                        <span className="terminal-text text-sm text-text-muted">
                            <span className="text-primary">&copy; {new Date().getFullYear()}</span>
                            {" "}<span className="text-text-main">XIAOFENG.DEV</span>
                            {" "}<span className="text-text-muted">// ALL_RIGHTS_RESERVED</span>
                        </span>
                    </div>

                    {/* Right - Social Links */}
                    <div className="flex items-center gap-2">
                        <span className="terminal-text text-xs text-text-muted mr-4">CONNECT &gt;</span>
                        <div className="flex gap-1">
                            <SocialLink href="https://github.com/XiaofengXie16" icon={GithubIcon} label="GitHub" />
                            <SocialLink href="https://www.linkedin.com/in/xiaofengxie16/" icon={LinkedinIcon} label="LinkedIn" />
                            <SocialLink href="https://twitter.com/XiaofengXie16" icon={TwitterIcon} label="Twitter" />
                        </div>
                    </div>
                </div>

                {/* Bottom Status Bar */}
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 terminal-text text-xs text-text-muted">
                    <span>STATUS: <span className="text-neon-green">OPERATIONAL</span></span>
                    <span className="hidden sm:inline">|</span>
                    <span>BUILT_WITH: <span className="text-primary">REACT</span> + <span className="text-secondary">TYPESCRIPT</span></span>
                    <span className="hidden sm:inline">|</span>
                    <span>VERSION: <span className="text-accent">1.0.0</span></span>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon, label }: { href: string; icon: string; label: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative p-3 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
        aria-label={label}
    >
        <img
            src={icon}
            className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-all duration-300"
            alt={label}
        />
        {/* Tooltip */}
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-surface border border-primary/30 terminal-text text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {label.toUpperCase()}
        </span>
        {/* Corner Accents */}
        <span className="absolute top-0 left-0 w-2 h-2 border-l border-t border-primary/0 group-hover:border-primary/50 transition-colors" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-primary/0 group-hover:border-primary/50 transition-colors" />
    </a>
);
