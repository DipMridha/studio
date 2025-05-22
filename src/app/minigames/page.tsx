
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Gamepad2, Hand, Scissors, User, Loader2, Brain, FileText } from "lucide-react";

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
  affectionLevel?: number;
}
interface ChatSettings {
  userName: string;
  selectedCompanionId: string;
  selectedLanguage: string;
  companionCustomizations?: {
    [companionId: string]: CompanionCustomizations;
  };
}

type RPSChoice = "rock" | "paper" | "scissors";

export default function MiniGamesPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [companionCustomAvatarUrl, setCompanionCustomAvatarUrl] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const [userChoice, setUserChoice] = useState<RPSChoice | null>(null);
  const [aiChoice, setAiChoice] = useState<RPSChoice | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Failed to load chat settings for mini-games:", error);
        setSelectedCompanion(initialCompanions[0]);
        toast({
          title: "Error",
          description: `Could not load companion settings. Defaulting to ${initialCompanions[0].name}.`,
          variant: "destructive",
        });
      }
    }
  }, [isClient, toast]);

  const handlePlayRPS = (choice: RPSChoice) => {
    if (!selectedCompanion) return;
    setIsLoading(true);
    setUserChoice(choice);
    setAiChoice(null);
    setResult(null);

    // Simulate AI making a choice and determining the result
    // In a real app, this would involve calling an AI flow
    setTimeout(() => {
      const choices: RPSChoice[] = ["rock", "paper", "scissors"];
      const randomAiChoice = choices[Math.floor(Math.random() * choices.length)];
      setAiChoice(randomAiChoice);

      if (choice === randomAiChoice) {
        setResult("It's a Tie!");
      } else if (
        (choice === "rock" && randomAiChoice === "scissors") ||
        (choice === "scissors" && randomAiChoice === "paper") ||
        (choice === "paper" && randomAiChoice === "rock")
      ) {
        setResult("You Win!");
      } else {
        setResult(`${selectedCompanion.name} Wins!`);
      }
      setIsLoading(false);
    }, 1000); 
  };

  if (!isClient || !selectedCompanion) {
    return (
      <div className="flex flex-col h-[calc(100vh-var(--header-height,0px)-4rem)] md:h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading mini-games with your companion...</p>
      </div>
    );
  }

  const rpsIcons: Record<RPSChoice, React.ReactNode> = {
    rock: <Hand className="h-8 w-8" />,
    paper: <FileText className="h-8 w-8" />,
    scissors: <Scissors className="h-8 w-8" />,
  };

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
                <Gamepad2 className="h-7 w-7 text-primary" />
                Mini-Games with {selectedCompanion.name}
              </CardTitle>
              <CardDescription>
                Play Rock, Paper, Scissors! Other games like Trivia and Guess the Word are coming soon.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-card/50 p-4 md:p-6 shadow-inner">
            <CardTitle className="text-xl mb-4 text-center">Rock, Paper, Scissors</CardTitle>
            <div className="flex flex-col sm:flex-row justify-around items-center mb-6 gap-2">
              <Button variant="outline" size="lg" onClick={() => handlePlayRPS("rock")} disabled={isLoading} className="p-4 h-auto w-full sm:w-auto">
                {rpsIcons.rock} <span className="ml-2">Rock</span>
              </Button>
              <Button variant="outline" size="lg" onClick={() => handlePlayRPS("paper")} disabled={isLoading} className="p-4 h-auto w-full sm:w-auto">
                {rpsIcons.paper} <span className="ml-2">Paper</span>
              </Button>
              <Button variant="outline" size="lg" onClick={() => handlePlayRPS("scissors")} disabled={isLoading} className="p-4 h-auto w-full sm:w-auto">
                {rpsIcons.scissors} <span className="ml-2">Scissors</span>
              </Button>
            </div>

            {isLoading && (
              <div className="flex flex-col items-center justify-center my-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-muted-foreground">{selectedCompanion.name} is thinking...</p>
              </div>
            )}

            {!isLoading && (userChoice || aiChoice || result) && (
              <div className="space-y-4 text-center mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="p-4 border rounded-lg shadow-sm">
                    <p className="text-sm font-medium mb-2">Your Choice:</p>
                    <div className="flex justify-center items-center text-4xl h-16">
                        {userChoice ? rpsIcons[userChoice] : <User className="h-10 w-10 text-muted-foreground"/>}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg shadow-sm">
                    <p className="text-sm font-medium mb-2">{selectedCompanion.name}'s Choice:</p>
                     <div className="flex justify-center items-center text-4xl h-16">
                        {aiChoice ? rpsIcons[aiChoice] : <Brain className="h-10 w-10 text-muted-foreground"/>}
                    </div>
                  </div>
                </div>
                {result && (
                  <p className="text-2xl font-semibold text-primary pt-4">{result}</p>
                )}
              </div>
            )}
          </Card>

          <div className="text-center text-muted-foreground mt-8">
            <p className="text-sm">More games like Trivia and Guess the Word are planned for the future!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    