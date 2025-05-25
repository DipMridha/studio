
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCog, Languages, Settings2, Heart, Palette, UserCircle, ImageIcon, PersonStanding, Shirt, Mic2, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CHAT_SETTINGS_KEY } from "@/lib/constants";
import { Slider } from "@/components/ui/slider";
import { CompanionProfileModal } from "@/components/companion-profile-modal";
import { 
  initialCompanions, 
  languageOptions, 
  type Companion, 
  type LanguageOption, 
  type ChatSettings, 
  type CompanionCustomizations 
} from "@/lib/companions-data";


const personalityTraitsOptions = ['Shy', 'Bold', 'Funny', 'Caring', 'Gamer', 'Intellectual', 'Artistic', 'Adventurous', 'Mysterious', 'Optimistic', 'Sarcastic', 'Flirty'];

export default function CompanionPage() {
  const [userName, setUserName] = useState("User");
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(initialCompanions[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languageOptions[0].value);
  const [companionCustomizations, setCompanionCustomizations] = useState<{ [companionId: string]: CompanionCustomizations }>({});
  
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [viewingProfile, setViewingProfile] = useState<Companion | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect for loading settings from localStorage
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
        } else {
          // Initialize default customizations if no settings are found
           const defaultCustoms: {[key: string]: CompanionCustomizations} = {};
           initialCompanions.forEach(comp => {
             defaultCustoms[comp.id] = { affectionLevel: 20, selectedTraits: [], customAvatarUrl: undefined };
           });
           setCompanionCustomizations(defaultCustoms);
        }
      } catch (error) {
        console.error("Failed to load chat settings from localStorage:", error);
        // Fallback to default values and initialize customizations
        setUserName("User");
        setSelectedCompanionId(initialCompanions[0].id);
        setSelectedLanguage(languageOptions[0].value);
        const defaultCustoms: {[key: string]: CompanionCustomizations} = {};
        initialCompanions.forEach(comp => {
           defaultCustoms[comp.id] = { affectionLevel: 20, selectedTraits: [], customAvatarUrl: undefined };
        });
        setCompanionCustomizations(defaultCustoms);
        toast({ title: "Error", description: "Could not load settings. Using defaults.", variant: "destructive" });
      }
    }
  }, [isClient, toast]);

  // Effect for saving settings to localStorage whenever a relevant state changes
  useEffect(() => {
    if (isClient && selectedCompanionId) { // Ensure settings are saved only after client-side load and if a companion is selected
      const settingsToSave: ChatSettings = {
        userName,
        selectedCompanionId,
        selectedLanguage,
        companionCustomizations
      };
      try {
        localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settingsToSave));
      } catch (error: any) {
        console.error("Failed to save chat settings to localStorage:", error);
        let errorDescription = "Could not save your settings. Changes might not persist.";
        if (error.name === 'QuotaExceededError' || (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22))) {
          errorDescription = "Browser storage is full. Your settings could not be saved. Please clear some site data.";
        }
        toast({
          title: "Error Saving Settings",
          description: errorDescription,
          variant: "destructive",
          duration: 7000,
        });
      }
    }
  }, [userName, selectedCompanionId, selectedLanguage, companionCustomizations, isClient, toast]);
  
  const handleCompanionCardClick = (companion: Companion) => {
    setSelectedCompanionId(companion.id);
    setViewingProfile(companion);
    setIsProfileModalOpen(true);
  };

  const handleTraitToggle = (trait: string) => {
    setCompanionCustomizations(prevCustomizations => {
      const currentCompanionData = prevCustomizations[selectedCompanionId] || { affectionLevel: 20, selectedTraits: [], customAvatarUrl: undefined };
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
    // Settings will be auto-saved by the useEffect hook
  };

  const simulateAffectionIncrease = () => {
    if (!selectedCompanion) return;
    setCompanionCustomizations(prevCustoms => {
        const currentCompData = prevCustoms[selectedCompanion.id] || { affectionLevel: 20, selectedTraits: [], customAvatarUrl: undefined };
        const newAffection = Math.min((currentCompData.affectionLevel || 0) + 10, 100);
        return {
            ...prevCustoms,
            [selectedCompanion.id]: {
                ...currentCompData,
                affectionLevel: newAffection,
            }
        };
    });
    toast({ title: "Affection Increased!", description: `Your bond with ${selectedCompanion.name} is growing!` });
     // Settings will be auto-saved by the useEffect hook
  };

  const selectedCompanion = initialCompanions.find(c => c.id === selectedCompanionId) || initialCompanions[0];
  const currentCustomsForSelected = companionCustomizations[selectedCompanionId] || { affectionLevel: 20, selectedTraits: [], customAvatarUrl: undefined };
  const currentSelectedTraits = currentCustomsForSelected.selectedTraits || [];
  const currentCustomAvatarUrl = currentCustomsForSelected.customAvatarUrl;
  const currentAffectionLevel = currentCustomsForSelected.affectionLevel || 20;


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
      {viewingProfile && (
        <CompanionProfileModal
          companion={viewingProfile}
          isOpen={isProfileModalOpen}
          onOpenChange={setIsProfileModalOpen}
          customAvatarUrl={companionCustomizations[viewingProfile.id]?.customAvatarUrl}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            Your Preferences
          </CardTitle>
          <CardDescription>
            Set your name and preferred chat language. These settings are saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="userName" className="flex items-center gap-1 mb-1"><UserCircle className="h-4 w-4 text-muted-foreground" />Your Name</Label>
              <Input
                id="userName"
                type="text"
                placeholder="E.g., Alex"
                value={userName}
                onChange={(e) => {
                  if (!e.target.value.trim()) {
                    toast({ title: "Name Required", description: "Please enter your name.", variant: "destructive" });
                  }
                  setUserName(e.target.value);
                }}
                aria-label="Your Name"
              />
              <p className="text-xs text-muted-foreground mt-1">This name will be used by your companion.</p>
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
                <Heart className="h-6 w-6 text-primary" />
                Choose Your Companion
             </CardTitle>
            <CardDescription>
                Select an AI companion. Click on a companion to view their profile and make them your active chat partner. Changes are saved automatically.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {initialCompanions.map(comp => {
                    const customAvatar = companionCustomizations[comp.id]?.customAvatarUrl;
                    const isActive = comp.id === selectedCompanionId;
                    return (
                        <Card 
                            key={comp.id} 
                            className={`p-3 text-center cursor-pointer hover:shadow-lg transition-shadow ${isActive ? 'ring-2 ring-primary border-primary shadow-lg' : 'border-border'}`}
                            onClick={() => handleCompanionCardClick(comp)}
                        >
                            <Avatar className="h-20 w-20 mx-auto mb-2 ring-1 ring-primary/30">
                                <AvatarImage src={customAvatar || comp.avatarImage} alt={comp.name} data-ai-hint={comp.dataAiHint} />
                                <AvatarFallback className="text-2xl">{comp.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-medium text-sm truncate">{comp.name}</p>
                            <Button variant="ghost" size="sm" className="mt-1 text-xs h-auto p-1 text-primary hover:bg-primary/10">
                                <View className="mr-1 h-3 w-3"/> View Profile
                            </Button>
                        </Card>
                    );
                })}
            </div>
        </CardContent>
      </Card>


      {selectedCompanion && (
        <>
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
                                id={`trait-${selectedCompanionId}-${trait}`} 
                                checked={currentSelectedTraits.includes(trait)}
                                onCheckedChange={() => handleTraitToggle(trait)}
                            />
                            <Label htmlFor={`trait-${selectedCompanionId}-${trait}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                Set a custom avatar image for {selectedCompanion.name} using the AI Generator. Advanced visual customization for features like face, figure, dress-up, height, weight, and voice is planned for the future. Changes are saved automatically.
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
                    Your bond with {selectedCompanion.name} grows with positive interactions. Higher affection levels may unlock special dialogues or features in the future! Settings are saved automatically.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Progress value={currentAffectionLevel} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                    Current Affection: {currentAffectionLevel}%
                </p>
                <p className="text-xs text-muted-foreground text-center">
                    This feature is currently illustrative. Dynamic updates and unlocks are coming soon.
                </p>
                <Button onClick={simulateAffectionIncrease} variant="outline" size="sm" className="mx-auto block">
                    Simulate Interaction (Increase Affection)
                </Button>
            </CardContent>
          </Card>
        </>
      )}
      <CardFooter className="pt-6 border-t">
        <p className="text-xs text-muted-foreground">
          All preferences on this page are saved automatically to your browser.
        </p>
      </CardFooter>
    </div>
  );
}
