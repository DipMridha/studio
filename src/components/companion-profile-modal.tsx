
"use client";

import type { Companion } from "@/app/companion/page"; // Assuming Companion type is exported there
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Cake, MapPin, MessageSquare, Sparkles, Palette } from "lucide-react";

interface CompanionProfileModalProps {
  companion: Companion | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  customAvatarUrl?: string;
}

export function CompanionProfileModal({
  companion,
  isOpen,
  onOpenChange,
  customAvatarUrl,
}: CompanionProfileModalProps) {
  if (!companion) {
    return null;
  }

  const avatarSrc = customAvatarUrl || companion.avatarImage;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] flex flex-col">
        <DialogHeader className="text-center pb-4 border-b">
            <Avatar className="h-28 w-28 mx-auto mb-3 ring-4 ring-primary/30 ring-offset-background ring-offset-2">
                <AvatarImage src={avatarSrc} alt={companion.name} data-ai-hint={companion.dataAiHint} className="object-cover"/>
                <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                {companion.name.charAt(0)}
                </AvatarFallback>
            </Avatar>
          <DialogTitle className="text-3xl font-bold">{companion.name}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            <MapPin className="inline-block h-4 w-4 mr-1" /> {companion.region} &nbsp;·&nbsp; <Cake className="inline-block h-4 w-4 mr-1" /> {companion.age} years old
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto pr-2 -mr-2">
          <div className="space-y-4 py-4">
            <div>
              <h3 className="text-md font-semibold mb-1 flex items-center"><MessageSquare className="h-5 w-5 mr-2 text-primary"/>Persona</h3>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {companion.persona}
              </p>
            </div>

            {companion.hobbies && companion.hobbies.length > 0 && (
              <div>
                <h3 className="text-md font-semibold mb-1 flex items-center"><Sparkles className="h-5 w-5 mr-2 text-primary"/>Hobbies</h3>
                <div className="flex flex-wrap gap-2">
                  {companion.hobbies.map((hobby) => (
                    <Badge key={hobby} variant="secondary" className="text-xs">{hobby}</Badge>
                  ))}
                </div>
              </div>
            )}

            {companion.favorites && companion.favorites.length > 0 && (
              <div>
                <h3 className="text-md font-semibold mb-1 flex items-center"><Heart className="h-5 w-5 mr-2 text-primary"/>Favorites</h3>
                <div className="flex flex-wrap gap-2">
                  {companion.favorites.map((fav) => (
                    <Badge key={fav} variant="outline" className="text-xs">{fav}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        {/* Footer can be added here if needed */}
      </DialogContent>
    </Dialog>
  );
}
