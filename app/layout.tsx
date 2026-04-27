import type { Metadata } from "next";

import Navigation from "@/components/Navigation";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "My First Web",
  description: "Next.js App Router로 만든 포스트 웹페이지입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body>
        <Navigation />
        <main className="mx-auto max-w-4xl space-y-6 p-6">{children}</main>
        <footer className="mx-auto max-w-4xl px-6 py-6 text-sm text-[var(--muted-foreground)]">
          © 2026 My First Web
        </footer>
      </body>
    </html>
  );
}
