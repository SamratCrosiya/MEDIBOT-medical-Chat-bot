import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, Sparkles, Code, Image, MessageSquare, Music, Video, FileText, Database } from "lucide-react";

interface AITool {
  name: string;
  description: string;
  category: string;
  url: string;
  icon: typeof Code;
  color: string;
}

const aiTools: AITool[] = [
  {
    name: "ChatGPT",
    description: "Conversational AI assistant for text generation, coding help, and creative writing",
    category: "Chat",
    url: "https://chat.openai.com",
    icon: MessageSquare,
    color: "from-emerald to-cyan",
  },
  {
    name: "Claude",
    description: "Anthropic's helpful, harmless, and honest AI assistant",
    category: "Chat",
    url: "https://claude.ai",
    icon: MessageSquare,
    color: "from-secondary to-accent",
  },
  {
    name: "Midjourney",
    description: "AI art generation through text prompts, creating stunning visuals",
    category: "Image",
    url: "https://midjourney.com",
    icon: Image,
    color: "from-primary to-secondary",
  },
  {
    name: "DALL-E 3",
    description: "OpenAI's advanced image generation from text descriptions",
    category: "Image",
    url: "https://openai.com/dall-e-3",
    icon: Image,
    color: "from-amber to-accent",
  },
  {
    name: "GitHub Copilot",
    description: "AI pair programmer that helps write code faster",
    category: "Code",
    url: "https://github.com/features/copilot",
    icon: Code,
    color: "from-cyan to-emerald",
  },
  {
    name: "Cursor",
    description: "AI-first code editor for faster software development",
    category: "Code",
    url: "https://cursor.sh",
    icon: Code,
    color: "from-primary to-cyan",
  },
  {
    name: "ElevenLabs",
    description: "AI voice synthesis and cloning for realistic speech",
    category: "Audio",
    url: "https://elevenlabs.io",
    icon: Music,
    color: "from-accent to-amber",
  },
  {
    name: "Runway",
    description: "AI video editing and generation tools for creators",
    category: "Video",
    url: "https://runwayml.com",
    icon: Video,
    color: "from-secondary to-primary",
  },
  {
    name: "Notion AI",
    description: "AI writing assistant integrated with Notion workspace",
    category: "Writing",
    url: "https://notion.so/ai",
    icon: FileText,
    color: "from-emerald to-primary",
  },
  {
    name: "Perplexity",
    description: "AI-powered search engine with real-time information",
    category: "Search",
    url: "https://perplexity.ai",
    icon: Search,
    color: "from-cyan to-secondary",
  },
  {
    name: "Hugging Face",
    description: "Platform for ML models, datasets, and AI applications",
    category: "Platform",
    url: "https://huggingface.co",
    icon: Database,
    color: "from-amber to-emerald",
  },
  {
    name: "Stable Diffusion",
    description: "Open-source AI image generation model",
    category: "Image",
    url: "https://stability.ai",
    icon: Image,
    color: "from-primary to-accent",
  },
];

const categories = ["All", "Chat", "Image", "Code", "Audio", "Video", "Writing", "Search", "Platform"];

const DiscoveryHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="py-20 px-4 min-h-screen">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center icon-float">
                <Sparkles className="w-8 h-8 text-foreground" />
              </div>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black gradient-text">
              Discovery Hub
            </h1>
            <p className="text-primary italic font-semibold text-lg mt-2">
              "Explore the AI universe."
            </p>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Discover and explore the best AI tools across categories. Find the perfect tool for your next project.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="glass-strong rounded-3xl p-6 mb-8 animate-fade-in-up animation-delay-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AI tools..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up animation-delay-200">
            {filteredTools.map((tool, index) => (
              <div
                key={tool.name}
                className="glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {tool.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:border-primary group-hover:text-primary"
                  onClick={() => window.open(tool.url, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Tool
                </Button>
              </div>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12 glass rounded-2xl">
              <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No tools found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DiscoveryHub;
