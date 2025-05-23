
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Key, Smartphone, UserPlus, LogIn as LogInIcon, Loader2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { RecaptchaVerifier } from "firebase/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Simple SVG icons for Google and Facebook
const GoogleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.21 3h-2.79v6.95c5.07-.99 8.79-5.51 8.79-10.75z"/></svg>;


export function LoginForm() {
  const { 
    signInWithGoogle, signInWithFacebook, signUpWithEmail, signInWithEmail, 
    signInWithPhoneNumber, verifyOtp, signInAsGuest, loading, setupRecaptcha
  } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerId = "recaptcha-container"; // ID for the reCAPTCHA div

  // Initialize RecaptchaVerifier on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !recaptchaVerifierRef.current) {
      // Create a div dynamically if it doesn't exist (for invisible reCAPTCHA)
      if (!document.getElementById(recaptchaContainerId)) {
        const recaptchaDiv = document.createElement('div');
        recaptchaDiv.id = recaptchaContainerId;
        document.body.appendChild(recaptchaDiv);
      }
      recaptchaVerifierRef.current = setupRecaptcha(recaptchaContainerId);
    }
    // Clean up the div when component unmounts
    return () => {
        const recaptchaDiv = document.getElementById(recaptchaContainerId);
        if (recaptchaDiv) {
            recaptchaDiv.remove();
        }
        if (recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current.clear(); // Clear the verifier
            recaptchaVerifierRef.current = null;
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setupRecaptcha]);


  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await signInWithEmail(email, password);
      toast({ title: "Signed In", description: "Welcome back!" });
    } catch (error: any) {
      // Error toast is handled in AuthContext, but you can add specific logic here
    } finally {
      setFormLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await signUpWithEmail(email, password);
      toast({ title: "Signed Up", description: "Welcome! You can now sign in." });
    } catch (error: any) {
      // Error toast is handled in AuthContext
    } finally {
      setFormLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaVerifierRef.current) {
      toast({ title: "reCAPTCHA Error", description: "reCAPTCHA not initialized. Please refresh.", variant: "destructive" });
      return;
    }
    setFormLoading(true);
    try {
      const result = await signInWithPhoneNumber(phoneNumber, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setShowOtpInput(true);
      toast({ title: "OTP Sent", description: "Please enter the OTP you received." });
    } catch (error: any) {
      // Error toast is handled in AuthContext
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) {
      toast({ title: "Error", description: "No OTP confirmation context found.", variant: "destructive"});
      return;
    }
    setFormLoading(true);
    try {
      await verifyOtp(confirmationResult, otp);
      toast({ title: "Signed In", description: "Welcome!"});
    } catch (error: any) {
       // Error toast handled in AuthContext
    } finally {
      setFormLoading(false);
    }
  };

  const currentLoading = loading || formLoading;

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome to Chat AI</CardTitle>
        <CardDescription>Sign in or sign up to continue, or proceed as a guest.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="w-full" disabled={currentLoading}>
                  {currentLoading ? <Loader2 className="animate-spin" /> : <LogInIcon />}
                  Sign In
                </Button>
                <Button type="button" variant="outline" onClick={handleEmailSignUp} className="w-full" disabled={currentLoading}>
                  {currentLoading ? <Loader2 className="animate-spin" /> : <UserPlus />}
                  Sign Up
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="phone">
             <Alert variant="default" className="mb-4">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Phone Sign-In Note</AlertTitle>
                <AlertDescription>
                  Phone sign-in uses Firebase reCAPTCHA. You might see a reCAPTCHA challenge. If it's invisible, it works in the background.
                  An element with ID '{recaptchaContainerId}' is used for this.
                </AlertDescription>
            </Alert>
            {!showOtpInput ? (
              <form onSubmit={handlePhoneSignIn} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                     <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="phoneNumber" type="tel" placeholder="+1 123 456 7890" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="pl-10" />
                  </div>
                   <p className="text-xs text-muted-foreground">Enter with country code (e.g., +1, +91).</p>
                </div>
                <Button type="submit" className="w-full" disabled={currentLoading || !recaptchaVerifierRef.current}>
                  {currentLoading ? <Loader2 className="animate-spin" /> : <SendIcon />}
                  Send OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input id="otp" type="text" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
                </div>
                <Button type="submit" className="w-full" disabled={currentLoading}>
                  {currentLoading ? <Loader2 className="animate-spin" /> : <LogInIcon />}
                  Verify OTP & Sign In
                </Button>
                <Button variant="outline" onClick={() => { setShowOtpInput(false); setOtp(''); setConfirmationResult(null); }} className="w-full">
                  Change Phone Number
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-3">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={signInWithGoogle} disabled={currentLoading}>
                    {currentLoading ? <Loader2 className="animate-spin mr-2" /> : <GoogleIcon />}
                    Google
                </Button>
                <Button variant="outline" onClick={signInWithFacebook} disabled={currentLoading}>
                    {currentLoading ? <Loader2 className="animate-spin mr-2" /> : <FacebookIcon />}
                    Facebook
                </Button>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4 pt-6">
        <Button variant="secondary" onClick={signInAsGuest} className="w-full" disabled={currentLoading}>
          {currentLoading ? <Loader2 className="animate-spin" /> : "Continue as Guest"}
        </Button>
        <p className="px-8 text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy (placeholders).
        </p>
      </CardFooter>
      {/* This div is used by RecaptchaVerifier. It can be invisible. */}
      {/* <div id={recaptchaContainerId}></div> */}
    </Card>
  );
}

// Helper Icon for Send OTP
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;

