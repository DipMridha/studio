
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { Loader2, Mail } from "lucide-react"; // Mail icon for email login
import { useToast } from '@/hooks/use-toast'; // Import useToast

// Inline SVG for Google Icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

// Inline SVG for Facebook Icon
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);


export function LoginForm() {
  const { signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail, loading: authLoading } = useAuth();
  const { toast } = useToast(); // Get toast function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        toast({ title: "Input Required", description: "Please enter email and password.", variant: "destructive"});
        return;
    }
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      // Auth context will handle redirect or user state change
      // toast({ title: "Sign In Successful", description: "Welcome back!"}); // Handled by onAuthStateChanged or specific logic in context
    } catch (error) {
      console.error("Login form error:", error);
      toast({ title: "Sign In Failed", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive"});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async () => {
    // Basic validation, can be expanded with a proper form/dialog for sign up
    if (!email || !password) {
        toast({ title: "Input Required for Sign Up", description: "Please enter email and password to sign up.", variant: "destructive"});
        return;
    }
    setIsSubmitting(true);
    try {
      await signUpWithEmail(email, password);
      // toast({ title: "Sign Up Successful!", description: "Welcome! You are now signed in."}); // Handled by onAuthStateChanged
    } catch (error) {
      console.error("Sign up form error:", error);
      toast({ title: "Sign Up Failed", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive"});
    } finally {
      setIsSubmitting(false);
    }
  };


  const currentLoading = authLoading || isSubmitting;

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to Chat AI</CardTitle>
        <CardDescription>Sign in or sign up to continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={currentLoading}>
          {currentLoading && isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
          Sign in with Google
        </Button>
        <Button variant="outline" className="w-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90" onClick={signInWithFacebook} disabled={currentLoading}>
          {currentLoading && isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FacebookIcon />}
          Sign in with Facebook
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={currentLoading}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={currentLoading}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={currentLoading}>
            {currentLoading && isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
            Sign In with Email
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Don't have an account? <Button variant="link" className="p-0 h-auto text-xs" onClick={handleSignUp} disabled={currentLoading}>Sign Up with Email</Button>
        </p>
        <p className="text-xs text-muted-foreground">
          (Uses the email/password fields above for sign up)
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          By signing in or signing up, you agree to our Terms of Service.
        </p>
      </CardFooter>
    </Card>
  );
}
