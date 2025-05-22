
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";

export default function RemindersPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-primary" />
            Daily Connections & Reminders
          </CardTitle>
          <CardDescription>
            Receive supportive messages, engage in simulated daily calls with unique dialogues, and set reminders with your AI companion. This feature is under development.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center p-10 min-h-[200px] border-2 border-dashed border-border rounded-lg">
            <CalendarCheck className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Imagine receiving daily check-in calls or setting up reminders with your AI companion here.
            </p>
             <p className="text-sm text-muted-foreground text-center mt-2">
              This section is coming soon! Video avatar animation for calls is a more advanced feature planned for later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
