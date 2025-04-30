import type React from "react";
import { Sidebar, SidebarProvider } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Smart Delivery Management System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <TopNavAndContent>{children}</TopNavAndContent>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

function TopNavAndContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col transition-all duration-200 ease-in-out">
      <TopNav />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
