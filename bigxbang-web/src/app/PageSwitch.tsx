"use client";

import { Suspense, useState, useEffect } from "react";
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
import { motion } from "framer-motion";
import MinimalFooter from "@/components/ui/MinimalFooter";
import { GradientButton } from "@/components/ui/gradient-button";
import { MobileMethodSteps } from "@/components/sections/mobile/MobileMethodSteps";
import { MobileServicesStack } from "@/components/sections/mobile/MobileServicesStack";
import { MobileManifesto } from "@/components/sections/mobile/MobileManifesto";
import Link from "next/link";

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
    subtitle: "WEB",
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
    subtitle: "TECH",
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
    subtitle: "BRAND",
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
      <Suspense fallback={null}>
        <ScrollHandler />
      </Suspense>
      <Hero />

      {/* PROBLEM */}
      <section id="probleme" className="px-4 pb-10 scroll-mt-[90px]">
        <MobileProblemList problems={MOBILE_PROBLEMS} />
      </section>

      {/* METHOD */}
      <section id="methode" className="w-full scroll-mt-[90px]">
        <MobileMethodSteps steps={MOBILE_STEPS} />
      </section>

      {/* SERVICES */}
      <section id="services" className="w-full scroll-mt-[90px]">
        <MobileServicesStack services={MOBILE_SERVICES} />
      </section>

      {/* CASE STUDIES (Bento d'origine) */}
      <section id="case-studies" className="scroll-mt-[90px]">
        <CaseStudies compact />
      </section>

      {/* TOOLS */}
      <Tools />

      {/* MANIFESTO Mobile */}
      <section id="manifesto" className="scroll-mt-[90px]">
        <MobileManifesto />
      </section>

      {/* CTA - Desktop Style */}
      <motion.section
        id="contact"
        className="px-4 py-12 mt-0"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="p-6 rounded-3xl border border-[#306EE8] bg-[#306EE8]/10 shadow-[0_0_40px_rgba(48,110,232,0.2)] text-center">
          <h3 className="text-xl font-clash font-semibold mb-3 text-white">
            Assez parlé du futur.
          </h3>
          <p className="text-sm text-zinc-200 mb-5">
            Vous avez la vision. Nous avons l'arsenal. Il est temps de connecter les deux.
          </p>
          <Link href="/rendez-vous">
            <GradientButton theme="dark" hoverText="On y va ?">
              Lancer mon projet
            </GradientButton>
          </Link>
        </div>
      </motion.section>

      {/* FOOTER */}
      <MinimalFooter visible={true} iconClassName="w-6 h-6" className="pb-12" />
    </main>
  );
}

export default function PageSwitch() {
  const [mounted, setMounted] = useState(false);
  const isDesktop = useIsDesktop(1024, true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="bg-black min-h-screen" />;
  }

  return isDesktop ? <DesktopLanding /> : <MobileLanding />;
}
