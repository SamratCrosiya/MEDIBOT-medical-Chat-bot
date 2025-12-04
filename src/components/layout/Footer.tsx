import { Link } from "react-router-dom";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/modules", label: "Modules" },
  { href: "/prompt-mirror", label: "PromptMirror" },
  { href: "/chat", label: "AI Chat" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="relative text-muted-foreground font-semibold hover:text-foreground transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-hero after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-center text-muted-foreground/60 text-sm">
          © 2025 CHOTU AI - Small Name, Big Intelligence. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
