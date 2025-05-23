
"use client";

import type { User } from "firebase/auth";
import {
  getAuth,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier, // Important for phone auth
  // PhoneAuthProvider, // Also used with phone auth
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { app, auth as firebaseAuthService } from "@/lib/firebase"; // Use the initialized auth
import { GUEST_STATUS_KEY } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithPhoneNumber: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<any>; // Returns ConfirmationResult
  verifyOtp: (confirmationResult: any, otp: string) => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  setupRecaptcha: (elementId: string) => RecaptchaVerifier | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for guest status in localStorage
    const guestStatus = localStorage.getItem(GUEST_STATUS_KEY);
    if (guestStatus === "true") {
      setIsGuest(true);
    }

    const unsubscribe = onAuthStateChanged(firebaseAuthService, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(false); // If user logs in, they are no longer a guest
        localStorage.removeItem(GUEST_STATUS_KEY);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(firebaseAuthService, provider);
      // onAuthStateChanged will handle setting user and loading state
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast({ title: "Google Sign-In Failed", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    setLoading(true);
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(firebaseAuthService, provider);
    } catch (error: any) {
      console.error("Facebook Sign-In Error:", error);
      toast({ title: "Facebook Sign-In Failed", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(firebaseAuthService, email, pass);
    } catch (error: any) {
      console.error("Email Sign-Up Error:", error);
      toast({ title: "Email Sign-Up Failed", description: error.message, variant: "destructive" });
      setLoading(false);
      throw error; // Re-throw to be caught by form
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(firebaseAuthService, email, pass);
    } catch (error: any) {
      console.error("Email Sign-In Error:", error);
      toast({ title: "Email Sign-In Failed", description: error.message, variant: "destructive" });
      setLoading(false);
      throw error; // Re-throw to be caught by form
    }
  };
  
  const setupRecaptcha = (elementId: string) => {
    if (typeof window !== 'undefined') {
        try {
            // Ensure the element exists before creating RecaptchaVerifier
            if (!document.getElementById(elementId)) {
                console.error(`RecaptchaVerifier element with id '${elementId}' not found.`);
                return null;
            }
            // window.recaptchaVerifier is a common pattern for global access if needed, but it's better to return it.
            return new RecaptchaVerifier(firebaseAuthService, elementId, {
                'size': 'invisible', // Can be 'normal' or 'compact' if you want visible reCAPTCHA
                'callback': (response: any) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    console.log("reCAPTCHA solved:", response);
                },
                'expired-callback': () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                    toast({ title: "reCAPTCHA Expired", description: "Please try sending the OTP again.", variant: "destructive"});
                }
            });
        } catch (error: any) {
            console.error("Error setting up RecaptchaVerifier:", error);
            toast({ title: "reCAPTCHA Error", description: `Failed to initialize reCAPTCHA: ${error.message}`, variant: "destructive"});
            return null;
        }
    }
    return null;
  };


  const signInWithPhoneNumber = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
    setLoading(true);
    try {
      const confirmationResult = await signInWithPhoneNumber(firebaseAuthService, phoneNumber, appVerifier);
      // SMS sent. User can now type in the code.
      // Returns confirmationResult to be used for verifying OTP.
      setLoading(false);
      return confirmationResult;
    } catch (error: any) {
      console.error("Phone Sign-In Error (sending OTP):", error);
      toast({ title: "Phone Sign-In Failed", description: `Error sending OTP: ${error.message}`, variant: "destructive" });
      setLoading(false);
      // It's important to reset reCAPTCHA here if it was rendered by signInWithPhoneNumber
      // For invisible reCAPTCHA, this might mean re-rendering the verifier or handling it based on error codes.
      if (appVerifier && (window as any).grecaptcha) {
        try {
            (window as any).grecaptcha.reset(appVerifier.widgetId);
        } catch (resetError) {
            console.warn("Could not reset reCAPTCHA after error:", resetError);
        }
      }
      throw error;
    }
  };

  const verifyOtp = async (confirmationResult: any, otp: string) => {
    setLoading(true);
    try {
        await confirmationResult.confirm(otp);
        // User signed in successfully. onAuthStateChanged will handle the rest.
        // setLoading(false) will be handled by onAuthStateChanged
    } catch (error: any) {
        console.error("OTP Verification Error:", error);
        toast({ title: "OTP Verification Failed", description: error.message, variant: "destructive" });
        setLoading(false);
        throw error;
    }
  };


  const signInAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem(GUEST_STATUS_KEY, "true");
    setUser(null); // Ensure no Firebase user is active
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(firebaseAuthService);
    } catch (error: any) {
      console.error("Sign Out Error:", error);
      toast({ title: "Sign Out Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsGuest(false);
      localStorage.removeItem(GUEST_STATUS_KEY);
      setUser(null); // Ensure user state is cleared
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        signInWithGoogle,
        signInWithFacebook,
        signUpWithEmail,
        signInWithEmail,
        signInWithPhoneNumber,
        verifyOtp,
        signInAsGuest,
        signOut,
        setupRecaptcha
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
