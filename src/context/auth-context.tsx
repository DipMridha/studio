
"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type User,
  type ConfirmationResult
} from 'firebase/auth';
import { auth as firebaseAuthService } from '@/lib/firebase'; // Ensure this is the initialized auth service
import { useToast } from '@/hooks/use-toast';
import { GUEST_STATUS_KEY } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: (result: ConfirmationResult | null) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  initiateSignInWithPhoneNumber: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<void>;
  confirmOtp: (otp: string) => Promise<void>;
  signInAsGuest: () => void;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedGuestStatus = localStorage.getItem(GUEST_STATUS_KEY);
    if (storedGuestStatus === 'true') {
      setIsGuest(true);
    }
    setLoading(true); // Start loading true until auth state is confirmed
    const unsubscribe = onAuthStateChanged(firebaseAuthService, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setIsGuest(false); // If logged in, not a guest
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
      // onAuthStateChanged will handle setting user
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

  const initiateSignInWithPhoneNumber = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(firebaseAuthService, phoneNumber, appVerifier);
      setConfirmationResult(result);
      toast({ title: "OTP Sent", description: "Please check your phone for the OTP." });
    } catch (error: any) {
      console.error("Phone Sign-In Error (Send OTP):", error);
      toast({ title: "Phone Sign-In Failed", description: error.message, variant: "destructive" });
      setLoading(false);
      throw error; // Re-throw
    }
    // setLoading will be handled by onAuthStateChanged or confirmOtp
  };

  const confirmOtp = async (otp: string) => {
    if (!confirmationResult) {
      toast({ title: "Error", description: "No OTP confirmation to verify.", variant: "destructive"});
      throw new Error("No OTP confirmation to verify.");
    }
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      // onAuthStateChanged will handle user state
    } catch (error: any) {
      console.error("OTP Confirmation Error:", error);
      toast({ title: "OTP Confirmation Failed", description: error.message, variant: "destructive" });
      setLoading(false);
      throw error; // Re-throw
    }
  };

  const signInAsGuest = () => {
    if (user) { // Should not happen if UI logic is correct
        firebaseSignOut(firebaseAuthService);
        setUser(null);
    }
    setIsGuest(true);
    localStorage.setItem(GUEST_STATUS_KEY, 'true');
    setLoading(false); 
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(firebaseAuthService);
      setUser(null);
      setIsGuest(false);
      localStorage.removeItem(GUEST_STATUS_KEY);
      setConfirmationResult(null);
    } catch (error: any) {
      console.error("Sign Out Error:", error);
      toast({ title: "Sign Out Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        isGuest, 
        loading, 
        confirmationResult, 
        setConfirmationResult,
        signInWithGoogle, 
        signInWithFacebook,
        signInWithEmail,
        signUpWithEmail,
        initiateSignInWithPhoneNumber,
        confirmOtp,
        signInAsGuest, 
        signOutUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
