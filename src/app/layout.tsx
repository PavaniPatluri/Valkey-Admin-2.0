import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { CopilotPanel } from "@/components/copilot-panel";
import { LiveBackground } from "@/components/live-background";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Valkey Admin NextGen",
  description: "AI-powered administration and observability platform for developers and SRE teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
          <div className="flex h-screen overflow-hidden bg-transparent text-foreground relative">
            <LiveBackground />
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden relative z-10">
              <TopNav />
              <main className="flex flex-1 flex-col overflow-y-auto bg-transparent relative">
                {children}
              </main>
            </div>
          </div>
          <CopilotPanel />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
