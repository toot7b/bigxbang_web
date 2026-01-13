"use client";

import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Method from "@/components/sections/Method";
import Services from "@/components/sections/Services";
import CaseStudies from "@/components/sections/CaseStudies";
import Tools from "@/components/sections/Tools";
import Manifesto from "@/components/sections/Manifesto";
import ScrollHandler from "@/components/ui/ScrollHandler";
import { useIsDesktop } from "@/lib/useIsDesktop";
import { MobileProblemList } from "@/components/sections/mobile/MobileProblemList";
import { MobileMethodSteps } from "@/components/sections/mobile/MobileMethodSteps";
import { MobileServicesStack } from "@/components/sections/mobile/MobileServicesStack";
import { MobileManifesto } from "@/components/sections/mobile/MobileManifesto";

const MOBILE_PROBLEMS = [
  { id: 1, label: "Le Décalage", description: "Une identité visuelle en dessous de la qualité réelle de vos services." },
  { id: 2, label: "La Surcharge", description: "Votre expertise est noyée sous des tâches répétitives à faible valeur." },
  { id: 3, label: "L'Invisibilité", description: "Être excellent dans son métier, mais rester le secret le mieux gardé du marché." },
  { id: 4, label: "La Fragilité", description: "Un business qui repose entièrement sur votre présence et votre mémoire." },
  { id: 5, label: "La Friction", description: "Des outils et un site qui compliquent l'expérience client au lieu de la fluidifier." },
  { id: 6, label: "Le Plafond", description: "Une croissance bloquée, non par manque de talent, mais par saturation technique." },
];

const MOBILE_STEPS = [
  {
    title: "Le Diagnostic",
    description: "Avant de construire, il faut comprendre. Nous disséquons votre activité pour isoler les racines du problème, bien au-delà du simple symptôme visible."
  },
  {
    title: "La Conception",
    description: "Rien n'est laissé à l'improvisation. Nous dessinons les plans complets de votre système : logiques techniques, parcours utilisateurs et structure de l'information."
  },
  {
    title: "La Fabrication",
    description: "La phase de production pure. Un développement sur-mesure, sans dette technique, où chaque détail est testé pour garantir robustesse et fluidité."
  }
];

const MOBILE_SERVICES = [
  {
    id: 1,
    subtitle: "MODULE 01 // WEB",
    title: "Expérience Web",
    description: "Le web n'est pas du papier. Oubliez les vitrines statiques. Nous concevons des interfaces immersives et réactives, taillées pour marquer les esprits. Pas juste pour afficher de l'information.",
    features: [
      "Design sans template",
      "Interactions soignées",
      "Performance & SEO"
    ],
  },
  {
    id: 2,
    subtitle: "MODULE 02 // TECH",
    title: "Solutions Techniques",
    description: "Les logiciels du marché ne font pas tout. Pour le reste, nous créons la réponse technique à vos contraintes.",
    features: [
      "Développement sur-mesure",
      "Connexions entre outils",
      "Systèmes autonomes"
    ],
  },
  {
    id: 3,
    subtitle: "MODULE 03 // BRAND",
    title: "Stratégie de Marque",
    description: "On ne code pas le flou. La puissance technique est vaine si le message est brouillé. Nous définissons votre singularité et votre discours pour que chaque interaction serve une intention claire.",
    features: [
      "Positionnement marché",
      "Identité visuelle",
      "Ton & Discours"
    ],
  }
];

const MOBILE_CASES = [
  {
    title: "Onboarding Automation",
    tag: "Ops / Stripe / Notion",
    desc: "Zero-touch onboarding : paiement, provisioning, docs."
  },
  {
    title: "Magnetic Website",
    tag: "Web / UX",
    desc: "Un site qui attire et convertit, pensé pour l'action."
  },
  {
    title: "Smart Newsletter",
    tag: "IA / Contenu",
    desc: "La newsletter qui s'écrit (presque) toute seule."
  },
  {
    title: "Prospection B2B",
    tag: "Automation / Data",
    desc: "7h de tâches répétitives réduites à 47 minutes."
  },
];

function DesktopLanding() {
  return (
    <main className="bg-black min-h-screen">
      <Suspense fallback={null}>
        <ScrollHandler />
      </Suspense>
      <Navbar />
      <Hero />
      <Problem />
      <Method />
      <Services />
      <CaseStudies />
      <Tools />
      <Manifesto />
    </main>
  );
}

function MobileLanding() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />

      {/* PROBLEM */}
      <section className="px-4 py-10">
        <div className="mb-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] text-white/80 uppercase tracking-wider">
            Le Problème
          </div>
          <h2 className="text-2xl font-clash font-semibold mt-3">
            Entre ce que vous valez et ce que vous montrez, il y a un monde.
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            C'est là que s'efface l'exceptionnel. Vos outils et votre image doivent être à la hauteur de votre expertise.
          </p>
        </div>
        <MobileProblemList problems={MOBILE_PROBLEMS} />
      </section>

      {/* METHOD */}
      <section className="px-4 py-10 bg-[#0c0c0c] rounded-t-3xl border-t border-white/5">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] text-white/80 uppercase tracking-wider">
            La Méthode
          </div>
          <h2 className="text-2xl font-clash font-semibold mt-3">
            L’art de la structure
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            On ne décore pas le vide. Chaque pixel et chaque ligne de code ont une fonction précise.
          </p>
        </div>
        <MobileMethodSteps steps={MOBILE_STEPS} />
      </section>

      {/* SERVICES */}
      <section className="relative z-20 px-4 py-10 bg-black rounded-b-[40px]">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] text-white/80 uppercase tracking-wider">
            Les Services
          </div>
          <h2 className="text-2xl font-clash font-semibold mt-3">
            Le Triptyque Fondamental
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Nous ne sommes pas une agence 360°. Nous sommes spécialistes de trois domaines critiques qui ne devraient jamais être traités séparément.
          </p>
        </div>
        <MobileServicesStack services={MOBILE_SERVICES} />
      </section>

      {/* CASE STUDIES (Bento d'origine) */}
      <CaseStudies compact />

      {/* TOOLS */}
      <Tools />

      {/* MANIFESTO Mobile */}
      <MobileManifesto />

      {/* CTA */}
      <section id="contact" className="px-4 py-12">
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 text-center">
          <h3 className="text-xl font-clash font-semibold mb-3">
            On automatise pour toi ?
          </h3>
          <p className="text-sm text-gray-300 mb-5">
            Un call de 20 minutes pour voir ce qui débloque le plus vite.
          </p>
          <a
            className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-white text-black font-semibold text-sm"
            href="https://calendar.app.google/qk7pa13Mu3fP3ex16"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book un créneau
          </a>
        </div>
      </section>
    </main>
  );
}

export default function PageSwitch() {
  const isDesktop = useIsDesktop(1024, true);
  return isDesktop ? <DesktopLanding /> : <MobileLanding />;
}
