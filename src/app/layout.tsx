import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { RightPanel } from "@/components/layout/RightPanel";
import Providers from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QBook | The Quantum Social Graph",
  description: "Connected. Always.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <div className="min-h-screen flex justify-center max-w-[1300px] mx-auto">
            {/* Left Sidebar */}
            <header className="hidden md:flex w-[275px] shrink-0 sticky top-0 h-screen overflow-y-auto">
              <Sidebar />
            </header>

            {/* Main Feed (Children) */}
            <main className="flex-1 max-w-[600px] w-full border-x border-card-border min-h-screen">
              {children}
            </main>

            {/* Right Panel */}
            <aside className="hidden lg:flex w-[350px] shrink-0 sticky top-0 h-screen overflow-y-auto">
              <RightPanel />
            </aside>
          </div>
        </Providers>
      </body>
    </html>
  );
}
