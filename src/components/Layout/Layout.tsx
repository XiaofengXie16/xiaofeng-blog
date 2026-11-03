import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CommandAgentLoader } from "../CommandAgent/CommandAgentLoader";
import { SvgDefs } from "../design/Atmosphere";

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="relative flex min-h-screen flex-col bg-cream text-ink">
    <SvgDefs />
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
    <CommandAgentLoader />
  </div>
);
