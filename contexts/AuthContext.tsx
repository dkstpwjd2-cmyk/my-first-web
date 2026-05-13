"use client";

/**
 * contexts/AuthContext.tsx
 * 앱 전역 로그인 상태를 공유하는 AuthProvider + useAuth Hook.
 * - supabase.auth.getUser()로 초기 세션 확인
 * - supabase.auth.onAuthStateChange()로 로그인/로그아웃 실시간 감지
 * - useEffect cleanup에서 subscription.unsubscribe() 호출
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import {
  signInWithEmail as authSignIn,
  signUpWithEmail as authSignUp,
  signOut as authSignOut,
} from "@/lib/auth";

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

    // 초기 세션 확인
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    // 로그인/로그아웃 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // cleanup: 이벤트 리스너 해제
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

/** 로그인 상태에 접근하는 Hook. AuthProvider 내부에서만 사용 가능. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }
  return ctx;
}
