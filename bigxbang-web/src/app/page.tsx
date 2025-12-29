import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Method from "@/components/sections/Method";
import Services from "@/components/sections/Services";
import CaseStudies from "@/components/sections/CaseStudies";
import ScrollHandler from "@/components/ui/ScrollHandler";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      {/* ScrollHandler for navigation from case studies */}
      <Suspense fallback={null}>
        <ScrollHandler />
      </Suspense>
      <Navbar />
      <Hero />
      <Problem />
      <Method />
      <Services />
      <CaseStudies />
    </main>
  );
}
