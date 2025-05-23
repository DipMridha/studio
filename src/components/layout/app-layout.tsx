
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
} from "@/components/ui/sidebar";
import {
  MessageCircle,
  UserCog,
  Sparkles,
  Settings as SettingsIcon,
  CalendarCheck,
  BookOpen,
  View,
  CreditCard,
  // Home icon was for Virtual Space, which is being removed
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/gallery", label: "AI Generator", icon: Sparkles },
  { href: "/companion", label: "Companion", icon: UserCog },
  { href: "/reminders", label: "Reminders", icon: CalendarCheck },
  { href: "/story", label: "Story Mode", icon: BookOpen },
  { href: "/ar", label: "AR Mode", icon: View },
  { href: "/subscription", label: "Subscription", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/app-logo.png" alt="Chat AI Logo" width={32} height={32} className="rounded-sm" />
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
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
          <Link href="/" className="flex items-center gap-2">
             <Image src="/app-logo.png" alt="Chat AI Logo" width={28} height={28} className="rounded-sm" />
            <span className="text-lg font-semibold text-foreground">Chat AI</span>
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
