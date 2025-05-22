
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
            Imagine receiving supportive messages like "If you're very busy with work, take care!", engaging in simulated daily check-in calls with unique dialogues, and setting reminders with your AI companion. This feature is under development.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center p-10 min-h-[200px] border-2 border-dashed border-border rounded-lg">
            <CalendarCheck className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Receive daily check-in messages or set up reminders with your AI companion here.
            </p>
             <p className="text-sm text-muted-foreground text-center mt-2">
              This section is coming soon! Advanced features like proactive notifications and video avatar animation for calls are planned for later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
