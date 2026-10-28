import type { Metadata } from "next";
import { Suspense } from "react"; // <-- Import Suspense di sini
import { Inter } from "next/font/google";
import Footer from "./components/layout/Footer";
import Navbar from "@/app/components/layout/Navbar";
import NavbarSkeleton from "@/app/components/layout/NavbarSkeleton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veal Lab. | Creative's ",
  description: "Unconventional creation.",
};

// Menggunakan Inter (Karakter clean, profesional, ala Marketplace Envato)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans antialiased bg-veal-bg text-veal-dark">
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}