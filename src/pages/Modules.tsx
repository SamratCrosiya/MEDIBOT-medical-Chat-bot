import { Layout } from "@/components/layout/Layout";
import { ModulesSection } from "@/components/home/ModulesSection";
import { StatsSection } from "@/components/home/StatsSection";

const Modules = () => {
  return (
    <Layout>
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black gradient-text glow-pulse">
              AI Modules
            </h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              Discover the powerful tools that make CHOTU your ultimate AI companion
            </p>
          </div>
        </div>
      </div>
      <ModulesSection />
      <StatsSection />
    </Layout>
  );
};

export default Modules;
