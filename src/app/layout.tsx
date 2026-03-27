import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Crimson_Text,
  Geist,
  Geist_Mono,
  Inter,
} from "next/font/google";
import "@/globals.css";
import { useAuthenticated } from "@/hooks/authenticated";
import { getSession } from "@/hooks/session";
import { useOnboarded } from "@/hooks/onboarded";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// UI font for controls and chrome
const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

// Editorial serif for display text (masthead, large headlines)
const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-editorial-display",
  subsets: ["latin"],
  display: "swap",
});

// Editorial serif for body text and smaller headlines
const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-editorial-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kraken — Your Regular Updates, Delivered",
  description:
    "Write regular updates to your friends. Daily, weekly, monthly, or custom — your choice when to publish.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${cormorantGaramond.variable} ${crimsonText.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
