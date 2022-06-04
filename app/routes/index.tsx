import { ClientOnly } from "remix-utils";
import LinkedinLogo from "../../assets/images/linkedin.svg";
import GithubLogo from "../../assets/images/github.svg";
import ColorSegment from "../components/ColorSegment";
import React from "react";

export default function Index() {
  return (
    <div className={"w-screen h-screen bg-black"}>
      <main
        className={"flex justify-center items-center h-full flex-col gap-12"}
      >
        <section className={"flex justify-center items-center flex-col gap-10"}>
          <h1 className="text-white text-3xl md:text-5xl font-mono">
            Read,Think and Code
          </h1>
          <h2 className={"text-white text-3xl font-cursive"}>Xiaofeng Xie</h2>
        </section>
        <section className={"flex gap-20 z-10"}>
          <a href="https://www.linkedin.com/in/markxie/">
            <img src={LinkedinLogo} className={"w-12 h-12"} alt={"linkedin"} />
          </a>
          <a href="https://github.com/XiaofengXie16">
            <img src={GithubLogo} className={"w-12 h-12"} alt={"github"} />
          </a>
        </section>
        <ClientOnly fallback={<p>Loading...</p>}>
          {() => <ColorSegment />}
        </ClientOnly>
      </main>
    </div>
  );
}
