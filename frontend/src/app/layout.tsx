import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

import Sidebar from "./components/Sidebar";
import Drawer from "./components/Drawer";
import TopNavbar from "./components/TopNavbar";
import ReduxProvider from "./components/ReduxProvider";
import ThemeInit from "./components/ThemeInit";

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
    <html
      lang="en"
      className={`h-full ${plusJakartaSans.variable}`}
    >
      <body
        className={`${plusJakartaSans.className} h-screen overflow-hidden bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary`}
      >
        <ThemeInit />
        <ReduxProvider>
          {/* Mobile: flex-col (Drawer bar on top, main below). Desktop: flex-row (sidebar + main side-by-side) */}
          <div className="flex flex-col md:flex-row h-full overflow-hidden">

            {/* Fixed Desktop Sidebar — hidden on mobile */}
            <aside className="hidden h-full w-[260px] shrink-0 border-r border-border bg-card md:flex">
              <Sidebar />
            </aside>

            {/* Mobile Drawer (sticky top bar + slide-in panel) */}
            <Drawer />

            {/* Main Content Viewport */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
                {/* Sticky Top Navbar — desktop only (Drawer has its own top bar on mobile) */}
                <div className="hidden md:block">
                  <TopNavbar />
                </div>

                {/* Scrollable Page Body */}
                <div className="px-4 sm:px-6 lg:px-8 pb-12">
                  {children}
                </div>
              </main>
            </div>

          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}