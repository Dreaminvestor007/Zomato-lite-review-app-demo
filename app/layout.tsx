import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Zomato Lite | Ludhiana Burrito",
  description: "Write and read reviews for Ludhiana Burrito.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
