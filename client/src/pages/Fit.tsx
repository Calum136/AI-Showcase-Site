import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useMessages, useSendMessage } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FitConversation() {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: messages = [], isLoading } = useMessages();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    sendMessage({
      role: "user",
      content: inputValue.trim()
    });
    setInputValue("");
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto h-[80vh] flex flex-col">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold font-display">Fit Check</h1>
          <p className="text-muted-foreground mt-2">
            Ask the AI anything about my background, skills, or availability.
          </p>
        </div>

        <Card className="flex-grow flex flex-col overflow-hidden border-border/50 shadow-xl bg-background/50 backdrop-blur-sm">
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
              </div>
            )}

            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                <Bot className="w-12 h-12 text-muted-foreground mb-4" />
                <p>Start a conversation to see if we're a good fit!</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full gap-3 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={cn(
                  "p-3.5 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-muted/80 rounded-tl-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isSending && (
              <div className="flex w-full gap-3 max-w-[85%] ml-auto flex-row-reverse">
                 <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 animate-pulse">
                  <User className="w-4 h-4 text-primary" />
                </div>
                 <div className="p-3.5 rounded-2xl rounded-tr-sm bg-primary/10 text-primary w-24">
                   <div className="flex gap-1 justify-center">
                     <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                     <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                     <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                   </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-background border-t border-border">
            <div className="relative flex items-center">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="pr-12 py-6 rounded-xl border-border focus-visible:ring-primary/20 text-base"
                disabled={isSending}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-2 w-8 h-8 rounded-lg"
                disabled={!inputValue.trim() || isSending}
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
