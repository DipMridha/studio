
"use client";

import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase"; // Your Firebase auth instance

// Define the shape of your user object if you want to customize it
// For now, we'll use FirebaseUser directly or null
type User = FirebaseUser | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  // signUpWithEmail: (email: string, pass: string) => Promise<void>; // Add if needed
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

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Placeholder sign-in functions
  // TODO: Implement actual Firebase sign-in logic here
  const signInWithGoogle = async () => {
    setLoading(true);
    console.log("Attempting Google Sign-In (Placeholder)...");
    // Example:
    // try {
    //   const provider = new GoogleAuthProvider();
    //   await signInWithPopup(auth, provider);
    // } catch (error) {
    //   console.error("Google Sign-In Error:", error);
    // } finally {
    //   // setLoading(false); // onAuthStateChanged will handle this
    // }
    alert("Google Sign-In: Implement Firebase logic.");
    setLoading(false); // Simulate end of loading if no onAuthStateChanged trigger
  };

  const signInWithFacebook = async () => {
    setLoading(true);
    console.log("Attempting Facebook Sign-In (Placeholder)...");
    // Example:
    // try {
    //   const provider = new FacebookAuthProvider();
    //   await signInWithPopup(auth, provider);
    // } catch (error) {
    //   console.error("Facebook Sign-In Error:", error);
    // } finally {
    //   // setLoading(false);
    // }
    alert("Facebook Sign-In: Implement Firebase logic.");
    setLoading(false);
  };
  
  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    console.log(`Attempting Email Sign-In for ${email} (Placeholder)...`);
    // Example:
    // try {
    //    await signInWithEmailAndPassword(auth, email, pass);
    // } catch (error) {
    //   console.error("Email Sign-In Error:", error);
    // } finally {
    //  // setLoading(false);
    // }
    alert("Email Sign-In: Implement Firebase logic.");
    setLoading(false);
  };


  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      // setUser(null) will be handled by onAuthStateChanged
    } catch (error) {
      console.error("Sign Out Error:", error);
      setLoading(false); // Ensure loading state is reset on error
    }
    // setLoading(false) will be handled by onAuthStateChanged
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
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
