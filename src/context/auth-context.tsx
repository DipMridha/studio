
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
      // TODO: Uncomment and complete Firebase integration
      // await signInWithPopup(auth, provider);
      // On successful sign-in, onAuthStateChanged will update user state
      alert("Google Sign-In: Firebase signInWithPopup logic needs to be implemented here."); 
      console.log("Attempting Google Sign-In (Placeholder)... Call signInWithPopup here.");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert(`Google Sign-In Error: ${error instanceof Error ? error.message : String(error)}`);
      setLoading(false); // Reset loading on error if not handled by onAuthStateChanged
    }
    // setLoading(false) is typically handled by onAuthStateChanged,
    // but ensure it's reset if the process fails before triggering onAuthStateChanged.
  };

  const signInWithFacebook = async () => {
    setLoading(true);
    try {
      const provider = new FacebookAuthProvider();
      // TODO: Uncomment and complete Firebase integration
      // await signInWithPopup(auth, provider);
      // On successful sign-in, onAuthStateChanged will update user state
      alert("Facebook Sign-In: Firebase signInWithPopup logic needs to be implemented here.");
      console.log("Attempting Facebook Sign-In (Placeholder)... Call signInWithPopup here.");
    } catch (error) {
      console.error("Facebook Sign-In Error:", error);
      alert(`Facebook Sign-In Error: ${error instanceof Error ? error.message : String(error)}`);
      setLoading(false);
    }
  };
  
  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      // TODO: Uncomment and complete Firebase integration
      // await signInWithEmailAndPassword(auth, email, pass);
      // On successful sign-in, onAuthStateChanged will update user state
      alert("Email Sign-In: Firebase signInWithEmailAndPassword logic needs to be implemented here.");
      console.log(`Attempting Email Sign-In for ${email} (Placeholder)... Call signInWithEmailAndPassword here.`);
    } catch (error) {
      console.error("Email Sign-In Error:", error);
      alert(`Email Sign-In Error: ${error instanceof Error ? error.message : String(error)}`);
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      // TODO: Uncomment and complete Firebase integration
      // await createUserWithEmailAndPassword(auth, email, pass);
      // On successful sign-up, onAuthStateChanged will update user state (typically auto-signs in)
      alert("Email Sign-Up: Firebase createUserWithEmailAndPassword logic needs to be implemented here.");
      console.log(`Attempting Email Sign-Up for ${email} (Placeholder)... Call createUserWithEmailAndPassword here.`);
    } catch (error) {
      console.error("Email Sign-Up Error:", error);
      alert(`Email Sign-Up Error: ${error instanceof Error ? error.message : String(error)}`);
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut(); // auth.signOut() is correct
      // setUser(null) will be handled by onAuthStateChanged
    } catch (error) {
      console.error("Sign Out Error:", error);
      alert(`Sign Out Error: ${error instanceof Error ? error.message : String(error)}`);
      setLoading(false); 
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
