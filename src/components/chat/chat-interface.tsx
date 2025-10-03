
"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useAuth } from "@/providers/auth-provider";
import { aiCareerChat, type AiCareerChatInput } from "@/ai/flows/ai-career-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getInitials = (name: string | null | undefined) => {
    if (name) {
      const nameParts = name.split(" ");
      return nameParts.map((part) => part[0]).join("").toUpperCase();
    }
    return 'U';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const chatInput: AiCareerChatInput = {
        message: input,
        chatHistory: messages.map(m => ({ role: m.role, content: m.content })),
      };

      const result = await aiCareerChat(chatInput);

      if (result.response) {
        const assistantMessage: Message = { role: "assistant", content: result.response };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("AI did not provide a response.");
      }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to get AI response. Please try again.",
        });
        setMessages(prev => prev.slice(0, -1)); // Remove the user message if AI fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-4",
                message.role === "user" ? "justify-end" : ""
              )}
            >
              {message.role === "assistant" && (
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback>
                    <Bot className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-md rounded-lg p-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === "user" && user && (
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src={user.photoURL ?? ""} />
                  <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {loading && (
             <div className="flex items-start gap-4">
                <Avatar className="h-9 w-9 border">
                    <AvatarFallback>
                        <Bot className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                </Avatar>
                <div className="max-w-md rounded-lg p-3 bg-card flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about career paths, skills, or advice..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
