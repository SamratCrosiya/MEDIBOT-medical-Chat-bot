import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Stethoscope, Shield, Brain, Heart, ArrowRight, Lock, MessageSquare, FileText, Pill } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="py-20 px-4 min-h-screen">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald to-cyan flex items-center justify-center mx-auto mb-6">
              <Stethoscope className="w-10 h-10 text-foreground" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black gradient-text mb-4">About MediBot</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your AI-powered health companion designed to bridge the gap between complex medical information and everyday understanding.
            </p>
          </div>

          <div className="glass-strong rounded-3xl p-8 md:p-12 mb-12 animate-fade-in-up">
            <h2 className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
              <Heart className="w-8 h-8 text-emerald" /> Our Mission
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              MediBot serves as an intelligent first point of contact for healthcare queries. We help users understand their symptoms, 
              simplify confusing medical reports, and provide medication information — empowering informed health decisions.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 md:p-12 mb-12 animate-fade-in-up">
            <h2 className="font-display text-3xl font-bold mb-8">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: MessageSquare, title: "🤖 AI Symptom Checker", desc: "Describe symptoms naturally, get insights and guidance" },
                { icon: FileText, title: "📄 Report Simplifier", desc: "Translate medical jargon into plain English" },
                { icon: Pill, title: "💊 Drug Information", desc: "Get uses, side effects, and warnings for medications" },
                { icon: Shield, title: "🔒 Emergency Detection", desc: "Automatic alerts for serious symptoms" },
              ].map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald to-cyan flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                    <p className="text-muted-foreground text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-8 border-amber/30 bg-amber/5 mb-12 animate-fade-in-up">
            <h2 className="font-display text-2xl font-bold mb-4 text-amber">⚠️ Important Disclaimer</h2>
            <p className="text-muted-foreground">
              MediBot is NOT a replacement for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
            </p>
          </div>

          <div className="text-center">
            <Link to="/auth">
              <Button variant="hero" size="xl" className="bg-gradient-to-r from-emerald to-cyan">
                Try MediBot Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
