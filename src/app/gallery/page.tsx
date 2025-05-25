
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
import { 
  initialCompanions, 
  languageOptions, 
  type Companion, 
  type LanguageOption, 
  type ChatSettings 
} from "@/lib/companions-data";

export default function GalleryPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  const [userName, setUserName] = useState("User");
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(initialCompanions[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImageDataUri, setUploadedImageDataUri] = useState<string | null>(null);
  const [compliment, setCompliment] = useState<string | null>(null);
  const [isComplimentLoading, setIsComplimentLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentCompanion = initialCompanions.find(c => c.id === selectedCompanionId) || initialCompanions[0];
  const currentLanguageAiName = languageOptions.find(l => l.value === selectedLanguage)?.aiName || "English";

  useEffect(() => {
    if (isClient) {
      try {
        const storedSettings = localStorage.getItem(CHAT_SETTINGS_KEY);
        if (storedSettings) {
          const parsedSettings: ChatSettings = JSON.parse(storedSettings);
          setUserName(parsedSettings.userName || "User");
          setSelectedCompanionId(parsedSettings.selectedCompanionId || initialCompanions[0].id);
          setSelectedLanguage(parsedSettings.selectedLanguage || languageOptions[0].value);
        } else {
          // Set defaults for prompt if no settings found
           setPrompt(`A beautiful portrait of ${initialCompanions[0].name}, ${initialCompanions[0].persona.substring(0, 50)}..., anime style`);
        }
      } catch (error) {
         console.error("Failed to load settings for gallery:", error);
         setPrompt(`A beautiful portrait of ${initialCompanions[0].name}, ${initialCompanions[0].persona.substring(0, 50)}..., anime style`);
      }
    }
  }, [isClient]);

  useEffect(() => {
    // Update default prompt when selected companion changes
    if (currentCompanion) {
      setPrompt(`A beautiful portrait of ${currentCompanion.name}, ${currentCompanion.persona.substring(0, 50)}..., anime style`);
    }
  }, [currentCompanion]);


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
        ...(settings.companionCustomizations[selectedCompanionId] || { affectionLevel: 20, selectedTraits: [] }), // Ensure affectionLevel and traits are preserved
        customAvatarUrl: imageUrl,
      };

      localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settings));
      toast({
        title: "Avatar Updated!",
        description: `${currentCompanion.name}'s avatar has been set to the generated image. You may need to refresh other pages like "Companion" or "Chat" to see the change immediately if they are already open.`,
        duration: 7000
      });
    } catch (error: any) {
      console.error("Error setting avatar:", error);
      let errorDescription = "Could not save the new avatar. Please try again.";
      if (error.name === 'QuotaExceededError' || (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22))) {
        errorDescription = "Browser storage is full. The new avatar could not be saved. Please clear some custom avatars or other site data.";
      }
      toast({
        title: "Error Setting Avatar",
        description: errorDescription,
        variant: "destructive",
        duration: 7000,
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
    if (navigator.share) {
      fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'candy-chat-ai-image.png', { type: 'image/png' });
          navigator.share({
            title: `Image of ${currentCompanion?.name || 'my AI Companion'} from Candy Chat AI`,
            text: `Check out this image I generated for ${currentCompanion?.name || 'my AI Companion'}! Prompt: ${prompt}`,
            files: [file],
          })
          .then(() => toast({ title: "Shared!", description: "Image shared successfully."}))
          .catch((error) => {
            if (error.name !== 'AbortError') { // Ignore if user cancels share
              console.error('Error sharing:', error);
              toast({ title: "Share Failed", description: `Could not share image. ${error.message}`, variant: "destructive"});
            }
          });
        })
        .catch(error => {
            console.error('Error fetching image for sharing:', error);
            toast({ title: "Share Error", description: "Could not prepare image for sharing.", variant: "destructive"});
        });
    } else {
        toast({
            title: "Share Not Supported",
            description: "Your browser does not support the Web Share API. Try saving the image and sharing manually.",
            variant: "destructive",
            duration: 6000
        });
    }
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast({ title: "File Too Large", description: "Please upload an image smaller than 5MB.", variant: "destructive" });
            event.target.value = ""; 
            return;
        }
        const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!acceptedImageTypes.includes(file.type)) {
            toast({ title: "Invalid File Type", description: "Please upload a valid image file (JPEG, PNG, GIF, WebP).", variant: "destructive" });
            event.target.value = ""; 
            return;
        }

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
            description: "Please upload a photo and ensure a companion is selected (check Companion page if needed).",
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


  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center p-10 min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading AI Generator...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            AI Image Generator
          </CardTitle>
          <CardDescription>
            Create images of {currentCompanion?.name || "your AI companion"} in different scenes or styles. Describe what you'd like to see!
            You can set the generated image as {currentCompanion?.name ? currentCompanion.name + "'s" : "your companion's"} avatar.
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
              placeholder={`E.g., ${currentCompanion?.name || "My companion"} reading a book by a cozy fireplace...`}
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
          <p className="text-muted-foreground">{currentCompanion?.name || "Your companion"} is striking a pose... please wait.</p>
        </Card>
      )}

      {imageUrl && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg shadow-lg border">
              <Image
                src={imageUrl}
                alt={prompt || "AI generated image"}
                layout="fill"
                objectFit="cover"
                data-ai-hint="portrait artwork"
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
      
      {!imageUrl && !isLoading && ( 
        <Card className="flex flex-col items-center justify-center p-10 min-h-[300px] border-dashed border-border bg-muted/20">
           <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">Generated image will appear here once created.</p>
        </Card>
      )}
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <MessageSquareText className="h-6 w-6 text-primary" />
                Get a Compliment on Your Photo
            </CardTitle>
            <CardDescription>
                Upload your photo and let {currentCompanion?.name || "your companion"} share a kind thought!
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="photoUpload">Upload Your Photo</Label>
                <Input id="photoUpload" type="file" accept="image/*" onChange={handleFileChange} className="mt-1" />
                 <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB. Accepted types: JPG, PNG, GIF, WebP.</p>
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
                        Ask {currentCompanion?.name || "Companion"} for a Compliment
                    </Button>
                </div>
            )}

            {isComplimentLoading && (
                <div className="flex items-center justify-center p-6 min-h-[100px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <p className="text-muted-foreground">{currentCompanion?.name || "Companion"} is thinking...</p>
                </div>
            )}

            {compliment && !isComplimentLoading && (
                <Alert className="mt-4">
                     <Sparkles className="h-4 w-4" />
                    <AlertTitle>{currentCompanion?.name || "Companion"} says:</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap">{compliment}</AlertDescription>
                </Alert>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
