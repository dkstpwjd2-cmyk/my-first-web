"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import {
  signInWithEmail as authSignIn,
  signOut as authSignOut,
  signUpWithEmail as authSignUp,
} from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await authSignIn(email, password);
    return { error: error as Error | null };
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string
  ) => {
    const { error } = await authSignUp(email, password, name);
    return { error: error as Error | null };
  };

  const signOut = async () => {
    const { error } = await authSignOut();
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithEmail, signUpWithEmail, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }
  return ctx;
}
