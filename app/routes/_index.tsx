import LinkedinIcon from "../assets/images/linkedin.svg";
import GithubIcon from "../assets/images/github.svg";
import TwitterIcon from "../assets/images/twitter.svg";
import BookIcon from "../assets/images/book.svg";
import BlogIcon from "../assets/images/blog.svg";
import ToolIcon from "../assets/images/tool.svg";
import { Link } from "react-router";

export default function _index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 overflow-auto overflow-x-hidden">
      <main className="flex min-h-screen flex-col items-center justify-center gap-16 px-6">
        <section className="flex flex-col items-center justify-center gap-6 text-center">
          <h1 className="font-mono text-3xl font-bold text-pink-200 md:text-5xl">
            Read, Think and Code
          </h1>
          <h2 className="text-2xl font-medium text-gray-200 md:text-3xl">
            Xiaofeng Xie
          </h2>
        </section>
        
        <section className="z-10 flex gap-8 md:gap-16">
          <Link
            to="https://www.linkedin.com/in/xiaofengxie16/"
            className="transition-transform hover:scale-110"
          >
            <img src={LinkedinIcon} className="h-8 w-8 md:h-12 md:w-12" alt="linkedin" />
          </Link>
          <Link
            to="https://github.com/XiaofengXie16"
            className="transition-transform hover:scale-110"
          >
            <img src={GithubIcon} className="h-8 w-8 md:h-12 md:w-12" alt="github" />
          </Link>
          <Link
            to="https://twitter.com/XiaofengXie16"
            className="transition-transform hover:scale-110"
          >
            <img src={TwitterIcon} className="h-8 w-8 md:h-12 md:w-12" alt="twitter" />
          </Link>
          <Link
            to="./tool"
            prefetch="intent"
            className="transition-transform hover:scale-110"
          >
            <img src={ToolIcon} className="h-8 w-8 md:h-12 md:w-12" alt="tools" />
          </Link>
          <Link
            to="./reading-list"
            prefetch="intent"
            className="transition-transform hover:scale-110"
          >
            <img src={BookIcon} className="h-8 w-8 md:h-12 md:w-12" alt="reading list" />
          </Link>
          <Link
            to="./blog"
            prefetch="intent"
            className="transition-transform hover:scale-110"
          >
            <img src={BlogIcon} className="h-8 w-8 md:h-12 md:w-12" alt="blog" />
          </Link>
        </section>
      </main>
    </div>
  );
}
