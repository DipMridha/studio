
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";

export default function MiniGamesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            Mini-Games with Your Companion
          </CardTitle>
          <CardDescription>
            Play fun and interactive mini-games like trivia, guess the word, or even rock-paper-scissors with your AI companion. This feature is currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center p-10 min-h-[200px] border-2 border-dashed border-border rounded-lg">
            <Gamepad2 className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Challenge your AI companion to a game of trivia, guess the word, and more!
            </p>
             <p className="text-sm text-muted-foreground text-center mt-2">
              This interactive feature is coming soon. Stay tuned for fun ways to play together!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
