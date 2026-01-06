import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald to-cyan flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-foreground" />
          </div>
          <span className="font-display text-lg font-bold gradient-text">MediBot</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/chat" className="text-muted-foreground hover:text-foreground transition-colors">Chat</Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
        </div>
        <p className="text-center text-muted-foreground/60 text-xs">
          © 2025 MediBot. Not a substitute for professional medical advice.
        </p>
      </div>
    </footer>
  );
}
