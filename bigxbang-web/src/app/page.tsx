import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Method from "@/components/sections/Method";
import Services from "@/components/sections/Services";
import CaseStudies from "@/components/sections/CaseStudies";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <Method />
      <Services />
      <CaseStudies />
    </main>
  );
}
