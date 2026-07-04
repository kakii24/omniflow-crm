// app/page.tsx — Root Composition (RSC)
// HeroSection and FeaturesSection use 'use client' for Framer Motion;
// page.tsx itself remains a Server Component — Next.js handles this automatically.

import Navbar from "@/app/components/Navbar";
import HeroSection from "@/app/components/HeroSection";
import FeaturesSection from "@/app/components/FeaturesSection";
import Footer from "@/app/components/Footer";

export default function HomePage() {
  return (
    <>
      {/* Accessibility: skip to main content */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:rounded-full focus:text-white"
        style={{ background: "#0071E3" }}
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex flex-col flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>

      <Footer />
    </>
  );
}
