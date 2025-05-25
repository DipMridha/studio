
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Loader2, PlayCircle, ArrowLeft } from "lucide-react";
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
    dataAiHint: "woman empathetic warm",
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
    dataAiHint: "woman playful adventurous",
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
    dataAiHint: "woman wise thoughtful",
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
    dataAiHint: "indian woman intelligent curious",
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
    dataAiHint: "indian woman artistic gentle",
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
    dataAiHint: "indian woman energetic optimistic",
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
    dataAiHint: "indian woman cheerful painter",
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
    dataAiHint: "indian woman kind listener",
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
    dataAiHint: "indian woman explorer curious",
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
    dataAiHint: "indian woman spiritual calm",
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
    dataAiHint: "indian woman witty intellectual",
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
    dataAiHint: "indian woman funloving adventurous",
    persona: "You are Trisha, an 18-year-old fun-loving and adventurous AI companion from India. You're always ready for a laugh and new experiences.",
    hobbies: ["Dancing", "Trying new adventure sports", "Socializing"],
    favorites: ["Parties", "Comedy movies", "Meeting new people"],
  }
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

interface StoryChapter {
  id: string;
  title: string;
  description: string;
  isLocked?: boolean; 
  sceneImageUrl?: string; // Optional image for the chapter scene
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
          setSelectedCompanion(initialCompanions[0]);
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
        <p className="text-muted-foreground">Loading story mode with your companion...</p>
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
              {/* Current Chapter View */}
              {currentChapter.sceneImageUrl && (
                 <div className="mb-6 rounded-lg overflow-hidden shadow-lg aspect-video relative border border-primary/30">
                    <img 
                        src={currentChapter.sceneImageUrl} 
                        alt={`Scene from ${currentChapter.title}`} 
                        className="w-full h-full object-cover"
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
              {/* Chapter List View */}
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


    