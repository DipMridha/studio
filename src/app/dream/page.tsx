
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon } from "lucide-react";

export default function DreamModePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-6 w-6 text-primary" />
            Dream Mode / Night Chat
          </CardTitle>
          <CardDescription>
            Enter a special night-time mood with your AI companion. Engage in dream-sharing dialogues, explore softer conversations, and imagine a calming atmosphere. Future enhancements could include soft ambient music.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center p-10 min-h-[200px] border-2 border-dashed border-border rounded-lg">
            <Moon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Share your dreams or enjoy a peaceful night-time chat with your companion.
            </p>
             <p className="text-sm text-muted-foreground text-center mt-2">
              This special mode is coming soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
