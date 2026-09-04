// app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Drawer from "./components/Drawer";
import TopNavbar from "./components/TopNavbar";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maanak - AI Powered BIS Recommendation Engine",
  description: "Smarter Search. Accurate Standards. Better Decisions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${plusJakartaSans.variable}`}>
      <body
        className={`${plusJakartaSans.className} flex h-screen overflow-hidden bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary`}
      >
        {/* Fixed Desktop Sidebar */}
        <aside className="hidden h-full w-[268px] shrink-0 border-r border-border bg-card md:flex">
          <Sidebar />
        </aside>

        {/* Mobile Drawer */}
        <Drawer />

        {/* Main Content Viewport — the ONLY scrolling container */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
            {/* Sticky Header */}
            <TopNavbar />

            {/* Scrollable Page Body */}
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-14 pt-2">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}