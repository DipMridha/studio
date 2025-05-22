
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, UserCircle, Palette, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleComingSoon = () => {
    toast({
      title: "Feature Coming Soon",
      description: "This setting is currently under development.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            Settings
          </CardTitle>
          <CardDescription>
            Manage your application settings, preferences, and account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Account Preferences Section */}
          <Card className="shadow-none border">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Account Preferences
              </CardTitle>
              <CardDescription>User profile and general account settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">User Name</h4>
                <p className="text-sm text-muted-foreground">
                  Your display name is managed on the "Companion" page.
                </p>
              </div>
               {/* Add more account-related settings placeholders here */}
              <Button variant="outline" onClick={handleComingSoon} disabled>
                Manage Subscription (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* Appearance Settings Section */}
          <Card className="shadow-none border">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Theme</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Select your preferred application theme. (Light/Dark mode switching coming soon!)
                </p>
                <Button variant="outline" onClick={handleComingSoon} disabled>
                  Toggle Theme (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management Section */}
          <Card className="shadow-none border">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription>Manage your application data and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={handleComingSoon} disabled>
                Clear Chat History (Coming Soon)
              </Button>
              <Button variant="destructive" onClick={handleComingSoon} disabled>
                Reset All Settings (Coming Soon)
              </Button>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}
