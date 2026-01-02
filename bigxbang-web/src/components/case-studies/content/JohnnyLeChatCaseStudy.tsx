"use client";

import React from "react";
import Image from "next/image";

// Layout
import { CaseStudyLayout, Section, SectionHeader } from "@/components/case-studies/CaseStudyLayout";

// UI Components
import { CodeWindow, InfoBox, SectionTitle, Paragraph, BulletList, Strong } from "@/components/case-studies";
import { IconBox, TechItem } from "@/components/case-studies/IconBox";

// Lottie Icons
import LightBulbIcon from "@/../public/icons/Light bulb.json";
import RocketIcon from "@/../public/icons/Rocket.json";
import CodeIcon from "@/../public/icons/Code.json";
import SuccessIcon from "@/../public/icons/Success.json";
import TargetIcon from "@/../public/icons/Target.json";
import VideoIcon from "@/../public/icons/Web design.json";
import MagicIcon from "@/../public/icons/AI.json";

// Page metadata
const META = {
    slug: "johnny-le-chat",
    title: "Johnny Le Chat : Créer une mascotte vivante avec l'IA",
    subtitle: "Comment on est passé d'une idée à une mascotte animée intégrée en vidéo transparente sans animateur 3D et pour 0€ de budget.",
    badge: "Creative Tech",
    metrics: [
        { number: "0€", label: "Budget production" },
        { number: "4h", label: "Temps de création" },
        { number: "100%", label: "Open Source Tools" },
        { number: "∞", label: "Mignonnance" },
    ]
};

interface JohnnyLeChatProps {
    mode?: 'page' | 'modal';
    onClose?: () => void;
}

