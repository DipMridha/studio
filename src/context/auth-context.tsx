
"use client";

import type { ConfirmationResult, RecaptchaVerifier, User, UserCredential } from "firebase/auth";
import { onAuthStateChanged, signInWithPhoneNumber as firebaseSignInWithPhoneNumber, signOut as firebaseSignOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { GUEST_STATUS_KEY } from "@/lib/constants";

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: React.Dispatch<React.SetStateAction<ConfirmationResult | null>>;
  signInWithPhoneNumber: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  confirmOtp: (otp: string) => Promise<UserCredential | undefined>; // Can be undefined if confirmationResult is null
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    const storedGuestStatus = localStorage.getItem(GUEST_STATUS_KEY);
    if (storedGuestStatus === "true") {
      setIsGuest(true);
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setIsGuest(false); // If Firebase user exists, not a guest
        localStorage.removeItem(GUEST_STATUS_KEY);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithPhoneNumber = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
    setLoading(true);
    try {
      const result = await firebaseSignInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setLoading(false);
      return result;
    } catch (error) {
      console.error("Error during phone number sign-in:", error);
      setLoading(false);
      throw error; // Re-throw to be caught by the form
    }
  };

  const confirmOtp = async (otp: string): Promise<UserCredential | undefined> => {
    if (!confirmationResult) {
      console.error("No confirmation result available to confirm OTP.");
      throw new Error("Verification process was not initiated correctly.");
    }
    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(otp);
      // User is signed in. onAuthStateChanged will handle setUser.
      setLoading(false);
      return userCredential;
    } catch (error) {
      console.error("Error confirming OTP:", error);
      setLoading(false);
      throw error;
    }
  };

  const signInAsGuest = () => {
    setUser(null); // Ensure no Firebase user
    setIsGuest(true);
    localStorage.setItem(GUEST_STATUS_KEY, "true");
    setLoading(false); // Explicitly set loading to false as onAuthStateChanged might not fire for this
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user to null
      setIsGuest(false);
      localStorage.removeItem(GUEST_STATUS_KEY);
      setConfirmationResult(null);
    } catch (error) {
      console.error("Sign Out Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        loading,
        confirmationResult,
        setConfirmationResult,
        signInWithPhoneNumber,
        confirmOtp,
        signInAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
