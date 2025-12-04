import { ReactNode, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Create floating particles
    const particleCount = 20;
    const container = document.getElementById("particles");
    if (container && container.children.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        container.appendChild(particle);
      }
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="bg-animated" />
      <div id="particles" className="fixed inset-0 pointer-events-none z-0" />
      
      {/* Content */}
      <Navbar />
      <main className="relative z-10 pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
