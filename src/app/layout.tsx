import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Updates",
  description: "Daily team progress updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <nav className="bg-[#012265] shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="text-xl font-bold text-[#d3af37]">
                      Team Updates
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      href="/"
                      className="border-transparent text-white hover:border-[#d3af37] hover:text-[#d3af37] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                    >
                      Home
                    </Link>
                    <Link
                      href="/admin"
                      className="border-transparent text-white hover:border-[#d3af37] hover:text-[#d3af37] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                    >
                      Admin
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
