import { useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <h1 className="font-display text-8xl md:text-9xl font-black gradient-text glow-pulse">
            404
          </h1>
          <p className="text-2xl text-muted-foreground mt-4 mb-8">
            Oops! Page not found
          </p>
          <Link to="/">
            <Button variant="hero" size="lg">
              <Home className="w-5 h-5" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
