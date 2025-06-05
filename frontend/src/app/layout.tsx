import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Website Cloner | Clone Any Website with AI",
  description: "Transform any website into clean, responsive code with the power of advanced AI. Create pixel-perfect clones in seconds.",
  keywords: ["AI", "website cloner", "web scraping", "code generation", "responsive design"],
  authors: [{ name: "AI Website Cloner" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d946ef",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-dark-950 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
