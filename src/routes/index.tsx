import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "../components/ui/Button"
import BookIcon from "../assets/images/book.svg"
import BlogIcon from "../assets/images/blog.svg"
import ToolIcon from "../assets/images/tool.svg"

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-[100px] animate-float pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-primary mb-4">
            👋 Welcome to my digital garden
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            Read, Think <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              and Code
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Hi, I'm <span className="text-text-main font-semibold">Xiaofeng Xie</span>.
            I craft digital experiences and share my journey through software engineering.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/blog">
              <Button variant="primary" className="w-full sm:w-auto">Start Reading</Button>
            </Link>
            <a href="https://github.com/XiaofengXie16" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full sm:w-auto">View Github</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            to="/blog"
            icon={BlogIcon}
            title="Blog"
            description="Thoughts on software engineering, tech trends, and personal growth."
            color="primary"
            delay="0s"
          />
          <FeatureCard
            to="/reading-list"
            icon={BookIcon}
            title="Reading List"
            description="Curated collection of books and articles that have influenced my thinking."
            color="secondary"
            delay="0.1s"
          />
          <FeatureCard
            to="/tool"
            icon={ToolIcon}
            title="Tools"
            description="My favorite developer tools and software stack for productivity."
            color="accent"
            delay="0.2s"
          />
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  to: string;
  icon: string;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
  delay: string;
}

function FeatureCard({ to, icon, title, description, color, delay }: FeatureCardProps) {
  const colorClasses = {
    primary: "group-hover:bg-primary/20 group-hover:text-primary",
    secondary: "group-hover:bg-secondary/20 group-hover:text-secondary",
    accent: "group-hover:bg-accent/20 group-hover:text-accent",
  };

  return (
    <Link
      to={to}
      className="group relative block h-full animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full bg-surface/50 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5">
        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 transition-all duration-500 ${colorClasses[color]}`}>
          <img src={icon} className="w-7 h-7 opacity-80 group-hover:opacity-100 transition-opacity" alt={title} />
        </div>

        <h3 className="text-2xl font-bold mb-3 text-text-main group-hover:text-white transition-colors">
          {title}
        </h3>

        <p className="text-text-muted leading-relaxed group-hover:text-text-muted/80 transition-colors">
          {description}
        </p>

        <div className="mt-8 flex items-center text-sm font-medium text-text-muted group-hover:text-white transition-colors">
          Explore
          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
