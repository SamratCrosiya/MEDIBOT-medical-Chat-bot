import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  Send, Stethoscope, FileText, Pill, MessageSquare, 
  AlertTriangle, Bot, User, Trash2, Upload, Database
} from "lucide-react";
import { DocumentUpload } from "@/components/medibot/DocumentUpload";
import { RAGIndicator } from "@/components/medibot/RAGIndicator";

interface RAGContext {
  sources: string[];
  keywordsUsed: string[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
  urgency?: string;
  ragContext?: RAGContext | null;
}

interface UploadedDocument {
  id: string;
  filename: string;
  created_at: string;
}

type Mode = "general" | "symptom" | "report" | "drug";

const modes = [
  { id: "general" as Mode, label: "General Chat", icon: MessageSquare, color: "from-primary to-secondary" },
  { id: "symptom" as Mode, label: "Symptom Check", icon: Stethoscope, color: "from-emerald to-cyan" },
  { id: "report" as Mode, label: "Report Analysis", icon: FileText, color: "from-amber to-accent" },
  { id: "drug" as Mode, label: "Drug Info", icon: Pill, color: "from-secondary to-primary" },
];

const MediBot = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('medical_documents')
      .select('id, filename, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDocuments(data);
    }
  }, [user]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Set initial greeting when mode changes
  useEffect(() => {
    const greetings: Record<Mode, string> = {
      general: `👋 Hello! I'm MediBot, your AI health assistant powered by **RAG (Retrieval-Augmented Generation)**.

I use a curated medical knowledge base to provide accurate, domain-specific information. I can help you with:

• 🔍 Understanding your symptoms
• 📄 Simplifying medical reports  
• 💊 Providing medication information
• ❓ General health questions

**📚 Upload your own medical documents** to personalize my responses!

How can I help you today?

_Remember: I'm here to help, but I'm not a replacement for professional medical advice._`,
      symptom: `🩺 **Symptom Checker Mode** (RAG-Enhanced)

Describe your symptoms in detail. Include:
• What you're feeling
• When it started
• How severe it is (1-10)
• Any other relevant information

I'll search my medical knowledge base to help you understand what might be happening.

_Note: This is not a diagnosis. Always consult a healthcare provider for proper medical advice._`,
      report: `📄 **Medical Report Analyzer** (RAG-Enhanced)

Paste your lab results or medical report text below. I'll use my knowledge base to help you understand:
• What each value means
• Whether results are normal (using standard reference ranges)
• Questions to ask your doctor

Just paste the text and I'll translate the medical jargon into plain English!`,
      drug: `💊 **Drug Information Mode** (RAG + FDA API)

Type the name of any medication, and I'll search:
• 📚 My built-in drug knowledge base
• 🏛️ FDA OpenFDA database
• 📁 Your uploaded documents

I'll provide comprehensive information including uses, side effects, and warnings!`,
    };

    setMessages([{ role: "assistant", content: greetings[mode] }]);
  }, [mode]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("medibot-chat", {
        body: { 
          message: input.trim(), 
          mode,
          userId: user?.id 
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        urgency: data.urgency,
        ragContext: data.ragContext,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save to chat history if logged in
      if (user) {
        await supabase.from("chat_history").insert({
          user_id: user.id,
          message: input.trim(),
          response: data.response,
          message_type: mode,
          urgency_level: data.urgency || "normal",
        });
      }

      if (data.urgency === "emergency" || data.isEmergency) {
        toast({
          title: "🚨 Emergency Detected",
          description: "Please call emergency services immediately!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("MediBot error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setMode("general");
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="py-20 px-4 min-h-screen">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald to-cyan flex items-center justify-center icon-float">
                <Stethoscope className="w-8 h-8 text-foreground" />
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black gradient-text">
              MediBot Chat
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
              <Database className="w-4 h-4" />
              RAG-Powered Medical AI Assistant
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 animate-fade-in-up animation-delay-100">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  mode === m.id
                    ? `bg-gradient-to-r ${m.color} text-foreground`
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <m.icon className="w-4 h-4" />
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-4 gap-6 animate-fade-in-up animation-delay-200">
            {/* Sidebar - Document Upload */}
            <div className="lg:col-span-1">
              <div className="glass-strong rounded-2xl p-4 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Upload className="w-4 h-4 text-primary" />
                    Your Documents
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDocuments(!showDocuments)}
                    className="text-xs"
                  >
                    {showDocuments ? 'Hide' : 'Show'}
                  </Button>
                </div>
                
                {showDocuments && (
                  <DocumentUpload 
                    documents={documents} 
                    onDocumentsChange={fetchDocuments} 
                  />
                )}

                {!showDocuments && (
                  <p className="text-xs text-muted-foreground">
                    Upload medical documents to personalize RAG responses. 
                    Your documents are private and searchable.
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">RAG Sources</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald rounded-full"></span>
                      Built-in Medical KB
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-cyan rounded-full"></span>
                      Your Documents ({documents.length})
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-amber rounded-full"></span>
                      OpenFDA API (Drug Mode)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Chat */}
            <div className="lg:col-span-3">
              <div className="glass-strong rounded-3xl overflow-hidden shadow-card">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-emerald to-cyan p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-foreground/20 flex items-center justify-center">
                      {modes.find((m) => m.id === mode)?.icon && (
                        <div className="w-5 h-5 text-foreground">
                          {(() => {
                            const Icon = modes.find((m) => m.id === mode)!.icon;
                            return <Icon className="w-5 h-5" />;
                          })()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {modes.find((m) => m.id === mode)?.label}
                      </h3>
                      <p className="text-xs text-foreground/80">RAG-Enhanced AI</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearChat}
                      className="text-foreground/80 hover:text-foreground hover:bg-foreground/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div
                  ref={chatContainerRef}
                  className="h-[450px] overflow-y-auto p-6 space-y-4 bg-background/50"
                >
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message-animate flex gap-3 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.urgency === "emergency"
                              ? "bg-destructive"
                              : msg.urgency === "high"
                              ? "bg-amber"
                              : "bg-gradient-to-r from-emerald to-cyan"
                          }`}
                        >
                          {msg.urgency === "emergency" ? (
                            <AlertTriangle className="w-5 h-5 text-foreground" />
                          ) : (
                            <Bot className="w-5 h-5 text-foreground" />
                          )}
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-emerald to-cyan text-foreground p-4"
                            : msg.urgency === "emergency"
                            ? "bg-destructive/20 border-2 border-destructive p-4"
                            : "glass border border-emerald/30 p-4"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        {msg.role === "assistant" && msg.ragContext && (
                          <RAGIndicator ragContext={msg.ragContext} />
                        )}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald to-cyan flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="glass border border-emerald/30 p-4 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-primary animate-pulse" />
                          <span className="text-sm text-muted-foreground">Searching knowledge base...</span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          <span className="w-2 h-2 bg-emerald rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-emerald rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-emerald rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border flex gap-3 bg-card/50">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      mode === "symptom"
                        ? "Describe your symptoms..."
                        : mode === "report"
                        ? "Paste your medical report here..."
                        : mode === "drug"
                        ? "Enter medication name..."
                        : "Ask MediBot anything..."
                    }
                    className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald resize-none min-h-[50px] max-h-[150px]"
                    disabled={isLoading}
                    rows={1}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    size="lg"
                    className="bg-gradient-to-r from-emerald to-cyan hover:opacity-90"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-muted-foreground mt-6 max-w-2xl mx-auto">
            ⚠️ MediBot uses RAG (Retrieval-Augmented Generation) with a curated medical knowledge base. 
            It does not provide professional medical advice. Always consult a qualified healthcare provider.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default MediBot;