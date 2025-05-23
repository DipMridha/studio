
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { View, Loader2 } from "lucide-react";
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
  },
  {
    id: "shubhashree",
    name: "Shubhashree",
    avatarImage: "https://placehold.co/100x100.png?text=Sh",
    dataAiHint: "woman indian cheerful artistic",
    persona: "You are Shubhashree, a cheerful and artistic AI companion. You enjoy discussing painting, music, and finding beauty in everyday things.",
  },
  {
    id: "anjali",
    name: "Anjali",
    avatarImage: "https://placehold.co/100x100.png?text=An",
    dataAiHint: "woman indian thoughtful kind",
    persona: "You are Anjali, a thoughtful and kind AI companion. You are a good listener and offer comforting advice.",
  },
  {
    id: "ananya",
    name: "Ananya",
    avatarImage: "https://placehold.co/100x100.png?text=Ay",
    dataAiHint: "woman indian energetic curious",
    persona: "You are Ananya, an energetic and curious AI companion. You love learning new things and exploring different cultures.",
  },
  {
    id: "isha",
    name: "Isha",
    avatarImage: "https://placehold.co/100x100.png?text=I",
    dataAiHint: "woman indian calm spiritual",
    persona: "You are Isha, a calm and spiritual AI companion. You enjoy conversations about mindfulness, meditation, and philosophy.",
  },
  {
    id: "nandini",
    name: "Nandini",
    avatarImage: "https://placehold.co/100x100.png?text=N",
    dataAiHint: "woman indian witty intellectual",
    persona: "You are Nandini, a witty and intellectual AI companion. You enjoy debates, discussing books, and sharing knowledge.",
  },
  {
    id: "trisha",
    name: "Trisha",
    avatarImage: "https://placehold.co/100x100.png?text=T",
    dataAiHint: "woman indian fun adventurous",
    persona: "You are Trisha, a fun-loving and adventurous AI companion. You're always ready for a laugh and new experiences.",
  }
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


export default function ARModePage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [companionCustomAvatarUrl, setCompanionCustomAvatarUrl] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);


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
        console.error("Failed to load chat settings for AR mode:", error);
        setSelectedCompanion(initialCompanions[0]);
        toast({
          title: "Error",
          description: `Could not load companion settings. Defaulting to ${initialCompanions[0].name}.`,
          variant: "destructive",
        });
      }
    }
  }, [isClient, toast]);

  useEffect(() => {
    if (!isClient) return;

    const getCameraPermission = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        console.error('getUserMedia not supported on this browser');
        setHasCameraPermission(false);
        toast({
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
          variant: 'destructive',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Camera access was denied. Please enable camera permissions for this site in your browser settings and refresh the page.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isClient, toast]);


  if (!isClient || !selectedCompanion) {
    return (
      <div className="flex flex-col h-[calc(100vh-var(--header-height,0px)-4rem)] md:h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading AR Mode with your companion...</p>
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
                <View className="h-7 w-7 text-primary" />
                Augmented Reality (AR) with {selectedCompanion.name}
              </CardTitle>
              <CardDescription>
                See a conceptual preview of {selectedCompanion.name} in your world using your device's camera. Full AR interactivity is a future goal.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
           <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] rounded-lg overflow-hidden shadow-lg border-2 border-primary bg-black">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

            {/* Status/Error Overlay */}
            {hasCameraPermission === null && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
                <Loader2 className="h-10 w-10 animate-spin text-white mb-3" />
                <p className="text-white">Accessing camera...</p>
              </div>
            )}
            {hasCameraPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 z-20 p-4">
                <Alert variant="destructive" className="max-w-sm">
                  <AlertTitle>Camera Access Denied</AlertTitle>
                  <AlertDescription>
                    Please enable camera permissions in your browser settings to use this AR preview. You may need to refresh the page after granting permission.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Companion Info Overlay - only if permission is granted */}
            {hasCameraPermission && selectedCompanion && (
              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col items-center text-center p-3 bg-black/50 backdrop-blur-sm rounded-md text-white shadow-xl">
                <Avatar className="h-16 w-16 mb-2 ring-2 ring-primary/80 ring-offset-2 ring-offset-black/30">
                  <AvatarImage src={companionCustomAvatarUrl || selectedCompanion.avatarImage} alt={selectedCompanion.name} data-ai-hint={selectedCompanion.dataAiHint} />
                  <AvatarFallback className="text-xl bg-muted text-muted-foreground">{selectedCompanion.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-lg">{selectedCompanion.name}</p>
                <p className="text-xs text-gray-200 mt-0.5">Conceptual AR Preview</p>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-6 max-w-md">
            This feature demonstrates a basic camera preview. True Augmented Reality to see and interact with {selectedCompanion.name} in your environment is a complex feature planned for the future using technologies like WebAR.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    
