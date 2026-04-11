import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "數位雜誌作品集 | Digital Portfolio",
  description: "A digital magazine style portfolio featuring code, fashion, and music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${playfair.variable} ${inter.variable} antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-[#F9F9F8] dark:bg-stone-950 text-stone-900 dark:text-stone-100 min-h-screen flex flex-col transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
