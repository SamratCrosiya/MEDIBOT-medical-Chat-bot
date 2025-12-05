import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ModulesSection } from "@/components/home/ModulesSection";
import { StatsSection } from "@/components/home/StatsSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ModulesSection />
      <StatsSection />
    </Layout>
  );
};

export default Index;
