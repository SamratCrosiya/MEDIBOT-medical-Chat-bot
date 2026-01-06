import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Stethoscope, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "MediBot Chat", protected: true },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const filteredLinks = navLinks.filter(link => !link.protected || user);

  return (
    <nav className="fixed top-0 w-full z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 font-display text-xl md:text-2xl font-black"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-cyan flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-foreground" />
            </div>
            <span className="gradient-text">MediBot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {filteredLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn(
                      "relative text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2",
                      "after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-emerald after:to-cyan after:transition-all hover:after:w-full",
                      location.pathname === link.href && "text-foreground after:w-full"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                  <User className="w-4 h-4 text-emerald" />
                  <span className="text-sm text-muted-foreground">{user.email?.split('@')[0]}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-emerald to-cyan hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <ul className="flex flex-col gap-2">
            {filteredLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                    location.pathname === link.href && "text-foreground bg-muted/50"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {user ? (
              <li>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  Sign Out
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-lg bg-gradient-to-r from-emerald to-cyan text-foreground font-semibold text-center"
                >
                  Get Started
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
