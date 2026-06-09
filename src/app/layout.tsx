import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shewstone",
  description: "Band practice app",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <header className="border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-6">
            <a href="/" className="text-lg font-semibold tracking-tight">
              Shewstone
            </a>
            <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
              <a href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                Songs
              </a>
              <a href="/setlists" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                Setlists
              </a>
            </div>
          </nav>
        </header>
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
