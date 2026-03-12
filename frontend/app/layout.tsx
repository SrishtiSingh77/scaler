import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Scaler Cal",
  description: "Cal.com-style scheduling platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="neo-header">
          <div className="neo-logo">Scaler Cal</div>
          <nav className="neo-nav">
            <Link href="/" className="neo-nav-link">
              Home
            </Link>
            <Link href="/people" className="neo-nav-link">
              People
            </Link>
            <Link href="/events" className="neo-nav-link">
              Events
            </Link>
            <Link href="/dashboard" className="neo-nav-link">
              Dashboard
            </Link>
            <Link href="/bookings" className="neo-nav-link">
              Bookings
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
