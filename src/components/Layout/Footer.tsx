import GithubIcon from "../../assets/images/github.svg";
import LinkedinIcon from "../../assets/images/linkedin.svg";
import TwitterIcon from "../../assets/images/twitter.svg";

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border-subtle">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} Xiaofeng Xie
        </span>

        <div className="flex items-center gap-1">
          <SocialLink href="https://github.com/XiaofengXie16" icon={GithubIcon} label="GitHub" />
          <SocialLink
            href="https://www.linkedin.com/in/xiaofengxie16/"
            icon={LinkedinIcon}
            label="LinkedIn"
          />
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
    className="p-2.5 rounded-md hover:bg-surface transition-colors"
    aria-label={label}
  >
    <img
      src={icon}
      className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
      alt={label}
      loading="lazy"
      decoding="async"
    />
  </a>
);
