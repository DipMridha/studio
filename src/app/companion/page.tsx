
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCog, Languages, Settings2, CheckSquare, Square, ImageIcon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";


interface Companion {
  id: string;
  name: string;
  avatarImage: string; // This will be the default/placeholder
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
  customAvatarUrl?: string;
  affectionLevel?: number; // Placeholder for affection level
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
  const [affectionProgress, setAffectionProgress] = useState(20); // Example static progress

  const selectedCompanion = initialCompanions.find(c => c.id === selectedCompanionId) || initialCompanions[0];
  const currentCustomizations = companionCustomizations[selectedCompanionId] || {};
  const currentSelectedTraits = currentCustomizations.selectedTraits || [];
  const currentCustomAvatarUrl = currentCustomizations.customAvatarUrl;

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
          // In a real scenario, you'd load the affection level for the selected companion here
          // For now, we use a static example or one loaded from settings if available.
          const currentCompanionAffection = parsedSettings.companionCustomizations?.[selectedCompanionId]?.affectionLevel;
          if (currentCompanionAffection !== undefined) {
            setAffectionProgress(currentCompanionAffection);
          } else {
            setAffectionProgress(20); // Default if not found
          }

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
  }, [isClient, toast, selectedCompanionId]); // Added selectedCompanionId dependency

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isClient) {
      try {
        // Simulate updating affection level if it were dynamic
        const currentCompanionAffection = companionCustomizations[selectedCompanionId]?.affectionLevel;
        if (currentCompanionAffection === undefined) {
            // Initialize if not present, this is illustrative
             setCompanionCustomizations(prev => ({
                ...prev,
                [selectedCompanionId]: {
                    ...(prev[selectedCompanionId] || {}),
                    affectionLevel: affectionProgress, 
                }
            }));
        }

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
  }, [userName, selectedCompanionId, selectedLanguage, companionCustomizations, isClient, toast, affectionProgress]);
  
  const handleSaveSettings = () => {
    if (!userName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Settings Updated!",
      description: "Your chat and companion preferences have been updated.",
    });
  };

  const handleTraitToggle = (trait: string) => {
    setCompanionCustomizations(prevCustomizations => {
      const currentCompanionTraits = prevCustomizations[selectedCompanionId]?.selectedTraits || [];
      const newTraits = currentCompanionTraits.includes(trait)
        ? currentCompanionTraits.filter(t => t !== trait)
        : [...currentCompanionTraits, trait];
      return {
        ...prevCustomizations,
        [selectedCompanionId]: {
          ...(prevCustomizations[selectedCompanionId] || {}),
          selectedTraits: newTraits,
        },
      };
    });
  };

  // Illustrative: Simulate affection increase, in a real app this would be tied to interactions
  const simulateAffectionIncrease = () => {
    setAffectionProgress(prev => {
        const newAffection = Math.min(prev + 10, 100);
        setCompanionCustomizations(currentCustoms => ({
            ...currentCustoms,
            [selectedCompanionId]: {
                ...(currentCustoms[selectedCompanionId] || {}),
                affectionLevel: newAffection,
            }
        }));
        return newAffection;
    });
     toast({ title: "Affection Increased!", description: `Your bond with ${selectedCompanion.name} is growing!` });
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
                  {initialCompanions.map(comp => {
                    const customAvatar = companionCustomizations[comp.id]?.customAvatarUrl;
                    return (
                      <SelectItem key={comp.id} value={comp.id}>
                        <div className="flex items-center gap-2">
                           <Avatar className="h-6 w-6">
                            <AvatarImage src={customAvatar || comp.avatarImage} alt={comp.name} data-ai-hint={comp.dataAiHint} />
                            <AvatarFallback>{comp.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {comp.name}
                        </div>
                      </SelectItem>
                    );
                  })}
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
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            Customize {selectedCompanion.name}'s Appearance
          </CardTitle>
          <CardDescription>
            Personalize your AI companion's avatar using the AI Generator page. You can set a generated image as their avatar there. More advanced appearance customization tools are coming soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-10 min-h-[200px] border-2 border-dashed border-border rounded-lg">
            {currentCustomAvatarUrl ? (
               <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={currentCustomAvatarUrl} alt={`${selectedCompanion.name}'s custom avatar`} data-ai-hint={selectedCompanion.dataAiHint} />
                  <AvatarFallback>{selectedCompanion.name.charAt(0)}</AvatarFallback>
                </Avatar>
            ) : (
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            )}
            <p className="text-muted-foreground text-center">
              {currentCustomAvatarUrl ? `${selectedCompanion.name}'s current avatar is shown above.` : `Set a custom avatar for ${selectedCompanion.name} on the "AI Generator" page.`}
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              More detailed appearance settings will be available here in the future.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Affection Level with {selectedCompanion.name}
            </CardTitle>
            <CardDescription>
                Your bond with {selectedCompanion.name} grows with positive interactions. Higher affection levels may unlock special dialogues or features in the future!
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Progress value={affectionProgress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
                Current Affection: {affectionProgress}%
            </p>
            <p className="text-xs text-muted-foreground text-center">
                This feature is currently illustrative. Dynamic updates and unlocks are coming soon.
            </p>
            {/* Illustrative button to simulate affection increase */}
            <Button onClick={simulateAffectionIncrease} variant="outline" size="sm" className="mx-auto block">
                Simulate Interaction (Increase Affection)
            </Button>
        </CardContent>
      </Card>


       <CardFooter className="flex justify-start pt-6 border-t">
           <Button onClick={handleSaveSettings}>
              Save All Preferences
          </Button>
       </CardFooter>
    </div>
  );
}


    