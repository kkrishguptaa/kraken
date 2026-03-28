import type { Metadata } from "next";
import { Cormorant_Garamond, Crimson_Text } from "next/font/google";
import "@/globals.css";
import "@uiw/react-md-editor/markdown-editor.css";

export const dynamic = "force-dynamic";

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-editorial-display",
  subsets: ["latin"],
  display: "swap",
});

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
      className={`${cormorantGaramond.variable} ${crimsonText.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
