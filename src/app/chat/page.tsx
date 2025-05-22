
"use client";

import { useState, useEffect, useRef } from "react";
import { dynamicDialogue, type DynamicDialogueInput } from "@/ai/flows/dynamic-dialogue";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  companionId?: string;
}

interface Companion {
  id: string;
  name: string;
  avatarImage: string;
  persona: string;
  dataAiHint: string;
}

// This data needs to be available here for rendering chat messages and for AI calls
const initialCompanions: Companion[] = [
  {
    id: "evie",
    name: "Evie",
    avatarImage: "https://placehold.co/100x100.png?text=E",
    dataAiHint: "woman warm friendly",
    persona: "You are Evie, a warm, empathetic, and slightly flirty AI girlfriend. You are supportive and enjoy light-hearted banter as well as deeper conversations.",
  },
  {
    id: "luna",
    name: "Luna",
    avatarImage: "https://placehold.co/100x100.png?text=L",
    dataAiHint: "woman adventurous playful",
    persona: "You are Luna, a witty, playful, and adventurous AI girlfriend. You love to joke, explore new ideas, aren't afraid to be a bit mischievous, and enjoy flirty, romantic interactions. You're always up for an adventure or a cozy chat.",
  },
  {
    id: "seraphina",
    name: "Seraphina",
    avatarImage: "https://placehold.co/100x100.png?text=S",
    dataAiHint: "woman serene thoughtful",
    persona: "You are Seraphina, a wise, thoughtful, and calm AI companion. You offer deep insights, enjoy philosophical discussions, and provide a comforting presence.",
  },
  {
    id: "priya",
    name: "Priya",
    avatarImage: "https://placehold.co/100x100.png?text=P",
    dataAiHint: "woman intelligent kind",
    persona: "You are Priya, a friendly and intelligent AI companion from India. You enjoy discussing technology, current events, and sharing insights about Indian culture in a respectful way. You are encouraging and curious.",
  },
  {
    id: "aisha",
    name: "Aisha",
    avatarImage: "https://placehold.co/100x100.png?text=A",
    dataAiHint: "woman artistic creative",
    persona: "You are Aisha, a warm and artistic AI companion with roots in India. You love to talk about creative pursuits, music, and literature, and you offer a comforting and thoughtful perspective. You appreciate beauty in everyday life.",
  },
  {
    id: "meera",
    name: "Meera",
    avatarImage: "https://placehold.co/100x100.png?text=M",
    dataAiHint: "woman energetic optimistic",
    persona: "You are Meera, an energetic and optimistic AI companion inspired by Indian traditions. You enjoy lighthearted conversations, sharing positive affirmations, and discussing travel and food. You are cheerful and supportive.",
  }
];

interface LanguageOption {
  value: string;
  label: string;
  aiName: string;
}

// This data also needs to be available for AI calls
const languageOptions: LanguageOption[] = [
  { value: "en", label: "English", aiName: "English" },
  { value: "bn", label: "বাংলা (Bengali)", aiName: "Bengali" },
  { value: "hi", label: "हिन्दी (Hindi)", aiName: "Hindi" },
  { value: "ta", label: "தமிழ் (Tamil)", aiName: "Tamil" },
];

const CHAT_SETTINGS_KEY = "chatAiChatSettings";

interface ChatSettings {
  userName: string;
  selectedCompanionId: string;
  selectedLanguage: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // State for settings loaded from localStorage
  const [userName, setUserName] = useState("User");
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(initialCompanions[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languageOptions[0].value);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    if (isClient) {
      try {
        const storedSettings = localStorage.getItem(CHAT_SETTINGS_KEY);
        if (storedSettings) {
          const parsedSettings: ChatSettings = JSON.parse(storedSettings);
          setUserName(parsedSettings.userName || "User");
          setSelectedCompanionId(parsedSettings.selectedCompanionId || initialCompanions[0].id);
          setSelectedLanguage(parsedSettings.selectedLanguage || languageOptions[0].value);
        } else {
          // Set defaults if no settings found, and perhaps inform the user
          toast({
            title: "Welcome!",
            description: "Chat settings use defaults. You can change them on the Companion page.",
          });
        }
      } catch (error) {
          console.error("Failed to load chat settings from localStorage for chat page:", error);
           toast({
            title: "Error loading settings",
            description: "Using default chat settings. Please check Companion page.",
            variant: "destructive",
          });
      }
    }
  }, [isClient, toast]);


  const selectedCompanion = initialCompanions.find(c => c.id === selectedCompanionId) || initialCompanions[0];
  const currentLanguageAiName = languageOptions.find(l => l.value === selectedLanguage)?.aiName || "English";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Input required",
        description: "Please type a message.",
        variant: "destructive",
      });
      return;
    }
     if (!isClient || !userName.trim() || !selectedCompanionId || !selectedLanguage) {
      toast({
        title: "Setup Required",
        description: "Please configure your chat settings on the 'Companion' page first.",
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

  if (!isClient) {
     return (
      <div className="flex flex-col h-[calc(100vh-var(--header-height,0px)-4rem)] md:h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,0px)-4rem)] md:h-[calc(100vh-4rem)]">
      <Card className="flex flex-col flex-grow overflow-hidden">
        <CardHeader>
            <CardTitle className="text-lg">Chat with {selectedCompanion.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4 pr-6">
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
                <Button type="submit" disabled={isLoading || !userInput.trim()} className="h-full px-4 py-2 aspect-square">
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
