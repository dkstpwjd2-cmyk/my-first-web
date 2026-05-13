/**
 * lib/auth.ts
 * Supabase 인증 래퍼 함수 모음.
 * - signInWithPassword 사용 (구버전 auth.signIn() 사용 금지)
 * - 에러는 숨기지 않고 호출한 컴포넌트가 처리할 수 있게 반환
 */
import { createClient } from "@/lib/supabase/client";

/** 이메일/비밀번호 로그인 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/** 이메일/비밀번호 회원가입 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  return { data, error };
}

/** 로그아웃 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}
