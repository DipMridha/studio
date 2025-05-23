
"use client"; // Needs to be client component for useEffect

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";
import { Toaster } from "@/components/ui/toaster";
import React, { useEffect } from "react";
import { THEME_KEY } from "@/lib/constants";


// export const metadata: Metadata = { // Metadata should be defined in a server component or page.tsx
//   title: "Chat AI",
//   description: "Your AI Companion - Chat AI",
// };


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const applyTheme = () => {
      const storedTheme = localStorage.getItem(THEME_KEY);
      if (
        storedTheme === 'dark' ||
        (storedTheme === null && // Default to system if nothing stored
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for changes in system preference if 'system' is effectively chosen
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
       const storedTheme = localStorage.getItem(THEME_KEY);
       if (storedTheme === 'system' || storedTheme === null) { // Re-apply if system or default
        applyTheme();
       }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);


  return (
    <html lang="en" className={GeistSans.variable}>
      <body
        className={`font-sans antialiased`}
      >
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
