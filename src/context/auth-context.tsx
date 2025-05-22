
"use client";

import type { User as FirebaseUser } from "firebase/auth";
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  // signOut as firebaseSignOut // Renamed to avoid conflict
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase"; // Your Firebase auth instance

type User = FirebaseUser | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>; 
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // On successful sign-in, onAuthStateChanged will update user state & loading
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setLoading(false); // Reset loading on error
      // Re-throw the error so the calling component (LoginForm) can catch it and show a toast
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    setLoading(true);
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      // On successful sign-in, onAuthStateChanged will update user state & loading
    } catch (error) {
      console.error("Facebook Sign-In Error:", error);
      setLoading(false); // Reset loading on error
      throw error;
    }
  };
  
  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // On successful sign-in, onAuthStateChanged will update user state & loading
    } catch (error) {
      console.error("Email Sign-In Error:", error);
      setLoading(false); // Reset loading on error
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      // On successful sign-up, onAuthStateChanged will update user state (typically auto-signs in) & loading
    } catch (error) {
      console.error("Email Sign-Up Error:", error);
      setLoading(false); // Reset loading on error
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut(); // auth.signOut() is correct
      // setUser(null) and setLoading(false) will be handled by onAuthStateChanged
    } catch (error) {
      console.error("Sign Out Error:", error);
      setLoading(false); 
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

