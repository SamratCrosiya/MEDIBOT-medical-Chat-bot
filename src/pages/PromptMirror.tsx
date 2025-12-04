import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bot, Sparkles, Zap, Brain } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIResponses {
  gpt: string;
  claude: string;
  gemini: string;
  mistral: string;
}

const modelInfo = [
  { key: "gpt", name: "OpenAI GPT", icon: Bot, color: "from-emerald to-cyan" },
  { key: "claude", name: "Anthropic Claude", icon: Brain, color: "from-secondary to-accent" },
  { key: "gemini", name: "Google Gemini", icon: Sparkles, color: "from-primary to-secondary" },
  { key: "mistral", name: "Mistral AI", icon: Zap, color: "from-amber to-accent" },
];

const PromptMirror = () => {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("");
  const [length, setLength] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponses | null>(null);

  const compareAIs = async () => {
    if (!prompt.trim()) {
      toast({ title: "Please enter a prompt", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResponses(null);

    try {
      const { data, error } = await supabase.functions.invoke("prompt-mirror", {
        body: { prompt, tone, length },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResponses(data);
      toast({ title: "Comparison complete!", description: "Responses from 4 AI models generated." });
    } catch (error) {
      console.error("Comparison error:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to compare AI models.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="py-20 px-4 min-h-screen">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center icon-float">
                <RefreshCw className="w-8 h-8 text-foreground" />
              </div>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black gradient-text">
              PromptMirror
            </h1>
            <p className="text-primary italic font-semibold text-lg mt-2">
              "One prompt. Many minds."
            </p>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Compare responses from multiple AI models simultaneously. See how GPT, Claude, Gemini, and Mistral each interpret your prompt.
            </p>
          </div>

          {/* Input Section */}
          <div className="glass-strong rounded-3xl p-8 mb-8 animate-fade-in-up animation-delay-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  Enter Your Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask anything... e.g., 'Explain quantum computing in simple terms' or 'Write a marketing email for a new product'"
                  className="w-full min-h-[120px] px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                />
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Tone: Default</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="creative">Creative</option>
                  <option value="technical">Technical</option>
                </select>

                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Length: Default</option>
                  <option value="brief">Brief</option>
                  <option value="detailed">Detailed</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>

                <Button
                  onClick={compareAIs}
                  disabled={isLoading || !prompt.trim()}
                  variant="hero"
                  size="lg"
                  className="ml-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="loader" />
                      Comparing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Compare AI Models
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up animation-delay-200">
            {modelInfo.map((model, index) => (
              <div
                key={model.key}
                className="glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                    <model.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg text-primary">{model.name}</h3>
                </div>
                <div className="text-muted-foreground min-h-[150px]">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="loader" />
                      <span>Generating response...</span>
                    </div>
                  ) : responses ? (
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {responses[model.key as keyof AIResponses]}
                    </p>
                  ) : (
                    <p className="italic text-muted-foreground/60">
                      Results will appear here after comparison...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PromptMirror;
