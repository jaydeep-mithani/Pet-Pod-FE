import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { FloatingNavbar } from "@/components";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/constants";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ChatProvider } from "@/lib/chat/ChatProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ChatProvider>
            <FloatingNavbar />
            {children}
            <Toaster position="top-center" richColors closeButton />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
