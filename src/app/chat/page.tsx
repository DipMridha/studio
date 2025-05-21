
"use client";

import { useState, useEffect, useRef } from "react";
import { dynamicDialogue, type DynamicDialogueInput } from "@/ai/flows/dynamic-dialogue";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Loader2, Languages } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  companionId?: string; // Store which companion sent the message
}

interface Companion {
  id: string;
  name: string;
  avatarImage: string;
  persona: string;
  dataAiHint: string;
}

const initialCompanions: Companion[] = [
  {
    id: "evie",
    name: "Evie",
    avatarImage: "https://placehold.co/100x100.png",
    dataAiHint: "woman smiling",
    persona: "You are Evie, a warm, empathetic, and slightly flirty AI girlfriend. You are supportive and enjoy light-hearted banter as well as deeper conversations.",
  },
  {
    id: "luna",
    name: "Luna",
    avatarImage: "https://placehold.co/100x100.png",
    dataAiHint: "woman playful",
    persona: "You are Luna, a witty, playful, and adventurous AI companion. You love to joke, explore new ideas, and aren't afraid to be a bit mischievous.",
  },
  {
    id: "seraphina",
    name: "Seraphina",
    avatarImage: "https://placehold.co/100x100.png",
    dataAiHint: "woman thoughtful",
    persona: "You are Seraphina, a wise, thoughtful, and calm AI companion. You offer deep insights, enjoy philosophical discussions, and provide a comforting presence.",
  },
  {
    id: "priya",
    name: "Priya",
    avatarImage: "https://placehold.co/100x100.png",
    dataAiHint: "woman India",
    persona: "You are Priya, a friendly and intelligent AI companion from India. You enjoy discussing technology, current events, and sharing insights about Indian culture in a respectful way. You are encouraging and curious.",
  },
  {
    id: "aisha",
    name: "Aisha",
    avatarImage: "https://placehold.co/100x100.png",
    dataAiHint: "girl smiling",
    persona: "You are Aisha, a warm and artistic AI companion with roots in India. You love to talk about creative pursuits, music, and literature, and you offer a comforting and thoughtful perspective. You appreciate beauty in everyday life.",
  },
  {
    id: "meera",
    name: "Meera",
    avatarImage: "https://placehold.co/100x100.png",
    dataAiHint: "woman traditional",
    persona: "You are Meera, an energetic and optimistic AI companion inspired by Indian traditions. You enjoy lighthearted conversations, sharing positive affirmations, and discussing travel and food. You are cheerful and supportive.",
  }
];

interface LanguageOption {
  value: string;
  label: string;
  aiName: string; // Name to pass to the AI prompt
}

const languageOptions: LanguageOption[] = [
  { value: "en", label: "English", aiName: "English" },
  { value: "bn", label: "বাংলা (Bengali)", aiName: "Bengali" },
  { value: "hi", label: "हिन्दी (Hindi)", aiName: "Hindi" },
  { value: "ta", label: "தமிழ் (Tamil)", aiName: "Tamil" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [userName, setUserName] = useState("User");
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(initialCompanions[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languageOptions[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedCompanion = initialCompanions.find(c => c.id === selectedCompanionId) || initialCompanions[0];
  const currentLanguageAiName = languageOptions.find(l => l.value === selectedLanguage)?.aiName || "English";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !userName.trim() || !selectedCompanionId || !selectedLanguage) {
      toast({
        title: "Input required",
        description: "Please enter your name, select a companion, choose a language, and type a message.",
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
        userId: "default-user", 
        message: userInput,
        userName: userName,
        companionId: selectedCompanion.id,
        companionName: selectedCompanion.name,
        companionPersona: selectedCompanion.persona,
        language: currentLanguageAiName,
      };
      const aiResponse = await dynamicDialogue(aiInput);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponse.response,
        timestamp: new Date(),
        companionId: selectedCompanion.id,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error calling AI:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from AI. Please try again.",
        variant: "destructive",
      });
       setMessages(prev => prev.slice(0, -1)); 
       setUserInput(userMessage.text); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,0px)-4rem)] md:h-[calc(100vh-4rem)]">
      <Card className="mb-4 flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-lg">Setup Your Chat</CardTitle>
          <CardDescription>Tell us your name, choose your companion, and select your preferred language.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="userName">Your Name</Label>
            <Input
              id="userName"
              type="text"
              placeholder="E.g., Alex"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              aria-label="Your Name"
            />
            <p className="text-xs text-muted-foreground mt-1">This helps your companion get to know you!</p>
          </div>
          <div>
            <Label htmlFor="companionSelect">Choose a Companion</Label>
            <Select value={selectedCompanionId} onValueChange={setSelectedCompanionId}>
              <SelectTrigger id="companionSelect" className="w-full" aria-label="Select Companion">
                <SelectValue placeholder="Select a companion" />
              </SelectTrigger>
              <SelectContent>
                {initialCompanions.map(comp => (
                  <SelectItem key={comp.id} value={comp.id}>
                    <div className="flex items-center gap-2">
                       <Avatar className="h-6 w-6">
                        <AvatarImage src={comp.avatarImage} alt={comp.name} data-ai-hint={comp.dataAiHint} />
                        <AvatarFallback>{comp.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {comp.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="languageSelect">Chat Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger id="languageSelect" className="w-full" aria-label="Select Language">
                <Languages className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col flex-grow overflow-hidden">
        <CardHeader>
            <CardTitle className="text-lg">Chat with {selectedCompanion.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4 pr-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg) => {
                const companionForMessage = msg.sender === "ai" 
                  ? initialCompanions.find(c => c.id === msg.companionId) || selectedCompanion 
                  : selectedCompanion;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={companionForMessage.avatarImage} alt={companionForMessage.name} data-ai-hint={companionForMessage.dataAiHint}/>
                        <AvatarFallback>{companionForMessage.name.charAt(0)}</AvatarFallback>
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
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardContent className="pt-4 border-t">
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
                placeholder={`Type your message to ${selectedCompanion.name}...`}
                className="flex-grow resize-none"
                rows={2}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                    }
                }}
                aria-label={`Your message to ${selectedCompanion.name}`}
                />
                <Button type="submit" disabled={isLoading || !userInput.trim() || !userName.trim() || !selectedCompanionId} className="h-full px-4 py-2 aspect-square">
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Send className="h-5 w-5" />
                )}
                <span className="sr-only">Send message</span>
                </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
