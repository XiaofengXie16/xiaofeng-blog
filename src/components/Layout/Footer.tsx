import GithubIcon from "../../assets/images/github.svg";
import LinkedinIcon from "../../assets/images/linkedin.svg";
import TwitterIcon from "../../assets/images/twitter.svg";

export const Footer = () => {
    return (
        <footer className="relative mt-auto border-t border-white/5 bg-surface/30 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-text-muted text-sm font-medium">
                    © {new Date().getFullYear()} <span className="text-text-main">Xiaofeng Xie</span>. All rights reserved.
                </div>

                <div className="flex gap-6">
                    <SocialLink href="https://github.com/XiaofengXie16" icon={GithubIcon} label="GitHub" />
                    <SocialLink href="https://www.linkedin.com/in/xiaofengxie16/" icon={LinkedinIcon} label="LinkedIn" />
                    <SocialLink href="https://twitter.com/XiaofengXie16" icon={TwitterIcon} label="Twitter" />
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
        className="group relative p-2 rounded-full hover:bg-white/5 transition-colors"
        aria-label={label}
    >
        <img
            src={icon}
            className="w-6 h-6 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
            alt={label}
        />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface border border-white/10 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {label}
        </span>
    </a>
);
