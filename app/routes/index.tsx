import { createFileRoute, Link } from "@tanstack/react-router"
import LinkedinIcon from "../assets/images/linkedin.svg";
import GithubIcon from "../assets/images/github.svg";
import TwitterIcon from "../assets/images/twitter.svg";
import BookIcon from "../assets/images/book.svg";
import BlogIcon from "../assets/images/blog.svg";
import ToolIcon from "../assets/images/tool.svg";

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 overflow-auto overflow-x-hidden">
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-pink-500 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
      >
        Skip to main content
      </a>
      <main id="main-content" className="flex min-h-screen flex-col items-center justify-center gap-16 px-6">
        <section className="flex flex-col items-center justify-center gap-6 text-center">
          <h1 className="font-mono text-3xl font-bold text-pink-200 md:text-5xl">
            Read, Think and Code
          </h1>
          <h2 className="text-2xl font-medium text-gray-200 md:text-3xl">
            Xiaofeng Xie
          </h2>
        </section>

        <nav className="z-10 flex gap-8 md:gap-16" aria-label="Main navigation">
          <a
            href="https://www.linkedin.com/in/xiaofengxie16/"
            className="transition-transform hover:scale-110"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={LinkedinIcon} className="h-8 w-8 md:h-12 md:w-12" alt="Visit Xiaofeng's LinkedIn profile" />
          </a>
          <a
            href="https://github.com/XiaofengXie16"
            className="transition-transform hover:scale-110"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={GithubIcon} className="h-8 w-8 md:h-12 md:w-12" alt="Visit Xiaofeng's GitHub profile" />
          </a>
          <a
            href="https://twitter.com/XiaofengXie16"
            className="transition-transform hover:scale-110"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={TwitterIcon} className="h-8 w-8 md:h-12 md:w-12" alt="Visit Xiaofeng's Twitter profile" />
          </a>
          <Link
            to="/tool"
            className="transition-transform hover:scale-110"
          >
            <img src={ToolIcon} className="h-8 w-8 md:h-12 md:w-12" alt="View development tools" />
          </Link>
          <Link
            to="/reading-list"
            className="transition-transform hover:scale-110"
          >
            <img src={BookIcon} className="h-8 w-8 md:h-12 md:w-12" alt="View reading list" />
          </Link>
          <Link
            to="/blog"
            className="transition-transform hover:scale-110"
          >
            <img src={BlogIcon} className="h-8 w-8 md:h-12 md:w-12" alt="View blog posts" />
          </Link>
        </nav>
      </main>
    </div>
  );
}
