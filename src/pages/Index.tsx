import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Stethoscope, FileText, Pill, Shield, MessageSquare, 
  ArrowRight, Heart, Brain, Activity, Clock, Users, CheckCircle 
} from "lucide-react";

const features = [
  {
    icon: Stethoscope,
    title: "AI Symptom Checker",
    description: "Describe your symptoms naturally and get insights about potential causes and recommended next steps.",
    color: "from-emerald to-cyan",
  },
  {
    icon: FileText,
    title: "Report Simplifier",
    description: "Paste your lab results or medical reports and get them translated into simple, easy-to-understand language.",
    color: "from-amber to-accent",
  },
  {
    icon: Pill,
    title: "Smart Drug Info",
    description: "Get detailed information about medications including uses, side effects, and important warnings.",
    color: "from-secondary to-primary",
  },
  {
    icon: Shield,
    title: "Emergency Detection",
    description: "Automatic detection of emergency symptoms with immediate guidance to seek professional help.",
    color: "from-destructive to-amber",
  },
];

const stats = [
  { icon: Users, value: "10K+", label: "Users Helped" },
  { icon: MessageSquare, value: "50K+", label: "Health Queries" },
  { icon: Clock, value: "24/7", label: "Available" },
  { icon: Shield, value: "100%", label: "Private & Secure" },
];

const Index = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center animate-fade-in-up">
            {/* Logo */}
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald to-cyan flex items-center justify-center icon-float shadow-glow">
                <Stethoscope className="w-10 h-10 text-foreground" />
              </div>
            </div>

            {/* Title */}
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-black mb-6">
              <span className="gradient-text glow-pulse">MediBot</span>
            </h1>

            {/* Tagline */}
            <p className="text-primary italic font-semibold text-xl md:text-2xl mb-4">
              "Your AI Health Assistant"
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Get instant health guidance, understand your symptoms, simplify medical reports, 
              and learn about medications — all in one place. Powered by advanced AI.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { icon: Heart, label: "Symptom Analysis" },
                { icon: FileText, label: "Report Translation" },
                { icon: Pill, label: "Drug Information" },
                { icon: Brain, label: "AI-Powered" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="glass px-4 py-2 rounded-full flex items-center gap-2 text-sm"
                >
                  <item.icon className="w-4 h-4 text-emerald" />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={user ? "/chat" : "/auth"}>
                <Button variant="hero" size="xl" className="group bg-gradient-to-r from-emerald to-cyan">
                  {user ? "Start Chatting" : "Get Started Free"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="font-display text-4xl md:text-5xl font-black gradient-text mb-4">
              How MediBot Helps You
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your intelligent health companion that understands, analyzes, and guides you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass rounded-3xl p-8 hover:-translate-y-2 hover:border-emerald/50 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-emerald/5 to-transparent">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald to-cyan flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-foreground" />
                </div>
                <p className="font-display text-3xl md:text-4xl font-black gradient-text">{stat.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="font-display text-4xl md:text-5xl font-black gradient-text mb-4">
              Simple & Secure
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Getting health guidance has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Sign Up", description: "Create your free account in seconds" },
              { step: "2", title: "Ask Anything", description: "Type your health question or paste reports" },
              { step: "3", title: "Get Answers", description: "Receive instant, easy-to-understand guidance" },
            ].map((item, index) => (
              <div key={item.step} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald to-cyan flex items-center justify-center mx-auto mb-4 font-display text-2xl font-black text-foreground">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-strong rounded-3xl p-12 text-center animate-fade-in-up">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald to-cyan flex items-center justify-center mx-auto mb-6">
              <Activity className="w-10 h-10 text-foreground" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-black mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust MediBot for quick, reliable health guidance.
            </p>
            <Link to={user ? "/chat" : "/auth"}>
              <Button variant="hero" size="xl" className="bg-gradient-to-r from-emerald to-cyan">
                {user ? "Open MediBot Chat" : "Start Free Today"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald" /> Free to use</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald" /> No credit card</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald" /> Instant answers</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
