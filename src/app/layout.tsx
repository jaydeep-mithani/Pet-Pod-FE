import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { FloatingNavbar, VibeLayer } from "@/components";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/constants";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ChatProvider } from "@/lib/chat/ChatProvider";
import { MotionThemeProvider } from "@/lib/motion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Serif display face used by the Calm vibe's heading typography
// (applied via the html.vibe-calm CSS theme layer).
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

// Techy display face used by the Bold vibe's heading typography
// (applied via the html.vibe-bold CSS theme layer).
const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <MotionThemeProvider>
          <AuthProvider>
            <ChatProvider>
              <FloatingNavbar />
              <VibeLayer />
              {children}
              <Toaster position="top-center" richColors closeButton />
            </ChatProvider>
          </AuthProvider>
        </MotionThemeProvider>
      </body>
    </html>
  );
}
