import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "TenOnly — Graded Pokémon Card Marketplace",
    template: "%s | TenOnly",
  },
  description: "Buy, sell, and trade authenticated graded Pokémon cards. PSA, BGS, CGC, and SGC certified. Trusted by collectors worldwide.",
  keywords: ["Pokemon cards", "PSA", "BGS", "graded cards", "Charizard", "1st edition", "marketplace"],
  openGraph: {
    title: "TenOnly — Graded Pokémon Card Marketplace",
    description: "The premier marketplace for graded Pokémon cards.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
