import LinkedinLogo from "../assets/images/linkedin.svg";
import GithubLogo from "../assets/images/github.svg";
import TwitterLogo from "../assets/images/twitter.svg";
import BookLogo from "../assets/images/book.svg";
import ToolLogo from "../assets/images/tool.svg";
import { Link } from "@remix-run/react";

export default function _index() {
  return (
    <div
      className={"h-screen w-screen bg-black overflow-auto overflow-x-hidden"}
    >
      <main
        className={
          "flex h-full flex-col items-center justify-center gap-24 pr-6 pl-6"
        }
      >
        <section className={"flex flex-col items-center justify-center gap-10"}>
          <h1 className="font-mono text-2xl text-white md:text-4xl">
            Read,Think and Code
          </h1>
          <h2 className={"text-2xl text-white md:text-3xl"}>Xiaofeng Xie</h2>
        </section>
        <section className={"z-10 flex md:gap-20 gap-10 flex-fluid"}>
          <Link
            to="https://www.linkedin.com/in/xiaofengxie16/"
            className={"md:h-12 md:w-12 h-6 w-6"}
          >
            <img
              src={LinkedinLogo}
              className={"md:h-12 md:w-12 h-6 w-6"}
              alt={"linkedin"}
            />
          </Link>
          <Link
            to="https://github.com/XiaofengXie16"
            className={"md:h-12 md:w-12 h-6 w-6"}
          >
            <img
              src={GithubLogo}
              className={"md:h-12 md:w-12 h-6 w-6"}
              alt={"github"}
            />
          </Link>
          <Link
            to="https://twitter.com/XiaofengXie16"
            className={"md:h-12 md:w-12 h-6 w-6"}
          >
            <img
              src={TwitterLogo}
              className={"md:h-12 md:w-12 h-6 w-6"}
              alt={"twitter"}
            />
          </Link>
          <Link
            to="./tool"
            prefetch={"intent"}
            className={"md:h-12 md:w-12 h-6 w-6"}
          >
            <img
              src={ToolLogo}
              className={"md:h-12 md:w-12 h-6 w-6"}
              alt={"blog"}
            />
          </Link>
          <Link
            to={"./book"}
            prefetch={"intent"}
            className={"md:h-12 md:w-12 h-6 w-6"}
          >
            <img
              src={BookLogo}
              className={"md:h-12 md:w-12 h-6 w-6"}
              alt={"book"}
            />
          </Link>
        </section>
      </main>
    </div>
  );
}
