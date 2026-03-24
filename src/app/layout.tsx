import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kraken News",
  description: "A newspaper-aesthetic newsletter platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
        <body className="antialiased bg-[#F9F6F0] text-[#1A1A1A] font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
