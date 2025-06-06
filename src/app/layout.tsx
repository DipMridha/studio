
"use client";

import type { Metadata } from "next"; 
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";
import { Toaster } from "@/components/ui/toaster";
import React, { useEffect } from "react";
import { THEME_KEY } from "@/lib/constants";
import { AuthProvider } from "@/context/auth-context";


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
        (storedTheme === null &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
       const storedTheme = localStorage.getItem(THEME_KEY);
       if (storedTheme === 'system' || storedTheme === null) {
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
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
