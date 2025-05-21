
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";

export default function CompanionPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-6 w-6 text-primary" />
            Customize Your Companion
          </CardTitle>
          <CardDescription>
            Personalize your AI companion's appearance, traits, and more. This feature is coming soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-10 min-h-[200px] border-2 border-dashed border-border rounded-lg">
            <UserCog className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Companion customization tools will be available here.
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Stay tuned for updates!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
