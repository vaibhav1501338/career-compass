
import { ChatInterface } from "@/components/chat/chat-interface";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Career Chat | Career Compass",
    description: "Chat with an AI mentor to explore career options.",
};

export default function ChatPage() {
  return (
    <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl mb-6">
            AI Career Chat
        </h1>
        <Card className="overflow-hidden">
            <ChatInterface />
        </Card>
    </div>
  );
}
