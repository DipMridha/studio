
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { View, Loader2 } from "lucide-react";

interface Companion {
  id: string;
  name: string;
  avatarImage: string; 
  persona: string;
  dataAiHint: string;
}

// Duplicating initialCompanions and CHAT_SETTINGS_KEY as done in other similar pages
// In a larger app, these would ideally be centralized.
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
    dataAiHint: "woman indian intelligent",
    persona: "You are Priya, a friendly and intelligent AI companion from India. You enjoy discussing technology, current events, and sharing insights about Indian culture in a respectful way. You are encouraging and curious.",
  },
  {
    id: "aisha",
    name: "Aisha",
    avatarImage: "https://placehold.co/100x100.png?text=A",
    dataAiHint: "woman indian artistic",
    persona: "You are Aisha, a warm and artistic AI companion with roots in India. You love to talk about creative pursuits, music, and literature, and you offer a comforting and thoughtful perspective. You appreciate beauty in everyday life.",
  },
  {
    id: "meera",
    name: "Meera",
    avatarImage: "https://placehold.co/100x100.png?text=M",
    dataAiHint: "woman indian energetic",
    persona: "You are Meera, an energetic and optimistic AI companion inspired by Indian traditions. You enjoy lighthearted conversations, sharing positive affirmations, and discussing travel and food. You are cheerful and supportive.",
  }
];

const CHAT_SETTINGS_KEY = "chatAiChatSettings";

interface CompanionCustomizations {
  selectedTraits?: string[];
  customAvatarUrl?: string;
}
interface ChatSettings {
  userName: string;
  selectedCompanionId: string;
  selectedLanguage: string;
  companionCustomizations?: {
    [companionId: string]: CompanionCustomizations;
  };
}


export default function ARModePage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [companionCustomAvatarUrl, setCompanionCustomAvatarUrl] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        const storedSettings = localStorage.getItem(CHAT_SETTINGS_KEY);
        if (storedSettings) {
          const parsedSettings: ChatSettings = JSON.parse(storedSettings);
          const companion = initialCompanions.find(c => c.id === parsedSettings.selectedCompanionId) || initialCompanions[0];
          setSelectedCompanion(companion);
          setCompanionCustomAvatarUrl(parsedSettings.companionCustomizations?.[companion.id]?.customAvatarUrl);
        } else {
          setSelectedCompanion(initialCompanions[0]);
           toast({
            title: "Companion Not Set",
            description: `Defaulting to ${initialCompanions[0].name}. Go to the Companion page to choose your companion.`,
          });
        }
      } catch (error) {
        console.error("Failed to load chat settings for AR mode:", error);
        setSelectedCompanion(initialCompanions[0]);
        toast({
          title: "Error",
          description: `Could not load companion settings. Defaulting to ${initialCompanions[0].name}.`,
          variant: "destructive",
        });
      }
    }
  }, [isClient, toast]);

  if (!isClient || !selectedCompanion) {
    return (
      <div className="flex flex-col h-[calc(100vh-var(--header-height,0px)-4rem)] md:h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading AR Mode with your companion...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
           <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={companionCustomAvatarUrl || selectedCompanion.avatarImage} alt={selectedCompanion.name} data-ai-hint={selectedCompanion.dataAiHint} />
              <AvatarFallback>{selectedCompanion.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <View className="h-7 w-7 text-primary" />
                Augmented Reality (AR) with {selectedCompanion.name}
              </CardTitle>
              <CardDescription>
                Imagine bringing {selectedCompanion.name} into your world! This feature, planned for the future, aims to use Augmented Reality to let you see and interact with your companion in your real environment.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center p-10 min-h-[300px] border-2 border-dashed border-border rounded-lg bg-muted/20">
            {companionCustomAvatarUrl || selectedCompanion.avatarImage ? (
                <Avatar className="h-32 w-32 mb-6 ring-4 ring-primary ring-offset-4 ring-offset-background shadow-xl">
                    <AvatarImage src={companionCustomAvatarUrl || selectedCompanion.avatarImage} alt={selectedCompanion.name} data-ai-hint={selectedCompanion.dataAiHint}/>
                    <AvatarFallback className="text-4xl">{selectedCompanion.name.charAt(0)}</AvatarFallback>
                </Avatar>
            ) : (
                <View className="h-24 w-24 text-muted-foreground mb-6" />
            )}
            <p className="text-lg text-foreground text-center font-medium">
              See {selectedCompanion.name} in Your World!
            </p>
             <p className="text-sm text-muted-foreground text-center mt-2 max-w-md">
              This is a conceptual preview. The full AR experience using technologies like Snap AR Kit or WebAR is part of our future vision. Stay tuned for updates!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
