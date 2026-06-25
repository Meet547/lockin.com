import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LOCKIN — Remove distractions. Build momentum.",
  description:
    "LOCKIN is a focus operating system. Block distractions, build deep work habits, and finish what matters.",
  keywords: [
    "LOCKIN",
    "focus",
    "deep work",
    "productivity",
    "website blocker",
    "chrome extension",
    "attention",
  ],
  authors: [{ name: "LOCKIN" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "LOCKIN — Remove distractions. Build momentum.",
    description:
      "Block distractions. Build deep work habits. Finish what matters.",
    siteName: "LOCKIN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOCKIN — Remove distractions. Build momentum.",
    description:
      "Block distractions. Build deep work habits. Finish what matters.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${mono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
