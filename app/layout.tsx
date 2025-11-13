import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { uploadRouter } from "./api/uploadthing/core";
import { CartProvider } from "./context/cart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenGoblin Collectibles",
  description:
    "Colecții, figurine și comics pentru pasionații universului GreenGoblin.",
  metadataBase: new URL("https://greengoblin.local"),
  openGraph: {
    title: "GreenGoblin Collectibles",
    description:
      "Descoperă figurine, comics și colecții exclusive pentru fanii GreenGoblin.",
    url: "https://greengoblin.local",
    siteName: "GreenGoblin",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 bg-gradient-to-b from-white via-white to-emerald-50/40">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
