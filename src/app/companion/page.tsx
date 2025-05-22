
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCog, Languages, Settings2, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";


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

const languageOptions: LanguageOption[] = [
  { value: "en", label: "English", aiName: "English" },
  { value: "bn", label: "বাংলা (Bengali)", aiName: "Bengali" },
  { value: "hi", label: "हिन्दी (Hindi)", aiName: "Hindi" },
  { value: "ta", label: "தமிழ் (Tamil)", aiName: "Tamil" },
];

const personalityTraitsOptions = ['Shy', 'Bold', 'Funny', 'Caring', 'Gamer', 'Intellectual', 'Artistic', 'Adventurous', 'Mysterious', 'Optimistic', 'Sarcastic', 'Flirty'];

const CHAT_SETTINGS_KEY = "chatAiChatSettings";

interface CompanionCustomizations {
  selectedTraits?: string[];
}

interface ChatSettings {
  userName: string;
  selectedCompanionId: string;
  selectedLanguage: string;
  companionCustomizations?: {
    [companionId: string]: CompanionCustomizations;
  };
}

export default function CompanionPage() {
  const [userName, setUserName] = useState("User");
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(initialCompanions[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languageOptions[0].value);
  const [companionCustomizations, setCompanionCustomizations] = useState<{ [companionId: string]: CompanionCustomizations }>({});
  
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const selectedCompanion = initialCompanions.find(c => c.id === selectedCompanionId) || initialCompanions[0];
  const currentSelectedTraits = companionCustomizations[selectedCompanionId]?.selectedTraits || [];


  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (isClient) {
      try {
        const storedSettings = localStorage.getItem(CHAT_SETTINGS_KEY);
        if (storedSettings) {
          const parsedSettings: ChatSettings = JSON.parse(storedSettings);
          setUserName(parsedSettings.userName || "User");
          setSelectedCompanionId(parsedSettings.selectedCompanionId || initialCompanions[0].id);
          setSelectedLanguage(parsedSettings.selectedLanguage || languageOptions[0].value);
          setCompanionCustomizations(parsedSettings.companionCustomizations || {});
        }
      } catch (error) {
        console.error("Failed to load chat settings from localStorage:", error);
        toast({
          title: "Error",
          description: "Could not load your saved settings. Using defaults.",
          variant: "destructive",
        });
      }
    }
  }, [isClient, toast]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isClient) {
      try {
        const settings: ChatSettings = { 
            userName, 
            selectedCompanionId, 
            selectedLanguage,
            companionCustomizations 
        };
        localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save chat settings to localStorage:", error);
         toast({
          title: "Error",
          description: "Could not save your settings. Changes might not persist.",
          variant: "destructive",
        });
      }
    }
  }, [userName, selectedCompanionId, selectedLanguage, companionCustomizations, isClient, toast]);
  
  const handleSaveSettings = () => {
    if (!userName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }
    // Settings are saved automatically by the useEffect hook. 
    // This button can provide user feedback.
    toast({
      title: "Settings Updated!",
      description: "Your chat and companion preferences have been updated.",
    });
  };

  const handleTraitToggle = (trait: string) => {
    setCompanionCustomizations(prevCustomizations => {
      const currentTraits = prevCustomizations[selectedCompanionId]?.selectedTraits || [];
      const newTraits = currentTraits.includes(trait)
        ? currentTraits.filter(t => t !== trait)
        : [...currentTraits, trait];
      return {
        ...prevCustomizations,
        [selectedCompanionId]: {
          ...prevCustomizations[selectedCompanionId],
          selectedTraits: newTraits,
        },
      };
    });
  };


  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-6 w-6 text-primary" />
              Configure Chat & Companion
            </CardTitle>
            <CardDescription>
              Loading chat settings...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-10 min-h-[200px]">
              <UserCog className="h-16 w-16 text-muted-foreground mb-4 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            Configure Your Chat
          </CardTitle>
          <CardDescription>
            Set your name, choose your AI companion, and select your preferred chat language.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-6 w-6 text-primary" />
            Customize {selectedCompanion.name}'s Personality
          </CardTitle>
          <CardDescription>
            Select traits to further define how {selectedCompanion.name} interacts with you. Changes are saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {personalityTraitsOptions.map(trait => (
                    <div key={trait} className="flex items-center space-x-2">
                        <Checkbox
                            id={`trait-${trait}`}
                            checked={currentSelectedTraits.includes(trait)}
                            onCheckedChange={() => handleTraitToggle(trait)}
                        />
                        <Label htmlFor={`trait-${trait}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {trait}
                        </Label>
                    </div>
                ))}
            </div>
        </CardContent>
         <CardFooter>
             <Button onClick={handleSaveSettings} className="mt-4">
                Save All Preferences
            </Button>
         </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-6 w-6 text-primary" />
            Customize Companion Appearance
          </CardTitle>
          <CardDescription>
            Personalize your AI companion's visual style and more. This feature is coming soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-10 min-h-[200px] border-2 border-dashed border-border rounded-lg">
            <UserCog className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Advanced companion customization tools will be available here.
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Stay tuned for updates!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

