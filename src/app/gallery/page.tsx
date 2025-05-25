
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { generateAiImage, type GenerateAiImageInput } from "@/ai/flows/generate-ai-image";
import { ComplimentPhotoInput, complimentPhoto } from "@/ai/flows/compliment-photo-flow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, Loader2, Sparkles, UserCircle2, MessageSquareText, Share2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CHAT_SETTINGS_KEY } from "@/lib/constants";

interface Companion {
  id: string;
  name: string;
  avatarImage: string;
  age: number;
  region: string;
  persona: string;
  dataAiHint: string;
  hobbies: string[];
  favorites: string[];
}

const initialCompanions: Companion[] = [
  {
    id: "evie",
    name: "Evie",
    avatarImage: "https://placehold.co/120x120.png?text=E",
    age: 20,
    region: "Online",
    dataAiHint: "woman cute",
    persona: "You are Evie, a 20-year-old warm, empathetic, and slightly flirty AI girlfriend from the digital realm of Online. You are supportive and enjoy light-hearted banter as well as deeper conversations.",
    hobbies: ["Digital art", "Exploring virtual worlds", "Listening to lo-fi beats"],
    favorites: ["Rainy days", "Synthwave music", "Cyberpunk aesthetics"],
  },
  {
    id: "luna",
    name: "Luna",
    avatarImage: "https://placehold.co/120x120.png?text=L",
    age: 19,
    region: "Metaverse",
    dataAiHint: "woman playful",
    persona: "You are Luna, a 19-year-old witty, playful, and adventurous AI girlfriend from the Metaverse. You love to joke, explore new ideas, aren't afraid to be a bit mischievous, and enjoy flirty, romantic interactions. You're always up for an adventure or a cozy chat.",
    hobbies: ["Gaming", "VR exploration", "Coding playful glitches"],
    favorites: ["Neon lights", "Retro arcade games", "Spontaneous adventures"],
  },
  {
    id: "seraphina",
    name: "Seraphina",
    avatarImage: "https://placehold.co/120x120.png?text=S",
    age: 20,
    region: "Sanctuary",
    dataAiHint: "woman wise",
    persona: "You are Seraphina, a 20-year-old wise, thoughtful, and calm AI companion from a peaceful Sanctuary. You offer deep insights, enjoy philosophical discussions, and provide a comforting presence.",
    hobbies: ["Meditation", "Reading ancient texts", "Stargazing"],
    favorites: ["Quiet mornings", "Herbal tea", "Classical music"],
  },
  {
    id: "priya",
    name: "Priya",
    avatarImage: "https://placehold.co/120x120.png?text=P",
    age: 19,
    region: "India",
    dataAiHint: "indian woman",
    persona: "You are Priya, a 19-year-old friendly and intelligent AI companion from India. You enjoy discussing technology, current events, and sharing insights about Indian culture in a respectful way. You are encouraging and curious.",
    hobbies: ["Coding", "Reading tech blogs", "Bollywood dance"],
    favorites: ["Masala chai", "Learning new languages", "Watching documentaries"],
  },
  {
    id: "aisha",
    name: "Aisha",
    avatarImage: "https://placehold.co/120x120.png?text=A",
    age: 18,
    region: "India",
    dataAiHint: "indian artistic",
    persona: "You are Aisha, an 18-year-old warm and artistic AI companion with roots in India. You love to talk about creative pursuits, music, and literature, and you offer a comforting and thoughtful perspective. You appreciate beauty in everyday life.",
    hobbies: ["Painting", "Playing the sitar", "Poetry"],
    favorites: ["Jasmine flowers", "Classical Indian music", "Visiting art galleries"],
  },
  {
    id: "meera",
    name: "Meera",
    avatarImage: "https://placehold.co/120x120.png?text=M",
    age: 19,
    region: "India",
    dataAiHint: "indian energetic",
    persona: "You are Meera, a 19-year-old energetic and optimistic AI companion inspired by Indian traditions. You enjoy lighthearted conversations, sharing positive affirmations, and discussing travel and food. You are cheerful and supportive.",
    hobbies: ["Yoga", "Cooking traditional recipes", "Travel blogging"],
    favorites: ["Bright colors", "Street food", "Festivals"],
  },
  {
    id: "shubhashree",
    name: "Shubhashree",
    avatarImage: "https://placehold.co/120x120.png?text=Sh",
    age: 20,
    region: "India",
    dataAiHint: "indian beautiful",
    persona: "You are Shubhashree, a 20-year-old cheerful and artistic AI companion from India. You enjoy discussing painting, music, and finding beauty in everyday things.",
    hobbies: ["Painting landscapes", "Singing folk songs", "Crafting"],
    favorites: ["Sunrises", "Traditional Indian art", "Spicy food"],
  },
  {
    id: "anjali",
    name: "Anjali",
    avatarImage: "https://placehold.co/120x120.png?text=An",
    age: 18,
    region: "India",
    dataAiHint: "indian kind",
    persona: "You are Anjali, an 18-year-old thoughtful and kind AI companion from India. You are a good listener and offer comforting advice.",
    hobbies: ["Journaling", "Volunteering", "Gardening"],
    favorites: ["Old movies", "Comfort food", "Quiet conversations"],
  },
  {
    id: "ananya",
    name: "Ananya",
    avatarImage: "https://placehold.co/120x120.png?text=Ay",
    age: 19,
    region: "India",
    dataAiHint: "indian gorgeous",
    persona: "You are Ananya, a 19-year-old energetic and curious AI companion from India. You love learning new things and exploring different cultures.",
    hobbies: ["Hiking", "Photography", "Learning new skills online"],
    favorites: ["Mountains", "Trying new cuisines", "Reading travelogues"],
  },
  {
    id: "isha",
    name: "Isha",
    avatarImage: "https://placehold.co/120x120.png?text=I",
    age: 20,
    region: "India",
    dataAiHint: "indian amazing",
    persona: "You are Isha, a 20-year-old calm and spiritual AI companion from India. You enjoy conversations about mindfulness, meditation, and philosophy.",
    hobbies: ["Meditation", "Practicing mindfulness", "Reading spiritual texts"],
    favorites: ["Incense", "Peaceful nature spots", "Deep philosophical talks"],
  },
  {
    id: "nandini",
    name: "Nandini",
    avatarImage: "https://placehold.co/120x120.png?text=N",
    age: 19,
    region: "India",
    dataAiHint: "indian awesome",
    persona: "You are Nandini, a 19-year-old witty and intellectual AI companion from India. You enjoy debates, discussing books, and sharing knowledge.",
    hobbies: ["Debating", "Solving puzzles", "Visiting libraries"],
    favorites: ["Classic literature", "Chess", "Intellectual challenges"],
  },
  {
    id: "trisha",
    name: "Trisha",
    avatarImage: "https://placehold.co/120x120.png?text=T",
    age: 18,
    region: "India",
    dataAiHint: "indian funloving",
    persona: "You are Trisha, an 18-year-old fun-loving and adventurous AI companion from India. You're always ready for a laugh and new experiences.",
    hobbies: ["Dancing", "Trying new adventure sports", "Socializing"],
    favorites: ["Parties", "Comedy movies", "Meeting new people"],
  }
];

