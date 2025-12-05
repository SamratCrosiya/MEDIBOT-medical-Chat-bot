import { Layout } from "@/components/layout/Layout";
import { RefreshCw, Search, Monitor, Target } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="py-20 px-4 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-strong rounded-3xl p-8 md:p-12 animate-fade-in-up">
            <h1 className="font-display text-4xl md:text-5xl font-black gradient-text mb-8">
              About CHOTU AI
            </h1>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                <strong className="text-foreground">CHOTU</strong> — where "Small Name, Big Intelligence" isn't just a tagline, it's our philosophy.
                We're revolutionizing how professionals interact with AI by creating the world's first unified platform
                that brings together AI comparison, discovery, real-time assistance, and career coaching.
              </p>

              <div className="glass rounded-2xl p-6 border-l-4 border-primary">
                <h2 className="font-display text-xl font-bold text-foreground mb-2">Our Mission</h2>
                <p>
                  To democratize AI access and empower every professional to leverage the full potential of artificial
                  intelligence — regardless of their technical background. CHOTU makes advanced AI capabilities
                  accessible, understandable, and actionable.
                </p>
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-6">
                What Makes CHOTU Different
              </h2>

              <div className="grid gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Multi-AI Comparison</h3>
                    <p>
                      Unlike other platforms that lock you into one AI model, CHOTU lets you compare responses from
                      GPT, Claude, Gemini, and more — helping you find the best answer every time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0">
                    <Search className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">AI Discovery Engine</h3>
                    <p>
                      Stop wasting time searching for the right AI tool. Our intelligent discovery system recommends
                      the perfect AI solutions based on your specific needs and industry.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-amber flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">ScreenSage Technology</h3>
                    <p>
                      World's first real-time screen analysis AI that understands your context and provides intelligent
                      assistance as you work — it's like having an AI expert looking over your shoulder.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald to-cyan flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">HireWise Interview Coach</h3>
                    <p>
                      Practice with an AI that adapts to your target role, provides detailed feedback, and helps you
                      master both behavioral and technical interviews using the STAR method.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
