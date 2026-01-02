"use client";

import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Method from "@/components/sections/Method";
import Services from "@/components/sections/Services";
import CaseStudies from "@/components/sections/CaseStudies";
import ScrollHandler from "@/components/ui/ScrollHandler";
import { useIsDesktop } from "@/lib/useIsDesktop";
import { MobileProblemList } from "@/components/sections/mobile/MobileProblemList";
import { MobileMethodSteps } from "@/components/sections/mobile/MobileMethodSteps";
import { MobileServicesStack } from "@/components/sections/mobile/MobileServicesStack";

const MOBILE_PROBLEMS = [
  { id: 1, label: "Temps perdu", description: "Des heures gaspillées sur des tâches répétitives." },
  { id: 2, label: "Complexité", description: "Une stack technique devenue ingérable." },
  { id: 3, label: "Déshumanisation", description: "L'humain s'efface derrière les process." },
  { id: 4, label: "Coûts cachés", description: "Abonnements et maintenance qui s'accumulent." },
  { id: 5, label: "Stress", description: "La peur constante que tout casse." },
  { id: 6, label: "Stagnation", description: "Votre croissance plafonne malgré vos efforts." },
];

const MOBILE_STEPS = [
  {
    title: "Immersion",
    description: "On prend la température : marque, marché, concurrents, pour comprendre ce qui vous rend unique."
  },
  {
    title: "Architecture",
    description: "On structure le parcours pour guider l'utilisateur jusqu'à l'action, sans friction."
  },
  {
    title: "Exécution",
    description: "Livraison rapide, code propre, chaque feature sert une conversion ou une automatisation."
  }
];

const MOBILE_SERVICES = [
  {
    id: 1,
    subtitle: "MODULE 01 // WEB",
    title: "Expérience Web",
    description: "Une interface immersive, performante et unique.",
    features: [
      "Design sur-mesure",
      "Animations fluides",
      "Optimisation performance & SEO"
    ],
  },
  {
    id: 2,
    subtitle: "MODULE 02 // AUTOMATION",
    title: "Le Réseau",
    description: "Connecter vos outils, automatiser et monitorer sans effort.",
    features: [
      "Intégrations multi-plateformes",
      "Workflows 24/7",
      "Alertes temps réel"
    ],
  },
  {
    id: 3,
    subtitle: "MODULE 03 // BRAND",
    title: "Identité de Marque",
    description: "Un univers visuel cohérent et mémorable, du logo aux guidelines.",
    features: [
      "Logo & charte graphique",
      "Univers visuel unique",
      "Guidelines complètes"
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
            Le problème
          </div>
          <h2 className="text-2xl font-clash font-semibold mt-3">
            Tu travailles trop, ton système pas assez.
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            On repère ce qui bloque, on automatise ce qui se répète, on garde l’humain.
          </p>
        </div>
        <MobileProblemList problems={MOBILE_PROBLEMS} />
      </section>

      {/* METHOD */}
      <section className="px-4 py-10 bg-[#0c0c0c] rounded-t-3xl border-t border-white/5">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] text-white/80 uppercase tracking-wider">
            Notre méthode
          </div>
          <h2 className="text-2xl font-clash font-semibold mt-3">
            L’art de la structure
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Trois étapes, zéro friction.
          </p>
        </div>
        <MobileMethodSteps steps={MOBILE_STEPS} />
      </section>

      {/* SERVICES */}
      <section className="px-4 py-10">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] text-white/80 uppercase tracking-wider">
            Nos artefacts
          </div>
          <h2 className="text-2xl font-clash font-semibold mt-3">
            L’armurerie
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Web, automation, brand : on équipe ce qui compte.
          </p>
        </div>
        <MobileServicesStack services={MOBILE_SERVICES} />
      </section>

      {/* CASE STUDIES (Bento d'origine) */}
      <CaseStudies compact />

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
