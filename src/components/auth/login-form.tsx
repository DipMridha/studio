
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth as firebaseAuthService } from '@/lib/firebase';

// Schemas
const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});
type EmailFormData = z.infer<typeof emailSchema>;

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, { message: "Phone number seems too short." }).regex(/^\+[1-9]\d{1,14}$/, { message: "Invalid phone number format (e.g., +16505551234)."}),
});
type PhoneFormData = z.infer<typeof phoneSchema>;

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});
type OtpFormData = z.infer<typeof otpSchema>;


// Inline SVG Icons for simplicity
const GoogleIcon = () => <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M20.64 12.2045C20.64 11.3818 20.5636 10.5818 20.4273 9.81818H12V14.4682H16.8364C16.6364 15.6955 16.0182 16.7364 15.1182 17.3682V20.1818H17.9409C19.6409 18.5955 20.64 16.2182 20.64 13.4182C20.64 12.9864 20.6545 12.5955 20.64 12.2045Z" fill="#4285F4"/><path fillRule="evenodd" clipRule="evenodd" d="M12 21C14.4409 21 16.5273 20.1682 17.9409 18.5955L15.1182 17.3682C14.3182 17.9182 13.2545 18.2545 12 18.2545C9.64091 18.2545 7.61818 16.6682 6.88182 14.4909L3.95455 15.7182C5.33636 18.7182 8.43636 21 12 21Z" fill="#34A853"/><path fillRule="evenodd" clipRule="evenodd" d="M6.88182 14.4909C6.77273 14.1636 6.70909 13.8091 6.70909 13.4455C6.70909 13.0818 6.77273 12.7273 6.88182 12.4L3.95455 11.1727C3.5 12.1182 3.27273 13.15 3.27273 14.2818C3.27273 15.4136 3.5 16.4455 3.95455 17.3909L6.88182 14.4909Z" fill="#FBBC05"/><path fillRule="evenodd" clipRule="evenodd" d="M12 6.74545C13.3 6.74545 14.3727 7.22727 14.8182 7.63182L17.9955 4.5C16.5273 3.16818 14.4409 2.31818 12 2.31818C8.43636 2.31818 5.33636 4.6 3.95455 7.6L6.88182 9.82727C7.61818 7.65 9.64091 6.74545 12 6.74545Z" fill="#EA4335"/></svg>;
const FacebookIcon = () => <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="#1877F2"/></svg>;

