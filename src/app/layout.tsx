import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "PriceCart - Compare Montreal Grocery Prices",
  description: "Find the cheapest grocery prices across Maxi, Metro, Provigo, and Super C in Montreal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}