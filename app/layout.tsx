import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "AccuBook",
  description: "Accouting app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased`}>
        <div className="h-screen grid grid-rows-[auto_1fr]">{children}</div>
      </body>
    </html>
  );
}
