import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// import Sidebar from "@/components/Sidebar";
// import TopRightNav from "@/components/TopRightNav";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maanak - AI Powered BIS Recommendation Engine",
  description: "Smart Search. Accurate Standards. Better Decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#f8fafc] text-slate-800 antialiased`}
      >
        <div className="flex h-screen w-full gap-6 overflow-hidden p-4">

          {/* Sidebar */}
          {/* <aside className="h-full w-64 shrink-0">
            <Sidebar />
          </aside> */}

          {/* Main area */}
          <div className="relative flex h-full flex-1 flex-col overflow-y-auto">

            {/* Top right navigation */}
            {/* <div className="absolute right-4 top-2 z-20">
              <TopRightNav />
            </div> */}

            {/* Current page */}
            <main className="flex-1 px-4 pb-8 pt-12">
              {children}
            </main>

          </div>
        </div>
      </body>
    </html>
  );
}