export default function JohnnyLeChatCaseStudy({ mode = 'page', onClose }: JohnnyLeChatProps) {
    return (
        <CaseStudyLayout meta={META} mode={mode} onClose={onClose}>

            {/* LE CONTEXTE */}
            <Section withBorder={false}>
                <SectionHeader icon={<IconBox animation={LightBulbIcon} />}>
                    Le contexte : un besoin de mignonnerie
                </SectionHeader>

                <Paragraph>
                    Pour notre nouvelle offre, on voulait sortir du corporatistme froid. On voulait une mascotte. Quelque chose de <Strong>rose, doux, style "bonbon"</Strong>, qui donne envie de faire des câlins à son écran.
                </Paragraph>

                <Paragraph>
                    Problème : on n'est pas Pixar. On n'a pas 50k€ de budget ni 3 mois devant nous. On a juste des idées et une bonne maîtrise des outils IA.
                </Paragraph>

                <InfoBox title="Le défi">
                    Créer une mascotte animée de qualité studio, l'intégrer sur le web en transparent, le tout sans ouvrir de logiciel 3D complexe une seule fois.
                </InfoBox>
            </Section>

            {/* PHASE 1 : GEN AI */}
            <Section>
                <SectionHeader icon={<IconBox animation={MagicIcon} />}>
                    Phase 1 : La naissance de Johnny (Design & IA)
                </SectionHeader>

                <SectionTitle>1. Valider le chara-design</SectionTitle>
                <Paragraph>
                    Avant de foncer, il fallait trouver LE look. On a utilisé <Strong>Gemini</Strong> et <Strong>Nano Banana</Strong> pour itérer rapidement. On cherchait un chat "fluffy", rose pastel, avec de grands yeux expressifs. Pas juste un chat, mais une peluche vivante.
                </Paragraph>

                <div className="my-8 rounded-xl overflow-hidden border border-white/10 relative group">
                    <Image
                        src="/case-studies/johnny/gemini_conversation.png"
                        alt="Conversation Gemini"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">Plusieurs itérations pour trouver le dosage parfait de "kawaï".</p>
                </div>

                <SectionTitle>2. Upscale pour la qualité</SectionTitle>
                <Paragraph>
                    Les images générées sont cool mais la résolution est souvent limite pour du web HD. On a passé notre image finale dans <Strong>Upscayl</Strong> (Open Source).
                </Paragraph>

                <InfoBox title="C'est quoi l'Open Source ?">
                    C'est comme une recette de cuisine publique. Au lieu de garder le secret de fabrication, on donne la liste des ingrédients et les étapes de préparation à tout le monde. N'importe qui peut l'utiliser, l'améliorer ou apprendre avec. C'est le partage de connaissance gratuit.
                </InfoBox>

                <InfoBox title="Pourquoi Upscayl ?">
                    C'est gratuit, ça tourne en local, et ça invente des détails de texture (poils, reflets) que l'image de base n'avait même pas. Indispensable pour le réalisme.
                </InfoBox>

                <div className="my-8 rounded-xl overflow-hidden border border-white/10 relative">
                    <Image
                        src="/case-studies/johnny/upscayl_ui.png"
                        alt="Interface Upscayl"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">Upscayl en action : on récupère du piqué et du détail.</p>
                </div>

                <SectionTitle>3. Donner vie avec Gemini Veo</SectionTitle>
                <Paragraph>
                    Une image, c'est bien. Un chat qui bouge, c'est mieux. On a envoyé notre image haute définition à <Strong>Gemini Veo</Strong> (l'IA vidéo de Google) avec une instruction simple : "Fais-le nous saluer de la patte". Contrainte de temps : on voulait une vidéo tout de suite, pas y passer 3 jours.
                </Paragraph>

                <div className="my-8 rounded-xl overflow-hidden border border-white/10 relative">
                    <Image
                        src="/case-studies/johnny/veo_generation.png"
                        alt="Génération Gemini Veo"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">Johnny prend vie. C'est magique.</p>
                </div>
            </Section>

            {/* PHASE 2 : LAB TECHNIQUE */}
            <Section>
                <SectionHeader icon={<IconBox animation={RocketIcon} />}>
                    Phase 2 : Le lab technique (Upscale Vidéo)
                </SectionHeader>

                <Paragraph>
                    La vidéo sortie de Veo était sympa, mais un peu "baveuse" (artefacts de compression). Pour un site premium, c'est non. Il fallait l'upscaler.
                </Paragraph>

                <Paragraph>
                    <Strong>Problème :</Strong> Nos MacBooks aiment pas trop rendre de la 4K IA.
                    <br />
                    <Strong>Solution :</Strong> Le Cloud (gratuit).
                </Paragraph>

                <Paragraph>
                    On a utilisé <Strong>Google Colab</Strong> pour faire tourner <Strong>Video2X</Strong>. C'est un script Python qui utilise des GPU distants (merci Google) pour upscaler la vidéo sans faire fondre notre carte graphique.
                </Paragraph>

                <CodeWindow title="Video2X on Colab">
                    {`!pip install video2x
# On connecte le Drive pour récupérer la vidéo et sauvegarder le résultat
from google.colab import drive
drive.mount('/content/drive')

!python -m video2x -i "/content/drive/MyDrive/johnny_raw.mp4" -o "/content/drive/MyDrive/johnny_4k.mp4" -m waifu2x-caffe`}
                </CodeWindow>

                <div className="my-8 rounded-xl overflow-hidden border border-white/10 relative">
                    <Image
                        src="/case-studies/johnny/colab_video2x.png"
                        alt="Script Colab Video2X"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">On délègue le calcul lourd au cloud.</p>
                </div>
            </Section>

            {/* PHASE 3 : POST PROD */}
            <Section>
                <SectionHeader icon={<IconBox animation={VideoIcon} />}>
                    Phase 3 : Post-Prod (After Effects)
                </SectionHeader>

                <Paragraph>
                    On a une vidéo 4K. Maintenant, il faut la rendre utilisable sur le web.
                </Paragraph>

                <SectionTitle>1. Créer la boucle parfaite</SectionTitle>
                <Paragraph>
                    Une vidéo de site web doit looper sans coupure visible. On a coupé le rush pour garder le meilleur moment, puis on l'a dupliqué et <Strong>inversé (reverse)</Strong>.
                </Paragraph>

                <BulletList items={[
                    "A : Johnny lève la patte",
                    "A' : Johnny baisse la patte (A en reverse)",
                    "Résultat : A + A' = Boucle infinie fluide."
                ]} />

                <div className="my-8 rounded-xl overflow-hidden border border-white/10 relative">
                    <Image
                        src="/case-studies/johnny/ae_timeline_loop.png"
                        alt="Timeline After Effects Loop"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">La technique du "Boomerang" pour un loop parfait.</p>
                </div>

                <SectionTitle>2. Le détourage (Le hack du masque)</SectionTitle>
                <Paragraph>
                    On voulait Johnny sur fond transparent. Roto Brush (l'outil de détourage auto) galérait avec les poils (trop de détails). Ça clignotait, c'était moche.
                </Paragraph>

                <Paragraph>
                    <Strong>L'astuce :</Strong> Au lieu de s'acharner à détourer poil par poil, on a appliqué un masque ellipse avec un fort contour progressif (feather). On garde le centre net, et on fond les bords doucement vers la transparence. Sur le site, ça donne l'impression qu'il est "posé" dans l'ambiance.
                </Paragraph>

                <div className="my-8 rounded-xl overflow-hidden border border-white/10 relative">
                    <Image
                        src="/case-studies/johnny/ae_masking.png"
                        alt="Masquage After Effects"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">Parfois, un bon fondu vaut mieux qu'un mauvais détourage.</p>
                </div>
            </Section>


            {/* PHASE 4 : INTE ET RESULTAT */}
            <Section>
                <SectionHeader icon={<IconBox animation={CodeIcon} />}>
                    Phase 4 : Intégration Web (ffmpeg & Code)
                </SectionHeader>

                <Paragraph>
                    Export final en ProRes depuis AE. Trop lourd (200Mo). On sort <Strong>ffmpeg</Strong> (le couteau suisse de la vidéo) pour convertir en WebM transparent optimisé.
                </Paragraph>

                <CodeWindow title="Terminal">
                    {`ffmpeg -i johnny_master.mov -c:v libvpx-vp9 -b:v 1M -auto-alt-ref 0 johnny_web.webm`}
                </CodeWindow>

                <Paragraph className="mt-6">
                    Pour l'intégration React, on a soigné les détails :
                </Paragraph>
                <BulletList items={[
                    "Titre incurvé SVG pour suivre l'arc-en-ciel",
                    "Bouton 'Nuage' avec effet glassmorphism",
                    "Ombre portée dynamique pour ancrer Johnny au sol",
                    "Responsive design pour qu'il soit aussi mignon sur mobile que sur desktop"
                ]} />

                <div className="my-8 grid md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-3 rounded-xl overflow-hidden border border-white/10">
                        <Image
                            src="/case-studies/johnny/final_result_desktop.png"
                            alt="Résultat Final Desktop"
                            width={1920}
                            height={1080}
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="md:col-span-1 rounded-xl overflow-hidden border border-white/10">
                        <Image
                            src="/case-studies/johnny/final_result_mobile.png"
                            alt="Résultat Final Mobile"
                            width={1080}
                            height={1920}
                            className="w-full h-auto"
                        />
                    </div>
                    <p className="col-span-full text-center text-zinc-400 text-sm italic mt-2">Le résultat final sur Desktop et Mobile : fluide, léger, vivant.</p>
                </div>
            </Section>

            {/* CONCLUSION ROI */}
            <Section>
                <SectionHeader icon={<IconBox animation={SuccessIcon} />}>
                    Pourquoi c'est smart (Le ROI)
                </SectionHeader>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-[#FF9F9F]/10 to-[#FF9F9F]/5 border border-white/5 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#FF9F9F]/30">
                        <div className="text-4xl md:text-5xl font-bold font-clash bg-gradient-to-br from-[#FF9F9F] to-[#FF9F9F]/60 bg-clip-text text-transparent mb-3">4h</div>
                        <div className="text-white/60 font-medium">Temps de prod</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#FF9F9F]/10 to-[#FF9F9F]/5 border border-white/5 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#FF9F9F]/30">
                        <div className="text-4xl md:text-5xl font-bold font-clash bg-gradient-to-br from-[#FF9F9F] to-[#FF9F9F]/60 bg-clip-text text-transparent mb-3">0€</div>
                        <div className="text-white/60 font-medium">Coût outils</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#FF9F9F]/10 to-[#FF9F9F]/5 border border-white/5 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#FF9F9F]/30">
                        <div className="text-4xl md:text-5xl font-bold font-clash bg-gradient-to-br from-[#FF9F9F] to-[#FF9F9F]/60 bg-clip-text text-transparent mb-3">♥</div>
                        <div className="text-white/60 font-medium">Love Brand</div>
                    </div>
                </div>

                <SectionTitle>Pourquoi ce n'est pas juste un GIF ?</SectionTitle>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <Strong>1. Du 100% Sur-Mesure</Strong>
                        <p className="text-zinc-400 mt-2 text-sm">
                            Ce n'est pas une animation stock. C'est VOTRE mascotte, avec vos couleurs, votre vibe. Elle est unique et devient un actif de marque propriétaire.
                        </p>
                    </div>
                    <div>
                        <Strong>2. L'Expertise Technique</Strong>
                        <p className="text-zinc-400 mt-2 text-sm">
                            Avoir de bons outils ne suffit pas, il faut savoir s'en servir. On s'occupe de toute la "mécanique" invisible (optimisation, poids, transparence) pour que votre mascotte s'affiche instantanément sur tous les écrans, sans jamais ralentir votre site.
                        </p>
                    </div>
                </div>

                <InfoBox title="La leçon business">
                    La technique (IA, code, cloud) n'est qu'un levier. Ce qui compte, c'est l'émotion qu'on crée. On a produit un asset de valeur (une mascotte animée) sans les contraintes habituelles (temps, argent). C'est ça, l'agilité BigXBang.
                </InfoBox>
            </Section>

            {/* OPEN SOURCE RELEASE */}
            <Section>
                <SectionHeader icon={<IconBox animation={CodeIcon} />}>
                    C'est cadeau (Open Source)
                </SectionHeader>

                <Paragraph>
                    Comme on a utilisé plein d'outils Open Source, on voulait rendre la pareille. Le code complet de cette page ainsi que les images et vidéos sont disponibles sur notre GitHub.
                </Paragraph>

                <Paragraph>
                    C'est notre façon de boucler la boucle : on a profité du travail de la communauté, alors on redonne à notre tour. Servez-vous, décortiquez, copiez-collez. C'est fait pour.
                </Paragraph>

                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
                    <a
                        href="/johnny-le-chat"
                        target="_blank"
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95"
                    >
                        <span>Voir la page en live</span>
                        <span className="opacity-60">→</span>
                    </a>

                    <a
                        href="https://github.com/toot7b/johnny-le-chat"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white rounded-full font-bold text-lg transition-all hover:bg-white/10 hover:border-white/40 active:scale-95"
                    >
                        <span className="opacity-80">Le code sur Github</span>
                        <span className="opacity-60">↗</span>
                    </a>
                </div>

            </Section>

        </CaseStudyLayout>
    );
}
