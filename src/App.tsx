import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Modules from "./pages/Modules";
import Chat from "./pages/Chat";
import PromptMirror from "./pages/PromptMirror";
import ScreenSage from "./pages/ScreenSage";
import HireWise from "./pages/HireWise";
import DiscoveryHub from "./pages/DiscoveryHub";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/prompt-mirror" element={<PromptMirror />} />
          <Route path="/screen-sage" element={<ScreenSage />} />
          <Route path="/hire-wise" element={<HireWise />} />
          <Route path="/discovery-hub" element={<DiscoveryHub />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
