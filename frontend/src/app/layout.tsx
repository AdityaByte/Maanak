import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maanak",
  description: "Landing Page for Maanak",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        {/* If you have a shared Navbar/Header component, place it here */}
        <main className="flex-grow">
          {children}
        </main>
        {/* If you have a shared Footer component, place it here */}
      </body>
    </html>
  );
}
