
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
  // LogOut, Loader2, UserCircle2 removed as auth is removed
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
// useAuth and LoginForm removed

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
  // Removed useAuth, loading, isGuest, signOut

  // No more loading or login form logic
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
           {/* Removed user/guest display and sign-out button */}
           <p className="px-2 py-1 text-xs text-sidebar-foreground/70 truncate">
              Welcome to Chat AI!
           </p>
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
