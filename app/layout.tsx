import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OmniFlow CRM — Enterprise Multi-Tenant Operations Platform",
  description:
    "OmniFlow CRM delivers row-level tenant isolation, real-time financial dashboards, and precision inventory management — engineered for enterprise B2B scale.",
  keywords: ["CRM", "Enterprise", "Multi-Tenant", "B2B", "Financial Dashboard", "Inventory Management"],
  openGraph: {
    title: "OmniFlow CRM — Enterprise Operations Platform",
    description: "Row-level security, financial intelligence, and inventory control for enterprise scale.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#1D1D1F]">
        {children}
      </body>
    </html>
  );
}
