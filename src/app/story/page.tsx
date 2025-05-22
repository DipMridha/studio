
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function StoryModePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Story Mode: Relationship Growth
          </CardTitle>
          <CardDescription>
            Embark on a journey with your AI companion through different story chapters. Your choices will shape the path and growth of your relationship. This feature is currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center p-10 min-h-[200px] border-2 border-dashed border-border rounded-lg">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Experience different story chapters and watch your relationship evolve based on your choices.
            </p>
             <p className="text-sm text-muted-foreground text-center mt-2">
              This interactive story mode is coming soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
