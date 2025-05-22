
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter, // Import SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  UserCog,
  Sparkles,
  Settings as SettingsIcon,
  CalendarCheck,
  BookOpen,
  View,
  LogOut, // Import LogOut icon
  Loader2, // Import Loader2 for loading state
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context"; // Import useAuth
import { LoginForm } from "@/components/auth/login-form"; // Import LoginForm

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/chat", label: "Start", icon: MessageCircle },
  { href: "/gallery", label: "AI Generator", icon: Sparkles },
  { href: "/companion", label: "Companion", icon: UserCog },
  { href: "/reminders", label: "Reminders", icon: CalendarCheck },
  { href: "/story", label: "Story Mode", icon: BookOpen },
  { href: "/ar", label: "AR Mode", icon: View },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, signOut: handleSignOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
        <LoginForm />
      </div>
    );
  }

  // User is authenticated, render the main app layout
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="https://placehold.co/32x32.png" alt="Chat AI Logo" width={32} height={32} data-ai-hint="pink candy" className="rounded-sm" />
            <h1 className="text-xl font-semibold text-foreground">Chat AI</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (pathname === '/' && item.href === '/chat')}
                    tooltip={item.label}
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          {user && (
             <p className="px-2 py-1 text-xs text-sidebar-foreground/70 truncate">
              {user.email || user.displayName || 'Authenticated User'}
            </p>
          )}
          <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
          <Link href="/" className="flex items-center gap-2">
             <Image src="https://placehold.co/28x28.png" alt="Chat AI Logo" width={28} height={28} data-ai-hint="pink candy" className="rounded-sm" />
            <span className="text-lg font-semibold text-foreground">Chat AI</span>
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
