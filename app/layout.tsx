import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import localFont from "next/font/local";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Contact from "../components/ContactForm";


import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NCVS Crime Analysis",
  description: "Analyze crime data with filters and visualizations",
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
        <Header />
        {children}
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
