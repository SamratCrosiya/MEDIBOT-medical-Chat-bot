import { Link } from "react-router-dom";
import { RefreshCw, Search, Monitor, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const modules = [
  {
    icon: RefreshCw,
    title: "PromptMirror",
    tagline: "One prompt. Many minds.",
    description: "Compare responses from multiple AI models simultaneously. Get insights from OpenAI, Claude, Gemini, and more — all from a single prompt.",
    features: [
      "Side-by-side AI response comparison",
      "Response diffing and quality scoring",
      "Custom context and tone settings",
      "Export and share results",
    ],
    href: "/prompt-mirror",
    gradient: "from-primary to-secondary",
    available: true,
  },
  {
    icon: Search,
    title: "AI Discovery Hub",
    tagline: "Find the perfect AI for any task.",
    description: "Explore the latest AI tools, models, and platforms. Get personalized recommendations based on your profession and use cases.",
    features: [
      "Auto-updating AI tool database",
      "Filter by domain and use case",
      "Pricing and feature comparisons",
      "One-click prompt templates",
    ],
    href: "/discovery",
    gradient: "from-secondary to-accent",
    available: false,
  },
  {
    icon: Monitor,
    title: "ScreenSage",
    tagline: "Your screen's smartest observer.",
    description: "AI assistant that analyzes your screenshots and provides contextual help, explanations, and suggestions.",
    features: [
      "Real-time screen analysis",
      "Contextual AI assistance",
      "Code review & UI critique",
      "Privacy-first design",
    ],
    href: "/screen-sage",
    gradient: "from-accent to-amber",
    available: true,
  },
  {
    icon: Target,
    title: "HireWise",
    tagline: "Practice smart. Interview strong.",
    description: "AI-powered interview coach that adapts to your role and provides personalized feedback to help you ace your next interview.",
    features: [
      "Role-specific interview simulation",
      "Real-time feedback and scoring",
      "STAR method coaching",
      "Resume integration",
    ],
    href: "/hire-wise",
    gradient: "from-emerald to-cyan",
    available: true,
  },
];

export function ModulesSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-center bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent shimmer">
          Powerful AI Modules
        </h2>
        <p className="text-center text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
          Four revolutionary tools designed to transform how you work with AI
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {modules.map((module, index) => (
            <div
              key={module.title}
              className="group glass rounded-3xl p-8 hover:-translate-y-4 hover:border-primary/50 hover:shadow-glow transition-all duration-500 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div 
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center text-3xl icon-float mb-6`}
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <module.icon className="w-10 h-10 text-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-display text-2xl font-bold text-foreground mb-1">
                {module.title}
              </h3>
              <p className="text-primary text-sm font-semibold italic mb-4">
                {module.tagline}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {module.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {module.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-muted-foreground/80">
                    <span className="text-emerald font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to={module.href}>
                <Button variant="module" className="group/btn">
                  {module.available ? "Launch" : "Coming Soon"} {module.title}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