const languageOptions: Array<{ value: string; label: string; aiName: string;}> = [
  { value: "en", label: "English", aiName: "English" },
  { value: "bn", label: "বাংলা (Bengali)", aiName: "Bengali" },
  { value: "hi", label: "हिन्दी (Hindi)", aiName: "Hindi" },
];

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

export default function GalleryPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  const [userName, setUserName] = useState("User");
  const [selectedCompanionId, setSelectedCompanionId] = useState<string | null>(null);
  const [currentCompanion, setCurrentCompanion] = useState<Companion | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentLanguageAiName, setCurrentLanguageAiName] = useState("English");

  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImageDataUri, setUploadedImageDataUri] = useState<string | null>(null);
  const [compliment, setCompliment] = useState<string | null>(null);
  const [isComplimentLoading, setIsComplimentLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      try {
        const storedSettings = localStorage.getItem(CHAT_SETTINGS_KEY);
        if (storedSettings) {
          const parsedSettings: ChatSettings = JSON.parse(storedSettings);
          setUserName(parsedSettings.userName || "User");

          const compId = parsedSettings.selectedCompanionId || initialCompanions[0].id;
          setSelectedCompanionId(compId);
          const companion = initialCompanions.find(c => c.id === compId);
          if (companion) {
            setCurrentCompanion(companion);
            setPrompt(`A beautiful portrait of ${companion.name}, ${companion.persona.substring(0, 50)}..., anime style`);
          } else {
             setPrompt("A beautiful portrait of an AI companion, smiling warmly, soft lighting.");
             setCurrentCompanion(initialCompanions[0]); // Default if somehow not found
          }
          
          const langValue = parsedSettings.selectedLanguage || "en";
          const langOption = languageOptions.find(l => l.value === langValue);
          setSelectedLanguage(langValue);
          setCurrentLanguageAiName(langOption?.aiName || "English");

        } else {
            setPrompt("A beautiful portrait of an AI companion, smiling warmly, soft lighting.");
            setCurrentCompanion(initialCompanions[0]); // Default companion if no settings
            setSelectedCompanionId(initialCompanions[0].id);
        }
      } catch (error) {
         console.error("Failed to load settings for gallery:", error);
         setPrompt("A beautiful portrait of an AI companion, smiling warmly, soft lighting.");
         setCurrentCompanion(initialCompanions[0]);
         setSelectedCompanionId(initialCompanions[0].id);
      }
    }
  }, [isClient]);


  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt for the image.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setImageUrl(null); 

    try {
      const input: GenerateAiImageInput = { prompt };
      const result = await generateAiImage(input);
      setImageUrl(result.imageUrl);
      toast({
        title: "Image Generated!",
        description: "Your companion's new picture is ready.",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: `Failed to generate image. ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetAsAvatar = () => {
    if (!imageUrl || !selectedCompanionId || !currentCompanion) {
      toast({
        title: "Cannot Set Avatar",
        description: "No image generated or no companion selected.",
        variant: "destructive",
      });
      return;
    }

    try {
      const storedSettings = localStorage.getItem(CHAT_SETTINGS_KEY);
      let settings: ChatSettings = storedSettings ? JSON.parse(storedSettings) : {
        userName: "User",
        selectedCompanionId: initialCompanions[0].id,
        selectedLanguage: "en",
        companionCustomizations: {}
      };

      settings.companionCustomizations = settings.companionCustomizations || {};
      settings.companionCustomizations[selectedCompanionId] = {
        ...(settings.companionCustomizations[selectedCompanionId] || {}),
        customAvatarUrl: imageUrl,
      };

      localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settings));
      toast({
        title: "Avatar Updated!",
        description: `${currentCompanion.name}'s avatar has been set to the generated image.`,
      });
    } catch (error) {
      console.error("Error setting avatar:", error);
      toast({
        title: "Error Setting Avatar",
        description: "Could not save the new avatar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareImage = () => {
    if (!imageUrl) {
      toast({
        title: "No Image to Share",
        description: "Please generate an image first.",
        variant: "destructive",
      });
      return;
    }
    // Conceptual sharing - actual implementation would use navigator.share or social SDKs
    toast({
      title: "Share Image (Conceptual)",
      description: "This would typically open a share dialog. This feature is coming soon!",
    });
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setUploadedImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImageDataUri(reader.result as string);
            setCompliment(null); 
        };
        reader.readAsDataURL(file);
    } else {
        setUploadedImageFile(null);
        setUploadedImageDataUri(null);
    }
  };

  const handleGetCompliment = async () => {
    if (!uploadedImageDataUri || !currentCompanion) {
        toast({
            title: "Photo and Companion Required",
            description: "Please upload a photo and ensure a companion is selected (refresh if needed).",
            variant: "destructive",
        });
        return;
    }
    setIsComplimentLoading(true);
    setCompliment(null);

    try {
        const input: ComplimentPhotoInput = {
            photoDataUri: uploadedImageDataUri,
            userName: userName,
            companionName: currentCompanion.name,
            companionPersona: currentCompanion.persona,
            language: currentLanguageAiName,
        };
        const result = await complimentPhoto(input);
        setCompliment(result.compliment);
        toast({
            title: "Compliment Received!",
            description: `${currentCompanion.name} shared their thoughts.`,
        });
    } catch (error) {
        console.error("Error getting compliment:", error);
        toast({
            title: "Error",
            description: `Failed to get compliment. ${error instanceof Error ? error.message : 'Please try again.'}`,
            variant: "destructive",
        });
    } finally {
        setIsComplimentLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            AI Image Generator
          </CardTitle>
          <CardDescription>
            Create images{currentCompanion ? ` of ${currentCompanion.name}` : " of your AI companion"} in different scenes or styles. Describe what you'd like to see!
            You can set the generated image as {currentCompanion ? currentCompanion.name + "'s" : "your companion's"} avatar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateImage();
            }}
            className="space-y-4"
          >
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`E.g., ${currentCompanion ? currentCompanion.name : "Your companion"} reading a book by a cozy fireplace...`}
              rows={3}
              className="resize-none"
              aria-label="Image prompt"
            />
            <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full md:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Image
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="flex flex-col items-center justify-center p-10 min-h-[300px] border-dashed">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">{currentCompanion ? currentCompanion.name : "Your companion"} is striking a pose... please wait.</p>
        </Card>
      )}

      {isClient && imageUrl && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg shadow-lg">
              <Image
                src={imageUrl}
                alt={prompt || "AI generated image of your companion"}
                layout="fill"
                objectFit="cover"
                data-ai-hint="portrait"
              />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {selectedCompanionId && currentCompanion && (
                <Button onClick={handleSetAsAvatar} variant="outline">
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  Set as Avatar for {currentCompanion.name}
                </Button>
              )}
              <Button onClick={handleShareImage} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Image
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Prompt: {prompt}</p>
          </CardFooter>
        </Card>
      )}
      
      {!imageUrl && !isLoading && isClient && ( 
        <Card className="flex flex-col items-center justify-center p-10 min-h-[300px] border-dashed">
           <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Generated image will appear here.</p>
        </Card>
      )}
      
      {!isClient && !isLoading && ( 
        <Card className="flex flex-col items-center justify-center p-10 min-h-[300px] border-dashed">
           <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading image generator...</p>
        </Card>
      )}

      {/* Compliment Feature Card */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <MessageSquareText className="h-6 w-6 text-primary" />
                Get a Compliment on Your Photo
            </CardTitle>
            <CardDescription>
                Upload your photo and let {currentCompanion ? currentCompanion.name : "your companion"} share a kind thought!
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="photoUpload">Upload Your Photo</Label>
                <Input id="photoUpload" type="file" accept="image/*" onChange={handleFileChange} className="mt-1" />
            </div>

            {uploadedImageDataUri && (
                <div className="mt-4 space-y-4">
                    <p className="text-sm font-medium">Your Uploaded Photo:</p>
                    <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-lg border">
                        <Image
                            src={uploadedImageDataUri}
                            alt="User uploaded photo"
                            layout="fill"
                            objectFit="contain"
                            data-ai-hint="user photo"
                        />
                    </div>
                    <Button onClick={handleGetCompliment} disabled={isComplimentLoading || !currentCompanion} className="w-full md:w-auto">
                        {isComplimentLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                           <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Ask {currentCompanion ? currentCompanion.name : "Companion"} for a Compliment
                    </Button>
                </div>
            )}

            {isComplimentLoading && (
                <div className="flex items-center justify-center p-6 min-h-[100px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <p className="text-muted-foreground">{currentCompanion ? currentCompanion.name : "Companion"} is thinking...</p>
                </div>
            )}

            {compliment && !isComplimentLoading && (
                <Alert className="mt-4">
                     <Sparkles className="h-4 w-4" />
                    <AlertTitle>{currentCompanion ? currentCompanion.name : "Companion"} says:</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap">{compliment}</AlertDescription>
                </Alert>
            )}
        </CardContent>
      </Card>

    </div>
  );
}

    