export function LoginForm() {
  const { 
    signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail, 
    initiateSignInWithPhoneNumber, confirmOtp, signInAsGuest, loading,
    confirmationResult, setConfirmationResult
  } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const appVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const { register: registerEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors } } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });
  const { register: registerPhone, handleSubmit: handlePhoneSubmit, formState: { errors: phoneErrors } } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });
  const { register: registerOtp, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });
  
  useEffect(() => {
    // Dynamically create recaptcha container if it doesn't exist
    if (!document.getElementById('recaptcha-container')) {
        const container = document.createElement('div');
        container.id = 'recaptcha-container';
        document.body.appendChild(container);
        recaptchaContainerRef.current = container;
    } else {
        recaptchaContainerRef.current = document.getElementById('recaptcha-container') as HTMLDivElement;
    }

    // Initialize RecaptchaVerifier
    if (firebaseAuthService && recaptchaContainerRef.current && !appVerifierRef.current) {
        appVerifierRef.current = new RecaptchaVerifier(firebaseAuthService, recaptchaContainerRef.current, {
            'size': 'invisible',
            'callback': (response: any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                // This callback is for invisible reCAPTCHA.
            },
            'expired-callback': () => {
                // Response expired. Ask user to solve reCAPTCHA again.
                toast({ title: "reCAPTCHA Expired", description: "Please try sending OTP again.", variant: "destructive"});
                if (appVerifierRef.current) {
                    appVerifierRef.current.render().then((widgetId) => {
                        if (typeof grecaptcha !== 'undefined' && grecaptcha.reset) {
                           grecaptcha.reset(widgetId);
                        }
                    });
                }
            }
        });
    }
    
    return () => { // Cleanup on unmount
        if (appVerifierRef.current) {
            appVerifierRef.current.clear(); // Clears the reCAPTCHA widget
            appVerifierRef.current = null;
        }
        if (recaptchaContainerRef.current && recaptchaContainerRef.current.id === 'recaptcha-container' && document.body.contains(recaptchaContainerRef.current)) {
            // Only remove if it's the one we dynamically created and it still exists
            // document.body.removeChild(recaptchaContainerRef.current); 
            // Keep it for subsequent attempts for now. Firebase might manage its lifecycle better.
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseAuthService]);


  const onEmailSignIn: SubmitHandler<EmailFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await signInWithEmail(data.email, data.password);
      // AuthProvider's onAuthStateChanged will handle success
    } catch (error) {
      // Toast is handled in AuthContext, but form can show specific errors too
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEmailSignUp: SubmitHandler<EmailFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await signUpWithEmail(data.email, data.password);
    } catch (error) {
      // Toast handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onPhoneSignIn: SubmitHandler<PhoneFormData> = async (data) => {
    setIsSubmitting(true);
    if (!appVerifierRef.current) {
        toast({title: "Error", description: "reCAPTCHA verifier not initialized. Please refresh.", variant: "destructive"});
        setIsSubmitting(false);
        return;
    }
    try {
      await initiateSignInWithPhoneNumber(data.phoneNumber, appVerifierRef.current);
      setShowOtpInput(true);
    } catch (error) {
      // Toast handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOtpVerify: SubmitHandler<OtpFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await confirmOtp(data.otp);
    } catch (error) {
      // Toast handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Candy Chat AI</CardTitle>
          <CardDescription>Sign in or sign up to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Button onClick={signInWithGoogle} variant="outline" className="w-full" disabled={isSubmitting || loading}>
              { (isSubmitting || loading) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon /> } Sign in with Google
            </Button>
            <Button onClick={signInWithFacebook} variant="outline" className="w-full" disabled={isSubmitting || loading}>
              { (isSubmitting || loading) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FacebookIcon /> } Sign in with Facebook
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="space-y-4 pt-4">
              <form onSubmit={handleEmailSubmit(onEmailSignIn)} className="space-y-4">
                <div>
                  <Label htmlFor="email-signin">Email</Label>
                  <Input id="email-signin" type="email" {...registerEmail("email")} placeholder="m@example.com" disabled={isSubmitting}/>
                  {emailErrors.email && <p className="text-xs text-destructive mt-1">{emailErrors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="password-signin">Password</Label>
                  <Input id="password-signin" type="password" {...registerEmail("password")} disabled={isSubmitting}/>
                  {emailErrors.password && <p className="text-xs text-destructive mt-1">{emailErrors.password.message}</p>}
                </div>
                <div className="flex gap-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                        {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                    <Button type="button" variant="outline" onClick={handleEmailSubmit(onEmailSignUp)} className="w-full" disabled={isSubmitting || loading}>
                        {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign Up
                    </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="phone" className="space-y-4 pt-4">
              {!showOtpInput ? (
                <form onSubmit={handlePhoneSubmit(onPhoneSignIn)} className="space-y-4">
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" type="tel" {...registerPhone("phoneNumber")} placeholder="+16505551234" disabled={isSubmitting} />
                    {phoneErrors.phoneNumber && <p className="text-xs text-destructive mt-1">{phoneErrors.phoneNumber.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                    {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send OTP
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit(onOtpVerify)} className="space-y-4">
                  <div>
                    <Label htmlFor="otp">OTP Code</Label>
                    <Input id="otp" type="text" {...registerOtp("otp")} placeholder="123456" maxLength={6} disabled={isSubmitting} />
                     {otpErrors.otp && <p className="text-xs text-destructive mt-1">{otpErrors.otp.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                     {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify OTP & Sign In
                  </Button>
                   <Button variant="link" size="sm" onClick={() => { setShowOtpInput(false); setConfirmationResult(null);}} className="w-full" disabled={isSubmitting}>
                    Change Phone Number
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
          <div id="recaptcha-container-explicit" style={{ marginTop: '10px' }}></div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
            <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
            </div>
          <Button onClick={signInAsGuest} variant="ghost" className="w-full text-muted-foreground hover:text-foreground" disabled={isSubmitting || loading}>
            Continue as Guest
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
