import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Receipt, 
  Sparkles, 
  PieChart, 
  FileText, 
  ArrowRight, 
  Check,
  Zap,
  Shield,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Receipt,
    title: "Smart Scanning",
    description: "Upload any receipt - crumpled, faded, or tilted. Our AI handles it all."
  },
  {
    icon: Sparkles,
    title: "AI Extraction",
    description: "Automatically extract vendor, date, items, amounts, and tax with 95% accuracy."
  },
  {
    icon: PieChart,
    title: "Auto-Categorize",
    description: "Expenses automatically sorted into Food, Travel, Office, and 15+ categories."
  },
  {
    icon: FileText,
    title: "Export Ready",
    description: "Generate tax-ready reports in CSV or PDF format with one click."
  }
];

const benefits = [
  { icon: Clock, text: "Save 60+ hours per year" },
  { icon: Zap, text: "Process receipts in seconds" },
  { icon: Shield, text: "95% accuracy rate" }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              InvoiceIQ
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link to="/upload">
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-background to-background" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">AI-Powered Receipt Management</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Turn Messy Receipts</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Into Smart Data
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Stop wasting hours on manual data entry. Our AI instantly extracts, categorizes, 
            and organizes your receipts for hassle-free bookkeeping.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/upload">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-lg px-8 h-14">
                Start Scanning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-emerald-500/30 hover:bg-emerald-500/10">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
                <benefit.icon className="w-5 h-5 text-emerald-400" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Smart Bookkeeping
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From receipt scanning to tax-ready reports, InvoiceIQ handles your entire expense workflow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-card border border-border hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three Steps to{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Organized Finances
              </span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Upload", desc: "Snap a photo or upload your receipt" },
              { step: "02", title: "Process", desc: "AI extracts and categorizes data instantly" },
              { step: "03", title: "Organize", desc: "View insights and export reports" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 bg-clip-text text-transparent mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Simplify Your Bookkeeping?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of small businesses saving hours every month with InvoiceIQ.
              </p>
              <Link to="/upload">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-lg px-8 h-14">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">InvoiceIQ</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Created by me • Build the Future Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
