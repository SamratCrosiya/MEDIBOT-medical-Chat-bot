import { useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Monitor, Upload, Image, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ScreenSage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please upload an image under 10MB", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const analyzeImage = async () => {
    if (!image) {
      toast({ title: "Please upload an image first", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("screen-sage", {
        body: { imageBase64: image, prompt },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setAnalysis(data.analysis);
      toast({ title: "Analysis complete!" });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="py-20 px-4 min-h-screen">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-amber flex items-center justify-center icon-float">
                <Monitor className="w-8 h-8 text-foreground" />
              </div>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black gradient-text">
              ScreenSage
            </h1>
            <p className="text-primary italic font-semibold text-lg mt-2">
              "Your screen's smartest observer."
            </p>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Upload screenshots, UI designs, or code images for intelligent analysis. Get detailed feedback, bug detection, and improvement suggestions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="glass-strong rounded-3xl p-8 animate-fade-in-up animation-delay-100">
              <h2 className="font-display text-2xl font-bold mb-6">Upload Image</h2>
              
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  image ? "border-primary/50" : "border-border hover:border-primary/30"
                }`}
              >
                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Uploaded"
                      className="max-h-[300px] mx-auto rounded-xl object-contain"
                    />
                    <button
                      onClick={() => {
                        setImage(null);
                        setAnalysis(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-destructive rounded-full hover:bg-destructive/80 transition-colors"
                    >
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <Image className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Drag & drop an image here, or click to upload
                    </p>
                    <label className="cursor-pointer">
                      <Button variant="outline" size="lg" asChild>
                        <span>
                          <Upload className="w-5 h-5 mr-2" />
                          Choose File
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Prompt Input */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  Additional Instructions (Optional)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Focus on accessibility issues' or 'Check for security vulnerabilities in this code'"
                  className="w-full min-h-[100px] px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                />
              </div>

              <Button
                onClick={analyzeImage}
                disabled={isLoading || !image}
                variant="hero"
                size="lg"
                className="w-full mt-6"
              >
                {isLoading ? (
                  <>
                    <div className="loader" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Monitor className="w-5 h-5" />
                    Analyze Image
                  </>
                )}
              </Button>
            </div>

            {/* Analysis Results */}
            <div className="glass-strong rounded-3xl p-8 animate-fade-in-up animation-delay-200">
              <h2 className="font-display text-2xl font-bold mb-6">Analysis Results</h2>
              
              <div className="min-h-[400px] rounded-xl bg-muted/30 p-6 overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="loader" />
                    <p className="text-muted-foreground">ScreenSage is analyzing your image...</p>
                  </div>
                ) : analysis ? (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                      {analysis}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Monitor className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground/60 italic">
                      Upload an image and click "Analyze" to see the results here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScreenSage;
