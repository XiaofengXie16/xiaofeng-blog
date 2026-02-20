import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../components/ui/Button";
import { GlitchText } from "../components/effects/GlitchText";
import { FloatingOrbs, GridLines, NoiseOverlay } from "../components/effects/FloatingOrbs";
import { TiltCard } from "../components/effects/TiltCard";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [_isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative">
      {/* Background Effects */}
      <FloatingOrbs />
      <GridLines />
      <NoiseOverlay />

      {/* Scan Line */}
      <div className="scan-line" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Animated Geometric Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Rotating hexagon */}
          <div
            className="absolute top-1/4 right-1/4 w-64 h-64 border border-primary/10 opacity-30"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              animation: "rotate 30s linear infinite",
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }}
          />

          {/* Diamond shape */}
          <div
            className="absolute bottom-1/3 left-1/4 w-48 h-48 border border-secondary/10 rotate-45 opacity-20"
            style={{
              animation: "rotate 25s linear infinite reverse",
              transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px) rotate(45deg)`,
            }}
          />

          {/* Circle ring */}
          <div
            className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full border border-accent/5 opacity-30"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 mb-8 border border-primary/30 bg-surface/50 backdrop-blur-xl animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
            </span>
            <span className="terminal-text text-sm text-primary tracking-widest">
              SYSTEM INITIALIZED
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mb-6">
            <span className="block text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-text-main">
              READ
            </span>
            <span className="block text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-text-main">
              THINK
            </span>
            <span className="block text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter">
              <span className="glitch-text shimmer-text" data-text="CODE">
                CODE
              </span>
            </span>
          </h1>

          {/* Tagline */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto">
              Software Engineer crafting digital experiences
            </p>
          </div>

          {/* Terminal Window */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="cyber-card hud-corners overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-surface/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent/80 hover:bg-accent transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-neon-yellow/80 hover:bg-neon-yellow transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-neon-green/80 hover:bg-neon-green transition-colors cursor-pointer" />
                </div>
                <span className="ml-4 terminal-text text-xs text-text-muted">xiaofeng@dev ~ </span>
              </div>

              {/* Terminal Body */}
              <div className="p-6 text-left terminal-text text-sm leading-relaxed">
                <div className="mb-3">
                  <span className="text-neon-green">➜</span>
                  <span className="text-primary ml-2">~</span>
                  <span className="text-text-muted ml-2">whoami</span>
                </div>
                <div className="text-text-main mb-4 pl-4 border-l-2 border-primary/30">
                  <span className="text-primary font-bold">Xiaofeng Xie</span>
                  <span className="text-text-muted"> // Full-Stack Engineer</span>
                </div>
                <div className="mb-3">
                  <span className="text-neon-green">➜</span>
                  <span className="text-primary ml-2">~</span>
                  <span className="text-text-muted ml-2">cat interests.json</span>
                </div>
                <div className="text-text-muted pl-4">
                  <span className="text-secondary">{"{"}</span>
                  <br />
                  <span className="ml-4">"focus": </span>
                  <span className="text-accent">"React, TypeScript, System Design"</span>,
                  <br />
                  <span className="ml-4">"passion": </span>
                  <span className="text-accent">"Building elegant solutions"</span>
                  <br />
                  <span className="text-secondary">{"}"}</span>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-neon-green">➜</span>
                  <span className="text-primary ml-2">~</span>
                  <span className="typing-cursor ml-2"></span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/blog">
              <button className="neon-button group">
                <span className="flex items-center gap-2">
                  <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                    01
                  </span>
                  EXPLORE BLOG
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </button>
            </Link>
            <a href="https://github.com/XiaofengXie16" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full sm:w-auto">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                VIEW SOURCE
              </Button>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="flex flex-col items-center gap-3">
            <span className="terminal-text text-xs text-text-muted tracking-[0.3em]">SCROLL</span>
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center p-2">
              <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Corner Decorations */}
        <div
          className="absolute top-20 left-6 md:left-20 terminal-text text-xs text-text-muted/50 animate-fade-in"
          style={{ animationDelay: "1.5s" }}
        >
          <div>LAT: 37.7749° N</div>
          <div>LON: 122.4194° W</div>
        </div>
        <div
          className="absolute top-20 right-6 md:right-20 terminal-text text-xs text-text-muted/50 text-right animate-fade-in"
          style={{ animationDelay: "1.5s" }}
        >
          <div>SYS.VERSION: 2.0.0</div>
          <div>STATUS: ACTIVE</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        {/* Section Divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
              <span className="terminal-text text-sm text-primary tracking-[0.3em]">EXPLORE</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              <GlitchText text="SELECT MODULE" className="text-text-main" glitchOnHover />
            </h2>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              to="/blog"
              number="01"
              title="DATA_STREAM"
              subtitle="Blog"
              description="Thoughts on software engineering, architecture patterns, and tech insights."
              accentColor="primary"
              delay={0}
            />
            <FeatureCard
              to="/reading-list"
              number="02"
              title="KNOWLEDGE_BASE"
              subtitle="Reading List"
              description="Curated collection of books that shaped my engineering perspective."
              accentColor="secondary"
              delay={100}
            />
            <FeatureCard
              to="/tool"
              number="03"
              title="ARSENAL"
              subtitle="Tools"
              description="My handpicked developer tools and productivity stack."
              accentColor="accent"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="cyber-card p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem value="500+" label="COMMITS" color="primary" />
              <StatItem value="20+" label="PROJECTS" color="secondary" />
              <StatItem value="50+" label="BOOKS" color="accent" />
              <StatItem value="∞" label="COFFEE" color="neon-green" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  to: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: "primary" | "secondary" | "accent";
  delay: number;
}

function FeatureCard({
  to,
  number,
  title,
  subtitle,
  description,
  accentColor,
  delay,
}: FeatureCardProps) {
  const colorClasses = {
    primary: "group-hover:border-primary/50 group-hover:shadow-primary/20",
    secondary: "group-hover:border-secondary/50 group-hover:shadow-secondary/20",
    accent: "group-hover:border-accent/50 group-hover:shadow-accent/20",
  };

  const textColors = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
  };

  return (
    <Link to={to} className="group block animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
      <TiltCard className="h-full">
        <div
          className={`relative h-full cyber-card hud-corners p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${colorClasses[accentColor]}`}
        >
          {/* Number */}
          <div
            className={`absolute top-6 right-6 terminal-text text-4xl font-bold ${textColors[accentColor]} opacity-20 group-hover:opacity-40 transition-opacity`}
          >
            {number}
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Title Label */}
            <div
              className={`inline-flex items-center gap-2 mb-4 px-3 py-1 border ${accentColor === "primary" ? "border-primary/30 bg-primary/5" : accentColor === "secondary" ? "border-secondary/30 bg-secondary/5" : "border-accent/30 bg-accent/5"}`}
            >
              <span
                className={`w-1.5 h-1.5 ${accentColor === "primary" ? "bg-primary" : accentColor === "secondary" ? "bg-secondary" : "bg-accent"}`}
              />
              <span
                className={`terminal-text text-[10px] tracking-widest ${textColors[accentColor]}`}
              >
                {title}
              </span>
            </div>

            {/* Main Title */}
            <h3
              className={`text-3xl font-bold mb-4 text-text-main group-hover:${textColors[accentColor]} transition-colors`}
            >
              {subtitle}
            </h3>

            {/* Description */}
            <p className="text-text-muted leading-relaxed mb-8">{description}</p>

            {/* Action */}
            <div className={`flex items-center terminal-text text-sm ${textColors[accentColor]}`}>
              <span className="mr-2 opacity-50 group-hover:opacity-100 transition-opacity">
                &gt;
              </span>
              <span className="group-hover:tracking-wider transition-all">ACCESS</span>
              <svg
                className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>

          {/* Bottom Glow Line */}
          <div
            className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 ${accentColor === "primary" ? "bg-gradient-to-r from-primary to-primary/50" : accentColor === "secondary" ? "bg-gradient-to-r from-secondary to-secondary/50" : "bg-gradient-to-r from-accent to-accent/50"}`}
          />
        </div>
      </TiltCard>
    </Link>
  );
}

function StatItem({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="text-center group">
      <div
        className={`text-4xl md:text-5xl font-bold mb-2 text-${color} glow-text-subtle transition-all group-hover:scale-110`}
      >
        {value}
      </div>
      <div className="terminal-text text-xs text-text-main/60 tracking-widest">{label}</div>
    </div>
  );
}
