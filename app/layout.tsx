import type { Metadata } from "next";

import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: "My First Web",
  description: "Next.js App Router로 만든 개인 블로그입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={cn("font-sans")}>
      <body>
        <AuthProvider>
          <Navigation />
          <main className="mx-auto max-w-4xl space-y-6 p-6">{children}</main>
          <footer className="mx-auto max-w-4xl px-6 py-6 text-sm text-muted-foreground">
            © 2026 My First Web
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
