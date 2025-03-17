import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { HelpButton } from "@/components/help-button";

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
        <div>
          {children}
          <HelpButton />
        </div>
        <Toaster closeButton />
      </body>
    </html>
  );
}
