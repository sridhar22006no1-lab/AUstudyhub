import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: "AU Study Hub — Anna University Question Papers, Notes & Syllabus",
  description:
    "Independent educational discovery platform for Anna University engineering students in Tamil Nadu. Easily find previous year question papers, subject lecture notes, and official syllabus documents across R2021, R2017, and R2023.",
  keywords: [
    "Anna University Question Papers",
    "Anna University Notes",
    "AU Syllabus",
    "R2021 Anna University",
    "CS3251 Question Paper",
    "MA3151 Notes",
    "Tamil Nadu Engineering Study Hub",
  ],
  authors: [{ name: "AU Study Hub Contributors" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
