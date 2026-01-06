import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Target, Send, Bot, User, Briefcase } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const roles = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "DevOps Engineer",
  "Marketing Manager",
  "Sales Representative",
  "Project Manager",
  "Business Analyst",
  "Customer Success Manager",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chotu-chat`;

const HireWise = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startInterview = async () => {
    if (!selectedRole) {
      toast({ title: "Please select a role", variant: "destructive" });
      return;
    }

    setIsStarted(true);
    setIsLoading(true);
    setMessages([]);

    const introMessage = `I'd like to practice for a ${selectedRole} interview. Please start the mock interview.`;

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: introMessage }],
          module: "hirewise",
        }),
      });

      if (!response.ok) throw new Error("Failed to start interview");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line.startsWith(":") || !line) continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6);
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages([{ role: "assistant", content: assistantContent }]);
            }
          } catch {
            // Wait for more data
          }
        }
      }
    } catch (error) {
      console.error("Interview start error:", error);
      toast({ title: "Error", description: "Failed to start interview.", variant: "destructive" });
      setIsStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: `I'm practicing for a ${selectedRole} interview.` },
            ...messages,
            userMessage,
          ],
          module: "hirewise",
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line.startsWith(":") || !line) continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6);
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) updateAssistant(content);
          } catch {
            // Wait for more data
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
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

  return (
    <Layout>
      <div className="py-20 px-4 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald to-cyan flex items-center justify-center icon-float">
                <Target className="w-8 h-8 text-foreground" />
              </div>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black gradient-text">
              HireWise
            </h1>
            <p className="text-primary italic font-semibold text-lg mt-2">
              "Practice smart. Interview strong."
            </p>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              AI-powered interview coach that adapts to your target role and provides personalized feedback using the STAR method.
            </p>
          </div>

          {!isStarted ? (
            /* Role Selection */
            <div className="glass-strong rounded-3xl p-8 animate-fade-in-up animation-delay-100">
              <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary" />
                Select Your Target Role
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 rounded-xl border text-sm font-medium transition-all duration-300 ${
                      selectedRole === role
                        ? "border-primary bg-primary/20 text-foreground"
                        : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <Button
                onClick={startInterview}
                disabled={!selectedRole}
                variant="hero"
                size="xl"
                className="w-full"
              >
                <Target className="w-5 h-5" />
                Start Mock Interview
              </Button>
            </div>
          ) : (
            /* Interview Chat */
            <div className="glass-strong rounded-3xl overflow-hidden shadow-card animate-fade-in-up">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-emerald to-cyan p-6 text-center">
                <h2 className="font-display text-2xl font-bold text-foreground flex items-center justify-center gap-3">
                  <Target className="w-7 h-7" />
                  {selectedRole} Interview
                </h2>
                <p className="text-foreground/80 mt-1">HireWise is your interview coach</p>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="h-[400px] overflow-y-auto p-6 space-y-4 bg-background/50"
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message-animate flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald to-cyan flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-emerald to-cyan text-foreground"
                          : "glass border border-emerald/30"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald to-cyan flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="glass border border-emerald/30 p-4 rounded-2xl">
                      <div className="flex gap-1">
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
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer..."
                  className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald"
                  disabled={isLoading}
                />
                <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="lg" className="bg-gradient-to-r from-emerald to-cyan">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HireWise;
