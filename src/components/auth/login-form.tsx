
"use client";

import { useEffect, useState } from "react";
import { RecaptchaVerifier, type ConfirmationResult } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { auth } from "@/lib/firebase"; 
import { Loader2, LogIn, User, Phone, KeyRound } from "lucide-react";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export function LoginForm() {
  const { signInWithPhoneNumber, confirmOtp, signInAsGuest, loading: authLoading, setConfirmationResult: setAuthConfirmationResult } = useAuth();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    // Ensure reCAPTCHA container div exists for invisible reCAPTCHA
    if (typeof window !== 'undefined' && !document.getElementById("recaptcha-container")) {
      const recaptchaContainer = document.createElement('div');
      recaptchaContainer.id = "recaptcha-container";
      document.body.appendChild(recaptchaContainer);
    }
    
    // Initialize reCAPTCHA
    if (auth && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // console.log("reCAPTCHA solved:", response);
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          toast({ title: "reCAPTCHA Expired", description: "Please try sending OTP again.", variant: "destructive" });
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.render().then((widgetId) => {
               if (typeof grecaptcha !== 'undefined' && grecaptcha.reset) {
                grecaptcha.reset(widgetId);
              }
            });
          }
        },
      });
      window.recaptchaVerifier.render().catch(err => {
        console.error("RecaptchaVerifier render error:", err);
        // toast({ title: "reCAPTCHA Error", description: "Could not initialize reCAPTCHA. Please refresh.", variant: "destructive" });
      });
    }
    // Cleanup reCAPTCHA on unmount
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        const container = document.getElementById("recaptcha-container");
        if (container) container.remove();
      }
    };
  }, [toast]);


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || !window.recaptchaVerifier) {
      toast({ title: "Phone number required", description: "Please enter a valid phone number.", variant: "destructive" });
      return;
    }
    setFormLoading(true);
    try {
      // Ensure phone number has country code, e.g., +91 for India
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(formattedPhoneNumber, window.recaptchaVerifier);
      setAuthConfirmationResult(confirmation); // Store in context
      window.confirmationResult = confirmation; // Also store on window for this component's direct use if needed
      setIsOtpSent(true);
      toast({ title: "OTP Sent", description: `An OTP has been sent to ${formattedPhoneNumber}.` });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      let errorMessage = "Failed to send OTP. Please check the phone number and try again.";
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = "Invalid phone number. Please include the country code (e.g., +91XXXXXXXXXX).";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many requests. Please try again later.";
      } else if (error.message?.includes('reCAPTCHA')) {
        errorMessage = "reCAPTCHA verification failed. Please try again.";
      }
      toast({ title: "OTP Error", description: errorMessage, variant: "destructive" });
      // Optionally reset reCAPTCHA here if needed
      if (window.recaptchaVerifier) {
         window.recaptchaVerifier.render().then((widgetId) => {
            if (typeof grecaptcha !== 'undefined' && grecaptcha.reset) {
                grecaptcha.reset(widgetId);
            }
        });
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleOtpSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast({ title: "OTP Required", description: "Please enter the OTP.", variant: "destructive" });
      return;
    }
    setFormLoading(true);
    try {
      await confirmOtp(otp);
      // onAuthStateChanged in AuthContext will handle successful login
      toast({ title: "Signed In Successfully!", description: "Welcome to Chat AI." });
    } catch (error: any) {
      console.error("Error signing in with OTP:", error);
      let errorMessage = "Failed to sign in. Invalid OTP or an unknown error occurred.";
       if (error.code === 'auth/invalid-verification-code') {
        errorMessage = "Invalid OTP. Please check and try again.";
      } else if (error.code === 'auth/code-expired') {
        errorMessage = "The OTP has expired. Please request a new one.";
      }
      toast({ title: "Sign-In Error", description: errorMessage, variant: "destructive" });
      setIsOtpSent(false); // Allow user to request OTP again
      setOtp("");
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleGuestLogin = () => {
    setFormLoading(true);
    try {
        signInAsGuest();
        toast({ title: "Continuing as Guest", description: "You can explore the app with limited features." });
    } catch (error) {
        toast({ title: "Error", description: "Could not continue as guest.", variant: "destructive"});
    } finally {
        setFormLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <LogIn className="h-7 w-7 text-primary" /> Welcome to Chat AI
          </CardTitle>
          <CardDescription>Sign in or continue as a guest to chat with your AI companion.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label htmlFor="phone" className="flex items-center gap-1 mb-1">
                  <Phone className="h-4 w-4 text-muted-foreground" /> Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="E.g., +919876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  disabled={formLoading || authLoading}
                />
                 <p className="text-xs text-muted-foreground mt-1">Include country code (e.g., +91 for India).</p>
              </div>
              <Button type="submit" className="w-full" disabled={formLoading || authLoading || !phoneNumber.trim()}>
                {formLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSignIn} className="space-y-4">
              <div>
                <Label htmlFor="otp" className="flex items-center gap-1 mb-1">
                  <KeyRound className="h-4 w-4 text-muted-foreground" /> Enter OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  disabled={formLoading || authLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={formLoading || authLoading || !otp.trim()}>
                {formLoading ? <Loader2 className="animate-spin" /> : "Sign In with OTP"}
              </Button>
              <Button variant="link" onClick={() => { setIsOtpSent(false); setOtp(""); }} className="w-full text-sm" disabled={formLoading || authLoading}>
                Change phone number or resend OTP
              </Button>
            </form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGuestLogin} disabled={formLoading || authLoading}>
            {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <User className="mr-2 h-4 w-4" /> Continue as Guest
          </Button>
          <div id="recaptcha-container-visible"></div> {/* Optional: for visible reCAPTCHA, if preferred */}
        </CardContent>
      </Card>
    </div>
  );
}
