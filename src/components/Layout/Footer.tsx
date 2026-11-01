const LINKS = [
  { href: "https://github.com/XiaofengXie16", label: "GitHub" },
  { href: "https://www.linkedin.com/in/xiaofengxie16/", label: "LinkedIn" },
  { href: "https://twitter.com/XiaofengXie16", label: "X" },
  { href: "/rss.xml", label: "RSS" },
];

export const Footer = () => (
  <footer className="bg-night pt-10 pb-14 text-[#A9AED6]">
    <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-5 px-5 text-[15px] sm:px-8">
      <span>© {new Date().getFullYear()} Xiaofeng Xie</span>
      <nav aria-label="Elsewhere" className="flex flex-wrap gap-1">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="px-3.5 py-3 text-[#D6DAFF] hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  </footer>
);
