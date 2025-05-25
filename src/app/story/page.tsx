
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Loader2, PlayCircle, ArrowLeft } from "lucide-react";
import { CHAT_SETTINGS_KEY } from "@/lib/constants";
import { 
  initialCompanions, 
  type Companion, 
  type ChatSettings
} from "@/lib/companions-data";

interface StoryChapter {
  id: string;
  title: string;
  description: string;
  isLocked?: boolean; 
  sceneImageUrl?: string; 
  dataAiHintScene?: string;
}

const storyChapters: StoryChapter[] = [
  {
    id: "chapter1",
    title: "Chapter 1: First Encounter",
    description: "A chance meeting that sparks a new connection. Discover how your journey with your companion begins.",
    sceneImageUrl: "https://placehold.co/600x400.png",
    dataAiHintScene: "cafe serendipity"
  },
  {
    id: "chapter2",
    title: "Chapter 2: A Shared Secret",
    description: "Trust deepens as you and your companion share something personal. What will you reveal?",
    isLocked: true,
    sceneImageUrl: "https://placehold.co/600x400.png",
    dataAiHintScene: "park bench sunset"
  },
  {
    id: "chapter3",
    title: "Chapter 3: Navigating Challenges",
    description: "Every relationship has its tests. Face a challenge together and see how your bond strengthens.",
    isLocked: true,
    sceneImageUrl: "https://placehold.co/600x400.png",
    dataAiHintScene: "stormy city"
  },
];

export default function StoryModePage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [companionCustomAvatarUrl, setCompanionCustomAvatarUrl] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const [currentChapter, setCurrentChapter] = useState<StoryChapter | null>(null);
  const [isViewingChapter, setIsViewingChapter] = useState(false);

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
          setSelectedCompanion(initialCompanions[0]); // Default if no settings
           toast({
            title: "Companion Not Set",
            description: `Defaulting to ${initialCompanions[0].name}. Go to the Companion page to choose your companion.`,
          });
        }
      } catch (error) {
        console.error("Failed to load chat settings for story mode:", error);
        setSelectedCompanion(initialCompanions[0]);
        toast({
          title: "Error",
          description: `Could not load companion settings. Defaulting to ${initialCompanions[0].name}.`,
          variant: "destructive",
        });
      }
    }
  }, [isClient, toast]);

  const handleStartChapter = (chapter: StoryChapter) => {
    if (!selectedCompanion) return;
    if (chapter.isLocked) {
      toast({
        title: "Chapter Locked",
        description: `This chapter with ${selectedCompanion.name} is not yet available. Continue interacting to unlock more!`,
        variant: "default",
      });
      return;
    }
    setCurrentChapter(chapter);
    setIsViewingChapter(true);
    toast({
      title: `Starting: ${chapter.title}`,
      description: `Get ready for an adventure with ${selectedCompanion.name}!`,
    });
  };

  const handleBackToChapters = () => {
    setIsViewingChapter(false);
    setCurrentChapter(null);
  };

  if (!isClient || !selectedCompanion) {
    return (
      <div className="flex flex-col h-[calc(100vh-var(--header-height,0px)-4rem)] md:h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading story mode with {selectedCompanion?.name || 'your companion'}...</p>
      </div>
    );
  }

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
                <BookOpen className="h-7 w-7 text-primary" />
                Story Mode with {selectedCompanion.name}
              </CardTitle>
              <CardDescription>
                {isViewingChapter && currentChapter 
                  ? `Playing: ${currentChapter.title}`
                  : `Embark on a journey with ${selectedCompanion.name} through different story chapters. Your choices will shape the path and growth of your relationship.`
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isViewingChapter && currentChapter ? (
            <div>
              {currentChapter.sceneImageUrl && (
                 <div className="mb-6 rounded-lg overflow-hidden shadow-lg aspect-video relative border border-primary/30">
                    <Image 
                        src={currentChapter.sceneImageUrl} 
                        alt={`Scene from ${currentChapter.title}`} 
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={currentChapter.dataAiHintScene || "story scene"}
                    />
                 </div>
              )}
              <h2 className="text-2xl font-semibold text-primary mb-2">{currentChapter.title}</h2>
              <p className="text-muted-foreground mb-4">
                The story of "{currentChapter.title}" with {selectedCompanion.name} begins here... 
                Imagine the scene: {currentChapter.description}
              </p>
              <div className="p-6 border-2 border-dashed border-border rounded-lg min-h-[150px] flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Interactive story content and your choices will appear here.
                </p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  (Full interactive dialogue and choices coming soon!)
                </p>
              </div>
              <Button onClick={handleBackToChapters} variant="outline" className="mt-6">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Chapters
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground">Select a chapter to begin your story:</p>
              {storyChapters.map((chapter) => (
                <Card key={chapter.id} className={`bg-card/50 p-4 shadow-inner hover:shadow-md transition-shadow mt-4 ${chapter.isLocked ? 'opacity-70' : ''}`}>
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">{chapter.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{chapter.description}</p>
                    </div>
                    <Button
                      onClick={() => handleStartChapter(chapter)}
                      disabled={chapter.isLocked}
                      variant={chapter.isLocked ? "outline" : "default"}
                      className="w-full md:w-auto"
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      {chapter.isLocked ? "Locked" : "Start Chapter"}
                    </Button>
                  </div>
                </Card>
              ))}
              <p className="text-xs text-muted-foreground text-center pt-6">
                More chapters and interactive choices will be added soon. Your affection level with {selectedCompanion.name} may unlock new story paths in the future!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
