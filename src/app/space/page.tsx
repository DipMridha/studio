
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";

export default function VirtualSpacePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            Virtual Living Space with Your Companion
          </CardTitle>
          <CardDescription>
            Design and interact within a virtual environment with your AI companion. This feature is planned for the future.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center p-10 min-h-[200px] border-2 border-dashed border-border rounded-lg">
            <Home className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Build and customize the virtual space you share with your AI companion.
            </p>
             <p className="text-sm text-muted-foreground text-center mt-2">
              Exciting updates are on the way!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
