
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCog, Languages, Settings2, Heart, Palette, UserCircle, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CHAT_SETTINGS_KEY } from "@/lib/constants";


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

export default function CompanionPage() {
  const [userName, setUserName] = useState("User");
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(initialCompanions[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languageOptions[0].value);
  const [companionCustomizations, setCompanionCustomizations] = useState<{ [companionId: string]: CompanionCustomizations }>({});
  const [affectionProgress, setAffectionProgress] = useState(20); 
  
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect 1: Initial load from localStorage (runs once after isClient is true)
  useEffect(() => {
    if (isClient) {
      try {
        const storedSettings = localStorage.getItem(CHAT_SETTINGS_KEY);
        if (storedSettings) {
          const parsedSettings: ChatSettings = JSON.parse(storedSettings);
          
          setUserName(parsedSettings.userName || "User");
          setSelectedLanguage(parsedSettings.selectedLanguage || languageOptions[0].value);
          
          const loadedCustoms = parsedSettings.companionCustomizations || {};
          setCompanionCustomizations(loadedCustoms);

          const loadedCompId = parsedSettings.selectedCompanionId || initialCompanions[0].id;
          setSelectedCompanionId(loadedCompId); 
          
          // Set affectionProgress based on the initially loaded companion and their stored affection
          const affectionForLoadedComp = loadedCustoms[loadedCompId]?.affectionLevel;
          if (affectionForLoadedComp !== undefined) {
            setAffectionProgress(affectionForLoadedComp);
          } else {
            setAffectionProgress(20); // Default if not found for this specific companion
             // If affection was not in customs for this companion, update customs to include it.
             // This will be picked up by the save effect.
            setCompanionCustomizations(prevCustoms => ({
              ...prevCustoms,
              [loadedCompId]: { 
                ...(prevCustoms[loadedCompId] || { selectedTraits: [], customAvatarUrl: undefined }), // preserve other customs
                affectionLevel: 20 
              }
            }));
          }
        } else {
          // No settings stored, initialize with defaults
          // userName, selectedLanguage, selectedCompanionId, affectionProgress already have client-side defaults.
          // Ensure companionCustomizations has an entry for the default companion.
          setCompanionCustomizations({
            [initialCompanions[0].id]: { affectionLevel: 20, selectedTraits: [], customAvatarUrl: undefined }
          });
        }
      } catch (error) {
        console.error("Failed to load chat settings from localStorage:", error);
        setUserName("User");
        setSelectedCompanionId(initialCompanions[0].id);
        setSelectedLanguage(languageOptions[0].value);
        setCompanionCustomizations({ [initialCompanions[0].id]: { affectionLevel: 20, selectedTraits: [], customAvatarUrl: undefined }});
        setAffectionProgress(20);
        toast({ title: "Error", description: "Could not load settings. Using defaults.", variant: "destructive" });
      }
    }
  }, [isClient, toast]);

  // Effect 2: Update affectionProgress and companionCustomizations when selectedCompanionId changes (due to user selection)
  useEffect(() => {
    if (!isClient) return; // Don't run on server or before initial load has completed

    const affectionLevelForSelected = companionCustomizations[selectedCompanionId]?.affectionLevel;

    if (affectionLevelForSelected !== undefined) {
      // Companion has an affection level stored, update the progress bar UI
      if (affectionProgress !== affectionLevelForSelected) {
        setAffectionProgress(affectionLevelForSelected);
      }
    } else {
      // No affection level stored for this newly selected companion. Initialize it.
      const defaultAffection = 20;
      setAffectionProgress(defaultAffection); // Update UI progress bar

      // Update companionCustomizations to include this new companion's default affection.
      // This will subsequently trigger the save effect.
      setCompanionCustomizations(prev => ({
        ...prev,
        [selectedCompanionId]: {
          ...(prev[selectedCompanionId] || { selectedTraits: [], customAvatarUrl: undefined }), // Preserve other potential customizations
          affectionLevel: defaultAffection,
        }
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- We only want this to run on selectedCompanionId change or client mount, companionCustomizations is read but shouldn't trigger loop here.
  }, [selectedCompanionId, isClient]); 

  // Effect 3: Save all settings to localStorage whenever relevant states change
  useEffect(() => {
    if (isClient) {
      // Ensure that companionCustomizations includes the current affectionProgress for the selectedCompanionId before saving
      const finalCustomizations = {
        ...companionCustomizations,
        [selectedCompanionId]: {
          ...(companionCustomizations[selectedCompanionId] || { selectedTraits: [], customAvatarUrl: undefined }),
          affectionLevel: affectionProgress, 
        }
      };

      const settingsToSave: ChatSettings = {
        userName,
        selectedCompanionId,
        selectedLanguage,
        companionCustomizations: finalCustomizations
      };
      try {
        localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settingsToSave));
      } catch (error) {
        console.error("Failed to save chat settings to localStorage:", error);
        toast({
          title: "Error",
          description: "Could not save your settings. Changes might not persist.",
          variant: "destructive",
        });
      }
    }
  }, [userName, selectedCompanionId, selectedLanguage, companionCustomizations, affectionProgress, isClient, toast]);
  
  const handleSaveSettings = () => {
    if (!userName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }
    // The save useEffect already handles persisting data, so this button is more of a "confirm" action for the user.
    // We can force an update to companionCustomizations to ensure the latest traits/avatar are included if not already captured
    // by their respective state setters triggering the save effect.
    setCompanionCustomizations(prev => ({
        ...prev,
        [selectedCompanionId]: {
            ...(prev[selectedCompanionId] || {}),
            selectedTraits: currentSelectedTraits, 
            customAvatarUrl: currentCustomAvatarUrl, 
            affectionLevel: affectionProgress 
        }
    }));

    toast({
      title: "Preferences Updated!",
      description: "Your chat and companion preferences have been updated and saved.",
    });
  };

  const handleTraitToggle = (trait: string) => {
    setCompanionCustomizations(prevCustomizations => {
      const currentCompanionData = prevCustomizations[selectedCompanionId] || { affectionLevel: affectionProgress, selectedTraits: [], customAvatarUrl: undefined };
      const currentTraits = currentCompanionData.selectedTraits || [];
      const newTraits = currentTraits.includes(trait)
        ? currentTraits.filter(t => t !== trait)
        : [...currentTraits, trait];
      return {
        ...prevCustomizations,
        [selectedCompanionId]: {
          ...currentCompanionData,
          selectedTraits: newTraits,
        },
      };
    });
  };

  const simulateAffectionIncrease = () => {
    setAffectionProgress(prev => {
        const newAffection = Math.min(prev + 10, 100);
        // Also update companionCustomizations directly so save effect picks it up
        setCompanionCustomizations(customsPrev => ({
            ...customsPrev,
            [selectedCompanionId]: {
                ...(customsPrev[selectedCompanionId] || { selectedTraits: [], customAvatarUrl: undefined }),
                affectionLevel: newAffection,
            }
        }));
        return newAffection;
    });
    toast({ title: "Affection Increased!", description: `Your bond with ${selectedCompanion.name} is growing!` });
  };

  const selectedCompanion = initialCompanions.find(c => c.id === selectedCompanionId) || initialCompanions[0];
  const currentCustomizationsForSelectedCompanion = companionCustomizations[selectedCompanionId] || {};
  const currentSelectedTraits = currentCustomizationsForSelectedCompanion.selectedTraits || [];
  const currentCustomAvatarUrl = currentCustomizationsForSelectedCompanion.customAvatarUrl;


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
              <Settings2 className="h-16 w-16 text-muted-foreground mb-4 animate-spin" />
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
            Your Preferences
          </CardTitle>
          <CardDescription>
            Set your name, choose your AI companion, and select your preferred chat language. These settings are saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="userName" className="flex items-center gap-1 mb-1"><UserCircle className="h-4 w-4 text-muted-foreground" />Your Name</Label>
              <Input
                id="userName"
                type="text"
                placeholder="E.g., Alex"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                aria-label="Your Name"
              />
              <p className="text-xs text-muted-foreground mt-1">This name will be used by your companion.</p>
            </div>
            <div>
              <Label htmlFor="companionSelect" className="flex items-center gap-1 mb-1"><Heart className="h-4 w-4 text-muted-foreground" />Choose a Companion</Label>
              <Select value={selectedCompanionId} onValueChange={setSelectedCompanionId}>
                <SelectTrigger id="companionSelect" className="w-full" aria-label="Select Companion">
                  <SelectValue placeholder="Select a companion" />
                </SelectTrigger>
                <SelectContent>
                  {initialCompanions.map(comp => {
                    const customAvatarForDropdown = companionCustomizations[comp.id]?.customAvatarUrl;
                    return (
                      <SelectItem key={comp.id} value={comp.id}>
                        <div className="flex items-center gap-2">
                           <Avatar className="h-6 w-6">
                            <AvatarImage src={customAvatarForDropdown || comp.avatarImage} alt={comp.name} data-ai-hint={comp.dataAiHint} />
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
              <Label htmlFor="languageSelect" className="flex items-center gap-1 mb-1"><Languages className="h-4 w-4 text-muted-foreground" />Chat Language</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger id="languageSelect" className="w-full" aria-label="Select Language">
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
            <Palette className="h-6 w-6 text-primary" /> 
            Customize {selectedCompanion.name}'s Appearance
          </CardTitle>
          <CardDescription>
            You can set a custom avatar for {selectedCompanion.name} by generating an image on the "AI Generator" page. More advanced appearance customization tools, including style and voice selection, are coming soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-10 min-h-[200px] border-2 border-dashed border-border rounded-lg bg-muted/20">
            {currentCustomAvatarUrl ? (
               <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg">
                  <AvatarImage src={currentCustomAvatarUrl} alt={`${selectedCompanion.name}'s custom avatar`} data-ai-hint={selectedCompanion.dataAiHint} />
                  <AvatarFallback className="text-3xl">{selectedCompanion.name.charAt(0)}</AvatarFallback>
                </Avatar>
            ) : (
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            )}
            <p className="text-muted-foreground text-center">
              {currentCustomAvatarUrl ? `${selectedCompanion.name}'s custom avatar is shown above.` : `To set a custom avatar, go to the "AI Generator" page, create an image, and use the "Set as Avatar" option.`}
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Future updates will bring more ways to customize appearance and voice here.
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
            <Button onClick={simulateAffectionIncrease} variant="outline" size="sm" className="mx-auto block">
                Simulate Interaction (Increase Affection)
            </Button>
        </CardContent>
      </Card>

       <CardFooter className="flex justify-start pt-6 border-t mt-6">
           <Button onClick={handleSaveSettings}>
              Save All Preferences
          </Button>
       </CardFooter>
    </div>
  );
}
