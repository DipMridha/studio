
"use client";

import { useState, useEffect, useRef } from "react";
import { dynamicDialogue, type DynamicDialogueInput } from "@/ai/flows/dynamic-dialogue";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Bot, Loader2 } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [userName, setUserName] = useState("User");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !userName.trim()) {
      toast({
        title: "Input required",
        description: "Please enter your name and a message.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userInput,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput("");

    try {
      const aiInput: DynamicDialogueInput = {
        userId: "default-user", // Fixed userId for now
        message: userInput,
        userName: userName,
      };
      const aiResponse = await dynamicDialogue(aiInput);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponse.response,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error calling AI:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from AI. Please try again.",
        variant: "destructive",
      });
       // Add back the user message to input if AI fails
       setMessages(prev => prev.slice(0, -1)); // remove the user message that was optimistically added
       setUserInput(userMessage.text); // put message back to input
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,0px)-4rem)] md:h-[calc(100vh-4rem)]">
      <Card className="mb-4 flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-lg">Chat with Evie</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Your Name (e.g., Alex)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="mb-2"
            aria-label="Your Name"
          />
           <p className="text-xs text-muted-foreground">Enter your name so Evie can get to know you!</p>
        </CardContent>
      </Card>

      <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "ai" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-xl px-4 py-3 shadow-md ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className="mt-1 text-xs opacity-70 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {msg.sender === "user" && (
                 <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 items-start"
      >
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message to Evie..."
          className="flex-grow resize-none"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          aria-label="Your message to Evie"
        />
        <Button type="submit" disabled={isLoading || !userInput.trim() || !userName.trim()} className="h-full px-4 py-2 aspect-square">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
           <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
