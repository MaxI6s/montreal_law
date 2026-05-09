import { Inter, Merriweather } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/layout/TopNav";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NegoContract - Hackathon Demo",
  description: "AI-powered contract negotiation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased font-sans flex flex-col h-screen overflow-hidden`}
      >
        <TopNav />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
