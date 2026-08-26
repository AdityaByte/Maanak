import "./globals.css";
import Sidebar from "./components/Sidebar";
import Drawer from "./components/Drawer";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="flex h-screen flex-col overflow-hidden md:flex-row">
        {/* Desktop sidebar */}
        <div className="hidden h-full w-[272px] shrink-0 md:flex md:border-r md:border-border">
          <Sidebar />
        </div>

        {/* Mobile drawer */}
        <Drawer />

        {/* Main content */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}