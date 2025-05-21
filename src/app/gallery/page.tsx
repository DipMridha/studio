
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { generateAiImage, type GenerateAiImageInput } from "@/ai/flows/generate-ai-image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, Loader2, Sparkles } from "lucide-react";

export default function GalleryPage() {
  const [prompt, setPrompt] = useState("A beautiful portrait of Evie, smiling warmly, soft lighting.");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


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
    setImageUrl(null); // Clear previous image

    try {
      const input: GenerateAiImageInput = { prompt };
      const result = await generateAiImage(input);
      setImageUrl(result.imageUrl);
      toast({
        title: "Image Generated!",
        description: "Evie's new picture is ready.",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            Create images of Evie in different scenes or poses. Describe what you'd like to see!
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
              placeholder="E.g., Evie reading a book by a cozy fireplace, Evie on a sunny beach..."
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
          <p className="text-muted-foreground">Evie is striking a pose... please wait.</p>
        </Card>
      )}

      {isClient && imageUrl && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg shadow-lg">
              <Image
                src={imageUrl}
                alt={prompt || "AI generated image of Evie"}
                layout="fill"
                objectFit="cover"
                data-ai-hint="portrait"
              />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Prompt: {prompt}</p>
          </CardFooter>
        </Card>
      )}

      {!isClient && !isLoading && ( // Placeholder for SSR/initial load before client takes over
        <Card className="flex flex-col items-center justify-center p-10 min-h-[300px] border-dashed">
           <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Generated image will appear here.</p>
        </Card>
      )}
    </div>
  );
}
