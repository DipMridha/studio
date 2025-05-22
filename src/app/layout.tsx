
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono"; // Keep commented or remove if not fixed/used
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context"; // Import AuthProvider

const geistSans = GeistSans;
// const geistMono = GeistMono; // Keep commented or remove if not fixed/used

export const metadata: Metadata = {
  title: "Chat AI",
  description: "Your AI Companion - Chat AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`} // GeistMono removed
        className={`${geistSans.variable} font-sans antialiased`}
      >
        <AuthProvider> {/* Wrap with AuthProvider */}
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
