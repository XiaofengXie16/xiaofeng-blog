import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CommandAgent } from "../CommandAgent/CommandAgent";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CommandAgent />
    </div>
  );
};
