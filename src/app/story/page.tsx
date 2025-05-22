
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Loader2, PlayCircle } from "lucide-react";

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

interface StoryChapter {
  id: string;
  title: string;
  description: string;
  isLocked?: boolean; // Future: for unlocking based on affection level
}

const storyChapters: StoryChapter[] = [
  {
    id: "chapter1",
    title: "Chapter 1: First Encounter",
    description: "A chance meeting that sparks a new connection. Discover how your journey with your companion begins.",
  },
  {
    id: "chapter2",
    title: "Chapter 2: A Shared Secret",
    description: "Trust deepens as you and your companion share something personal. What will you reveal?",
    isLocked: true,
  },
  {
    id: "chapter3",
    title: "Chapter 3: Navigating Challenges",
    description: "Every relationship has its tests. Face a challenge together and see how your bond strengthens.",
    isLocked: true,
  },
];

export default function StoryModePage() {
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
        console.error("Failed to load chat settings for story mode:", error);
        setSelectedCompanion(initialCompanions[0]);
        toast({
          title: "Error",
          description: `Could not load companion settings. Defaulting to ${initialCompanions[0].name}.`,
          variant: "destructive",
        });
      }
    }
  }, [isClient, toast]);

  const handleStartChapter = (chapter: StoryChapter) => {
    if (!selectedCompanion) return;
    if (chapter.isLocked) {
      toast({
        title: "Chapter Locked",
        description: `This chapter with ${selectedCompanion.name} is not yet available. Continue interacting to unlock more!`,
        variant: "default",
      });
      return;
    }
    toast({
      title: `Starting: ${chapter.title}`,
      description: `Get ready for an adventure with ${selectedCompanion.name}! (Full story interaction coming soon).`,
    });
    // Future: Navigate to actual story content or trigger story flow
  };

  if (!isClient || !selectedCompanion) {
    return (
      <div className="flex flex-col h-[calc(100vh-var(--header-height,0px)-4rem)] md:h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading story mode with your companion...</p>
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
                <BookOpen className="h-7 w-7 text-primary" />
                Story Mode with {selectedCompanion.name}
              </CardTitle>
              <CardDescription>
                Embark on a journey with {selectedCompanion.name} through different story chapters. Your choices will shape the path and growth of your relationship. Full interactive story chapters are coming soon!
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Select a chapter to begin your story:</p>
          {storyChapters.map((chapter) => (
            <Card key={chapter.id} className={`bg-card/50 p-4 shadow-inner hover:shadow-md transition-shadow ${chapter.isLocked ? 'opacity-70' : ''}`}>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary">{chapter.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{chapter.description}</p>
                </div>
                <Button
                  onClick={() => handleStartChapter(chapter)}
                  disabled={chapter.isLocked}
                  variant={chapter.isLocked ? "outline" : "default"}
                  className="w-full md:w-auto"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  {chapter.isLocked ? "Locked" : "Start Chapter"}
                </Button>
              </div>
            </Card>
          ))}
          <p className="text-xs text-muted-foreground text-center pt-4">
            More chapters and interactive choices will be added soon. Your affection level with {selectedCompanion.name} may unlock new story paths in the future!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
