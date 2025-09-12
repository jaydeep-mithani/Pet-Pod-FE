import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { FloatingNavbar } from "@/components";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pet Pod - Giving Pets a Second Chance at Life",
  description:
    "A community-driven platform dedicated to giving pets a second chance at life. We connect loving animals with responsible, caring owners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FloatingNavbar />
        {children}
      </body>
    </html>
  );
}
