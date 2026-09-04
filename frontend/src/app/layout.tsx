import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

import Sidebar from "./components/Sidebar";
import Drawer from "./components/Drawer";
import TopNavbar from "./components/TopNavbar";
import ReduxProvider from "./components/ReduxProvider";

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
        className={`${plusJakartaSans.className} flex h-screen overflow-hidden bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary`}
      >
        <ReduxProvider>
          {/* Fixed Desktop Sidebar */}
          <aside className="hidden h-full w-[260px] shrink-0 border-r border-slate-200/60 bg-white md:flex">
            <Sidebar />
          </aside>

          {/* Mobile Drawer */}
          <Drawer />

          {/* Main Content Viewport */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
              {/* Sticky Header */}
              <TopNavbar />

              {/* Scrollable Page Body */}
              <div className="px-8 pb-12">
                {children}
              </div>
            </main>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}