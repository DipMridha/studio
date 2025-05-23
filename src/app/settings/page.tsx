
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Settings as SettingsIcon, UserCircle, Palette, Trash2, LogOut, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CHAT_SETTINGS_KEY, THEME_KEY } from "@/lib/constants";
import React, { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

export default function SettingsPage() {
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = useState<Theme>("system");

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    if (storedTheme) {
      setCurrentTheme(storedTheme);
    } else {
      setCurrentTheme("system"); // Default if nothing is stored
    }
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else { // System theme
      localStorage.removeItem(THEME_KEY); // Let RootLayout handle system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    toast({
      title: "Theme Updated",
      description: `Theme set to ${theme.charAt(0).toUpperCase() + theme.slice(1)}.`,
    });
  };
  
  const clearAllChatData = () => {
    localStorage.removeItem(CHAT_SETTINGS_KEY);
    toast({
      title: "Chat Data Cleared",
      description: "All companion preferences, traits, and chat settings have been reset.",
    });
    setTimeout(() => window.location.reload(), 1000); // Reload to reflect changes
  };

  const resetApplication = () => {
    // For now, this also just clears the main settings key. Could be expanded.
    localStorage.removeItem(CHAT_SETTINGS_KEY);
    localStorage.removeItem(THEME_KEY); // Also reset theme
    toast({
      title: "Application Reset",
      description: "All application data and preferences have been reset to defaults.",
    });
    setTimeout(() => window.location.reload(), 1000);
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
              <Link href="/subscription" passHref>
                <Button variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Subscription
                </Button>
              </Link>
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
                <h4 className="font-medium mb-2">Theme</h4>
                <div className="flex space-x-2">
                  <Button 
                    variant={currentTheme === 'light' ? 'default' : 'outline'} 
                    onClick={() => handleThemeChange('light')}
                  >
                    Light
                  </Button>
                  <Button 
                    variant={currentTheme === 'dark' ? 'default' : 'outline'} 
                    onClick={() => handleThemeChange('dark')}
                  >
                    Dark
                  </Button>
                  <Button 
                    variant={currentTheme === 'system' ? 'default' : 'outline'} 
                    onClick={() => handleThemeChange('system')}
                  >
                    System
                  </Button>
                </div>
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
              <Button variant="outline" onClick={clearAllChatData}>
                Clear All Chat Data (Companion, Traits, etc.)
              </Button>
              <Button variant="destructive" onClick={resetApplication}>
                Reset Application (Clears All Data)
              </Button>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}
