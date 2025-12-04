import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, Monitor, Target } from "lucide-react";

const uspBadges = [
  { icon: RefreshCw, label: "Multi-AI Comparison" },
  { icon: Search, label: "AI Discovery Engine" },
  { icon: Monitor, label: "Live Screen Analysis" },
  { icon: Target, label: "Interview Coaching" },
];

export function HeroSection() {
  return (
    <header className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4">
      <div className="relative z-10 max-w-5xl mx-auto animate-fade-in-up">
        {/* Main Title */}
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-wider gradient-text glow-pulse">
          CHOTU
        </h1>
        
        {/* Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-semibold italic mt-4 animate-fade-in-up animation-delay-100 opacity-0">
          "Small Name, Big Intelligence"
        </p>
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground/80 mt-6 max-w-3xl mx-auto animate-fade-in-up animation-delay-200 opacity-0">
          The unified AI platform that compares models, discovers tools, analyzes your screen in real-time, 
          and coaches you through interviews — all in one place.
        </p>

        {/* USP Badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up animation-delay-300 opacity-0">
          {uspBadges.map((badge, index) => (
            <div
              key={badge.label}
              className="glass flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all hover:-translate-y-1 cursor-default"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <badge.icon className="w-4 h-4" />
              {badge.label}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-in-up animation-delay-400 opacity-0">
          <Link to="/modules">
            <Button variant="hero" size="xl">
              Explore Modules
            </Button>
          </Link>
          <Link to="/prompt-mirror">
            <Button variant="glass" size="xl">
              Try AI Comparator
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-7 h-12 rounded-full border-2 border-muted-foreground/30 relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-foreground rounded-full animate-pulse" />
        </div>
      </div>
    </header>
  );
}
