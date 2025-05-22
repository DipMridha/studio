
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { generateAiImage, type GenerateAiImageInput } from "@/ai/flows/generate-ai-image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, Loader2, Sparkles, UserCircle2 } from "lucide-react";

const CHAT_SETTINGS_KEY = "chatAiChatSettings";

interface Companion {
  id: string;
  name: string;
  avatarImage: string;
  persona: string;
  dataAiHint: string;
}

// Minimal companion data needed for gallery context
const initialCompanions: Pick<Companion, 'id' | 'name' | 'persona'>[] = [
  { id: "evie", name: "Evie", persona: "a warm, empathetic AI" },
  { id: "luna", name: "Luna", persona: "a witty, playful AI" },
  { id: "seraphina", name: "Seraphina", persona: "a wise, thoughtful AI" },
  { id: "priya", name: "Priya", persona: "a friendly, intelligent AI from India" },
  { id: "aisha", name: "Aisha", persona: "a warm, artistic AI from India" },
  { id: "meera", name: "Meera", persona: "an energetic, optimistic AI from India" },
];

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

export default function GalleryPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [selectedCompanionId, setSelectedCompanionId] = useState<string | null>(null);
  const [currentCompanion, setCurrentCompanion] = useState<Pick<Companion, 'id' | 'name' | 'persona'> | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      try {
        const storedSettings = localStorage.getItem(CHAT_SETTINGS_KEY);
        if (storedSettings) {
          const parsedSettings: ChatSettings = JSON.parse(storedSettings);
          if (parsedSettings.selectedCompanionId) {
            setSelectedCompanionId(parsedSettings.selectedCompanionId);
            const companion = initialCompanions.find(c => c.id === parsedSettings.selectedCompanionId);
            if (companion) {
              setCurrentCompanion(companion);
              setPrompt(`A beautiful portrait of ${companion.name}, ${companion.persona.substring(0, 50)}..., anime style`);
            } else {
               setPrompt("A beautiful portrait of an AI companion, smiling warmly, soft lighting.");
            }
          } else {
             setPrompt("A beautiful portrait of an AI companion, smiling warmly, soft lighting.");
          }
        } else {
            setPrompt("A beautiful portrait of an AI companion, smiling warmly, soft lighting.");
        }
      } catch (error) {
         console.error("Failed to load settings for gallery:", error);
         setPrompt("A beautiful portrait of an AI companion, smiling warmly, soft lighting.");
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
            {selectedCompanionId && currentCompanion && (
              <Button onClick={handleSetAsAvatar} variant="outline" className="mt-2">
                <UserCircle2 className="mr-2 h-4 w-4" />
                Set as Avatar for {currentCompanion.name}
              </Button>
            )}
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
      
      {!isClient && !isLoading && ( // Placeholder for SSR/initial load before client takes over
        <Card className="flex flex-col items-center justify-center p-10 min-h-[300px] border-dashed">
           <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading image generator...</p>
        </Card>
      )}
    </div>
  );
}
