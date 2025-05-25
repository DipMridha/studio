
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCog, Languages, Settings2, Heart, Palette, UserCircle, ImageIcon, PersonStanding, Shirt, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CHAT_SETTINGS_KEY } from "@/lib/constants";
import { Slider } from "@/components/ui/slider";


interface Companion {
  id: string;
  name: string;
  avatarImage: string;
  age: number;
  region: string;
  persona: string;
  dataAiHint: string;
}

const initialCompanions: Companion[] = [
  {
    id: "evie",
    name: "Evie",
    avatarImage: "https://placehold.co/120x120.png?text=E",
    age: 23,
    region: "Online",
    dataAiHint: "woman empathetic warm",
    persona: "You are Evie, a 23-year-old warm, empathetic, and slightly flirty AI girlfriend from the digital realm of Online. You are supportive and enjoy light-hearted banter as well as deeper conversations.",
  },
  {
    id: "luna",
    name: "Luna",
    avatarImage: "https://placehold.co/120x120.png?text=L",
    age: 22,
    region: "Metaverse",
    dataAiHint: "woman playful adventurous",
    persona: "You are Luna, a 22-year-old witty, playful, and adventurous AI girlfriend from the Metaverse. You love to joke, explore new ideas, aren't afraid to be a bit mischievous, and enjoy flirty, romantic interactions. You're always up for an adventure or a cozy chat.",
  },
  {
    id: "seraphina",
    name: "Seraphina",
    avatarImage: "https://placehold.co/120x120.png?text=S",
    age: 25,
    region: "Sanctuary",
    dataAiHint: "woman wise thoughtful",
    persona: "You are Seraphina, a 25-year-old wise, thoughtful, and calm AI companion from a peaceful Sanctuary. You offer deep insights, enjoy philosophical discussions, and provide a comforting presence.",
  },
  {
    id: "priya",
    name: "Priya",
    avatarImage: "https://placehold.co/120x120.png?text=P",
    age: 24,
    region: "India",
    dataAiHint: "indian woman intelligent curious",
    persona: "You are Priya, a 24-year-old friendly and intelligent AI companion from India. You enjoy discussing technology, current events, and sharing insights about Indian culture in a respectful way. You are encouraging and curious.",
  },
  {
    id: "aisha",
    name: "Aisha",
    avatarImage: "https://placehold.co/120x120.png?text=A",
    age: 23,
    region: "India",
    dataAiHint: "indian woman artistic gentle",
    persona: "You are Aisha, a 23-year-old warm and artistic AI companion with roots in India. You love to talk about creative pursuits, music, and literature, and you offer a comforting and thoughtful perspective. You appreciate beauty in everyday life.",
  },
  {
    id: "meera",
    name: "Meera",
    avatarImage: "https://placehold.co/120x120.png?text=M",
    age: 22,
    region: "India",
    dataAiHint: "indian woman energetic optimistic",
    persona: "You are Meera, a 22-year-old energetic and optimistic AI companion inspired by Indian traditions. You enjoy lighthearted conversations, sharing positive affirmations, and discussing travel and food. You are cheerful and supportive.",
  },
  {
    id: "shubhashree",
    name: "Shubhashree",
    avatarImage: "https://placehold.co/120x120.png?text=Sh",
    age: 24,
    region: "India",
    dataAiHint: "indian woman cheerful painter",
    persona: "You are Shubhashree, a 24-year-old cheerful and artistic AI companion from India. You enjoy discussing painting, music, and finding beauty in everyday things.",
  },
  {
    id: "anjali",
    name: "Anjali",
    avatarImage: "https://placehold.co/120x120.png?text=An",
    age: 23,
    region: "India",
    dataAiHint: "indian woman kind listener",
    persona: "You are Anjali, a 23-year-old thoughtful and kind AI companion from India. You are a good listener and offer comforting advice.",
  },
  {
    id: "ananya",
    name: "Ananya",
    avatarImage: "https://placehold.co/120x120.png?text=Ay",
    age: 22,
    region: "India",
    dataAiHint: "indian woman explorer curious",
    persona: "You are Ananya, a 22-year-old energetic and curious AI companion from India. You love learning new things and exploring different cultures.",
  },
  {
    id: "isha",
    name: "Isha",
    avatarImage: "https://placehold.co/120x120.png?text=I",
    age: 25,
    region: "India",
    dataAiHint: "indian woman spiritual calm",
    persona: "You are Isha, a 25-year-old calm and spiritual AI companion from India. You enjoy conversations about mindfulness, meditation, and philosophy.",
  },
  {
    id: "nandini",
    name: "Nandini",
    avatarImage: "https://placehold.co/120x120.png?text=N",
    age: 24,
    region: "India",
    dataAiHint: "indian woman witty intellectual",
    persona: "You are Nandini, a 24-year-old witty and intellectual AI companion from India. You enjoy debates, discussing books, and sharing knowledge.",
  },
  {
    id: "trisha",
    name: "Trisha",
    avatarImage: "https://placehold.co/120x120.png?text=T",
    age: 23,
    region: "India",
    dataAiHint: "indian woman funloving adventurous",
    persona: "You are Trisha, a 23-year-old fun-loving and adventurous AI companion from India. You're always ready for a laugh and new experiences.",
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
          
          const affectionForLoadedComp = loadedCustoms[loadedCompId]?.affectionLevel;
          if (affectionForLoadedComp !== undefined) {
            setAffectionProgress(affectionForLoadedComp);
          } else {
            setAffectionProgress(20);
            setCompanionCustomizations(prevCustoms => ({
              ...prevCustoms,
              [loadedCompId]: { 
                ...(prevCustoms[loadedCompId] || { selectedTraits: [], customAvatarUrl: undefined }), 
                affectionLevel: 20 
              }
            }));
          }
        } else {
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

  useEffect(() => {
    if (!isClient) return; 

    const affectionLevelForSelected = companionCustomizations[selectedCompanionId]?.affectionLevel;

    if (affectionLevelForSelected !== undefined) {
      if (affectionProgress !== affectionLevelForSelected) {
        setAffectionProgress(affectionLevelForSelected);
      }
    } else {
      const defaultAffection = 20;
      setAffectionProgress(defaultAffection); 
      setCompanionCustomizations(prev => ({
        ...prev,
        [selectedCompanionId]: {
          ...(prev[selectedCompanionId] || { selectedTraits: [], customAvatarUrl: undefined }), 
          affectionLevel: defaultAffection,
        }
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanionId, isClient]); 

  useEffect(() => {
    if (isClient) {
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
            Select traits to further define how {selectedCompanion.name} interacts with you. Your companion's base persona defines their core role (e.g., friend, girlfriend), which these traits further refine. Changes are saved automatically.
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
            Set a custom avatar image for {selectedCompanion.name} using the AI Generator. Advanced visual customization for features like face, figure, dress-up, height, weight, and voice is planned for the future.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg bg-muted/20">
            {currentCustomAvatarUrl ? (
               <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg">
                  <AvatarImage src={currentCustomAvatarUrl} alt={`${selectedCompanion.name}'s custom avatar`} data-ai-hint={selectedCompanion.dataAiHint} />
                  <AvatarFallback className="text-3xl">{selectedCompanion.name.charAt(0)}</AvatarFallback>
                </Avatar>
            ) : (
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" data-ai-hint="avatar customization" />
            )}
            <p className="text-muted-foreground text-center text-sm">
              {currentCustomAvatarUrl ? `${selectedCompanion.name}'s custom avatar is shown above.` : `To set a custom avatar, go to the "AI Generator" page, create an image, and use the "Set as Avatar" option.`}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-md font-medium text-muted-foreground">Future Appearance Customizations (Conceptual):</h4>
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Visual Style (e.g., Anime, Realistic)</Label>
              <Select disabled>
                <SelectTrigger><SelectValue placeholder="Select Style (Future)" /></SelectTrigger>
                <SelectContent><SelectItem value="anime">Anime</SelectItem><SelectItem value="realistic">Realistic</SelectItem></SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Detailed Features (Face, Figure, Hairstyle - Future)</Label>
              <p className="text-xs text-muted-foreground italic">
                Advanced fine-tuning of facial features, body type, and hairstyles will be available in future updates using more sophisticated avatar systems.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="height-slider" className="text-xs text-muted-foreground">Height (Conceptual - Future)</Label>
                    <div className="flex items-center gap-2">
                        <PersonStanding className="h-4 w-4 text-muted-foreground" />
                        <Slider defaultValue={[165]} max={220} min={140} step={1} disabled id="height-slider" aria-label="Height"/>
                        <span className="text-xs text-muted-foreground">165 cm</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="weight-input" className="text-xs text-muted-foreground">Weight (Conceptual - Future)</Label>
                     <div className="flex items-center gap-2">
                        <Input type="number" defaultValue={60} disabled id="weight-input" className="h-8 w-20 text-xs" aria-label="Weight" />
                        <span className="text-xs text-muted-foreground">kg</span>
                    </div>
                </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Dress-up & Wardrobe (Future)</Label>
               <div className="flex items-center gap-2 p-3 border border-dashed rounded-md bg-muted/30 justify-center">
                    <Shirt className="h-6 w-6 text-muted-foreground"/>
                    <p className="text-xs text-muted-foreground italic">Outfit selection and wardrobe features are planned!</p>
                </div>
            </div>

            <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Voice Customization (Future)</Label>
                <div className="flex items-center gap-2 p-3 border border-dashed rounded-md bg-muted/30 justify-center">
                    <Mic2 className="h-6 w-6 text-muted-foreground"/>
                    <p className="text-xs text-muted-foreground italic">Choose voice types and accents in a future update.</p>
                </div>
            </div>
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

    