
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  MessageCircle,
  UserCog,
  Sparkles,
  Settings as SettingsIcon,
  CalendarCheck,
  BookOpen,
  View,
  LogOut,
  Loader2,
  UserCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";

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
  const { user, loading, isGuest, signOut: handleSignOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !isGuest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
        <LoginForm />
      </div>
    );
  }

  // User is authenticated or is a guest
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="https://placehold.co/32x32.png" alt="Chat AI Logo" width={32} height={32} data-ai-hint="pink candy" className="rounded-sm" />
            <h1 className="text-xl font-semibold text-sidebar-foreground">Chat AI</h1>
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
        <SidebarFooter className="p-2 space-y-2">
           {user && (
             <div className="px-2 py-1 text-xs text-sidebar-foreground/70 truncate flex items-center gap-2">
                <UserCircle2 className="h-4 w-4 shrink-0" />
                {user.email || user.phoneNumber || "Authenticated User"}
            </div>
           )}
           {isGuest && !user && (
             <p className="px-2 py-1 text-xs text-sidebar-foreground/70 truncate">
                Browsing as Guest
            </p>
           )}
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleSignOut}
          >
            <LogOut />
            <span>{user ? "Sign Out" : "Exit Guest Mode"}</span>
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
