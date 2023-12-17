import Raycast from "~/assets/images/raycast.svg";
import Tailwind from "~/assets/images/tailwindcss.svg";
import TerminalUtility from "~/assets/images/terminal-utility.svg";
import TerminalTheme from "~/assets/images/terminal-theme.png";
import Exaclidraw from "~/assets/images/exaclidraw.svg";
import Fnm from "~/assets/images/fnm.png";
import Bat from "~/assets/images/bat.png";
import Warp from "~/assets/images/warp.png";
import Bun from "~/assets/images/bun.png";
import Vimium from "~/assets/images/vimium.png";
import Vitest from "~/assets/images/vitest.png";
import Remix from "~/assets/images/remix.svg";
import DevSpace from "~/assets/images/devspace.png";
import OrbStack from "~/assets/images/orbstack.png";
import Oxc from "~/assets/images/oxc.png";
import { CATEGORY } from "~/constants/name";

export const TOOLS = [
  {
    icon: Raycast,
    name: "Raycast",
    description:
      "Raycast is a blazingly fast, totally extendable launcher. It lets you complete tasks, calculate, share common links, and much more.",
    category: CATEGORY.DEVELOPMENT_TOOL,
    link: "https://www.raycast.com/",
  },
  {
    icon: Warp,
    name: "Warp",
    description:
      "Warp is a blazingly fast, rust-based terminal reimagined from the ground up to work like a modern app.",
    category: CATEGORY.TERMINAL_UTILITY,
    link: "https://www.warp.dev/",
  },
  {
    icon: Fnm,
    name: "Fast Node Manager (fnm)",
    description: "🚀 Fast and simple Node.js version manager, built in Rust",
    category: CATEGORY.TERMINAL_UTILITY,
    link: "https://github.com/Schniz/fnm",
  },

  {
    icon: TerminalUtility,
    name: "Zoxide",
    description: "Zoxide is a smarter cd command, inspired by z and autojump.",
    category: CATEGORY.TERMINAL_UTILITY,
    link: "https://github.com/ajeetdsouza/zoxide",
  },
  {
    icon: Bat,
    name: "Bat",
    description: "A cat(1) clone with syntax highlighting and Git integration.",
    category: CATEGORY.TERMINAL_UTILITY,
    link: "https://github.com/sharkdp/bat",
  },
  {
    icon: TerminalTheme,
    name: "Powerlevel10k",
    description:
      "Powerlevel10k is a theme for Zsh. It emphasizes speed, flexibility and out-of-the-box experience.",
    category: "Terminal theme",
    link: "https://github.com/romkatv/powerlevel10k",
  },
  {
    icon: Exaclidraw,
    name: "Exaclidraw",
    description:
      "Excalidraw is a virtual collaborative whiteboard tool that lets you easily sketch diagrams that have a hand-drawn feel to them.",
    category: CATEGORY.DEVELOPMENT_TOOL,
    link: "https://excalidraw.com/",
  },
  {
    icon: Tailwind,
    name: "Tailwind CSS",
    description:
      "A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.",
    category: CATEGORY.CSS_FRAMEWORK,
    link: "https://tailwindcss.com/",
  },
  {
    icon: Remix,
    name: "Remix",
    description:
      "Remix is a full stack web framework that lets you focus on the user interface and work back through web standards to deliver a fast, slick, and resilient user experience.",
    category: CATEGORY.JAVASCRIPT_FRAMEWORK,
    link: "https://remix.run/",
  },
  {
    icon: Vitest,
    name: "Vitest",
    description: "A Vite-native unit test framework. It's fast!",
    category: CATEGORY.TEST_FRAMEWORK,
    link: "https://vitest.dev/",
  },
  {
    icon: Bun,
    name: "Bun",
    description: "Bun is a fast all-in-one JavaScript runtime",
    category: CATEGORY.JAVASCRIPT_RUNTIME,
    link: "https://bun.sh/",
  },
  {
    icon: Vimium,
    name: "Vimium",
    description:
      "Vimium provides keyboard shortcuts for navigation and control in the spirit of Vim.",
    category: CATEGORY.DEVELOPMENT_TOOL,
    link: "https://chrome.google.com/webstore/detail/vimium/dbepggeogbaibhgnhhndojpepiihcmeb?hl=en",
  },
  {
    icon: DevSpace,
    name: "DevSpace",
    description:
      "DevSpace is an open-source developer tool for Kubernetes that lets you develop and deploy cloud-native software faster.",
    category: CATEGORY.DEVELOPMENT_TOOL,
    link: "https://www.devspace.sh/",
  },
  {
    icon: OrbStack,
    name: "OrbStack",
    description:
      "OrbStack is a fast, light, and simple way to run Docker containers and Linux machines on macOS. You can think of it as a supercharged WSL and Docker Desktop replacement, all in one easy-to-use app.",
    category: CATEGORY.DEVELOPMENT_TOOL,
    link: "https://docs.orbstack.dev/",
  },
  {
    icon: Oxc,
    name: "Oxc",
    description:
      "The Oxidation Compiler is creating a suite of high-performance tools for JavaScript and TypeScript.",
    category: CATEGORY.DEVELOPMENT_TOOL,
    link: "https://github.com/web-infra-dev/oxc",
  },
];
