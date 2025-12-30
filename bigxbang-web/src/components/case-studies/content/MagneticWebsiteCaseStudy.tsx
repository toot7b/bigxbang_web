"use client";

import React from "react";
import Image from "next/image";
import { CaseStudyLayout, Section, SectionHeader } from "@/components/case-studies/CaseStudyLayout";
import { CodeWindow, InfoBox, SectionTitle, Paragraph, BulletList, Strong } from "@/components/case-studies";
import { IconBox } from "@/components/case-studies/IconBox";

// Lottie Icons
import LightBulbIcon from "@/../public/icons/Light bulb.json";
import TargetIcon from "@/../public/icons/Target.json";
import CodeIcon from "@/../public/icons/Code.json";
import SuccessIcon from "@/../public/icons/Success.json";
import BrainIcon from "@/../public/icons/Brain.json";
import RocketIcon from "@/../public/icons/Rocket.json";

// Page metadata
const META = {
    slug: "magnetic-website",
    title: "MagneticWebsite : quand un site web devient une expérience",
    subtitle: "Comment on transforme un visiteur passif en explorateur actif. Et pourquoi ça change tout pour ton business.",
    metrics: [
        { number: "4x", label: "Temps passé sur la page" },
        { number: "+65%", label: "Taux d'engagement" },
        { number: "0", label: "Scroll passif" },
        { number: "100%", label: "Mémorable" },
    ]
};

interface MagneticWebsiteProps {
    mode?: 'page' | 'modal';
    onClose?: () => void;
}

export default function MagneticWebsiteCaseStudy({ mode = 'page', onClose }: MagneticWebsiteProps) {
    return (
        <CaseStudyLayout meta={META} mode={mode} onClose={onClose}>

            {/* LE PROBLÈME */}
            <Section withBorder={false}>
                <SectionHeader icon={<IconBox animation={LightBulbIcon} />}>
                    Le problème : personne ne reste sur ton site
                </SectionHeader>

                <Paragraph>
                    <Strong>54 secondes.</Strong> C&apos;est le temps moyen qu&apos;un visiteur passe sur une page web. 54 secondes pour comprendre ton offre, te faire confiance, et décider de rester. Spoiler : la plupart partent avant.
                </Paragraph>

                <Paragraph>
                    Le problème, ce n&apos;est pas ton contenu. C&apos;est l&apos;expérience. Un site classique, c&apos;est un document qu&apos;on scroll. L&apos;utilisateur est <Strong>spectateur passif</Strong>. Il défile, survole, et oublie.
                </Paragraph>

                <div className="my-8 rounded-xl overflow-hidden border border-white/10">
                    <Image
                        src="/case-studies/magnetic-website/Screenshot1.png"
                        alt="Ancien site web - Avant BigXBang"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">Le web moderne : joli, mais oubliable en 54 secondes.</p>
                </div>

                <InfoBox title="Le vrai enjeu pour ton business">
                    Tu paies pour amener des visiteurs (SEO, pubs, réseaux). Mais si ton site les fait partir en 54 secondes, tu jettes de l&apos;argent par la fenêtre. <Strong>L&apos;attention est devenue la ressource la plus rare.</Strong> Il faut la mériter.
                </InfoBox>
            </Section>

            {/* LA SOLUTION */}
            <Section>
                <SectionHeader icon={<IconBox animation={TargetIcon} />}>
                    Notre approche : transformer le visiteur en explorateur
                </SectionHeader>

                <Paragraph>
                    Et si, au lieu de montrer un site fini, on le faisait <Strong>construire sous les yeux du visiteur</Strong> ?
                </Paragraph>

                <Paragraph>
                    L&apos;idée est simple : chaque élément de la page (le menu, le texte, les images) apparaît progressivement. Mais pas tout seul. <Strong>C&apos;est le visiteur qui le déclenche.</Strong> Il clique, il explore, il découvre. Il n&apos;est plus spectateur. Il devient acteur.
                </Paragraph>

                <SectionTitle>Pourquoi ça marche ?</SectionTitle>

                <BulletList items={[
                    <><Strong>Le cerveau adore le mouvement intentionnel.</Strong> Quand quelque chose bouge en réponse à TON action, tu es captivé. C&apos;est un réflexe biologique.</>,
                    <><Strong>La récompense crée l&apos;addiction.</Strong> Chaque clic déclenche une animation satisfaisante. Le cerveau veut continuer.</>,
                    <><Strong>L&apos;effort crée la valeur.</Strong> Ce qu&apos;on construit soi-même, on s&apos;en souvient. Effet IKEA appliqué au web.</>,
                ]} />

                <div className="my-8 rounded-xl overflow-hidden border border-white/10">
                    <Image
                        src="/case-studies/magnetic-website/Screenshot2.png"
                        alt="MagneticWebsite état initial - 4 nœuds"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">4 points cliquables. 4 parties du site à débloquer. L&apos;utilisateur devient explorateur.</p>
                </div>

                <InfoBox title="Ce que ça change pour toi">
                    Au lieu de prier pour que le visiteur scroll jusqu&apos;à ton bouton d&apos;action, <Strong>tu crées un chemin qu&apos;il VEUT suivre</Strong>. Il ne part pas parce qu&apos;il est curieux de voir ce qui va apparaître ensuite.
                </InfoBox>
            </Section>

            {/* LA MAGIE DE L'APPARITION */}
            <Section>
                <SectionHeader icon={<IconBox animation={RocketIcon} />}>
                    L&apos;effet &quot;construction sous tes yeux&quot;
                </SectionHeader>

                <Paragraph>
                    Quand le visiteur clique sur un point, l&apos;élément correspondant ne &quot;pop&quot; pas d&apos;un coup. Il <Strong>se construit pixel par pixel</Strong>, comme s&apos;il se matérialisait devant toi. C&apos;est plus lent qu&apos;une apparition classique. Et c&apos;est fait exprès.
                </Paragraph>

                <SectionTitle>Pourquoi c&apos;est important</SectionTitle>

                <Paragraph>
                    Une apparition instantanée, ça passe inaperçu. Une construction progressive, <Strong>ça captive le regard</Strong>. Le cerveau suit le mouvement, anticipe la suite, reste concentré. C&apos;est 500 millisecondes de plus où le visiteur regarde TON contenu.
                </Paragraph>

                <div className="my-8 rounded-xl overflow-hidden border border-white/10">
                    <Image
                        src="/case-studies/magnetic-website/animation.gif"
                        alt="Animation de construction d'un élément"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                        unoptimized
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">500 millisecondes de magie. L&apos;élément se matérialise sous les yeux.</p>
                </div>

                <SectionTitle>Comment ça marche (version simple)</SectionTitle>

                <Paragraph>
                    En coulisses, on superpose deux couches :
                </Paragraph>

                <BulletList items={[
                    "D'abord, une nuée de particules bleues apparaît (le 'chantier')",
                    "Ensuite, le contenu réel 'balaye' de gauche à droite et remplace les particules",
                    "Résultat : l'élément semble se solidifier devant toi",
                ]} />

                <CodeWindow title="PixelReveal.tsx (extrait)">
                    {`// Le composant PixelReveal : fait apparaître un élément "pixel par pixel"

import React, { useState, useEffect } from 'react';
import DottedGlowBackground from './DottedGlowBackground'; // Un composant pour les particules

interface PixelRevealProps {
    children: React.ReactNode;
    revealed: boolean; // Vrai quand l'élément doit apparaître
    delay?: number;    // Délai avant le début de l'animation
}

const PixelReveal: React.FC<PixelRevealProps> = ({ children, revealed, delay = 0 }) => {
    // 3 états possibles : caché, en construction, révélé
    const [status, setStatus] = useState<'hidden' | 'constructing' | 'revealed'>('hidden');

    useEffect(() => {
        if (revealed) {
            // Étape 1 : Les particules apparaissent après le délai
            const t1 = setTimeout(() => setStatus('constructing'), delay);
            
            // Étape 2 : Le contenu se révèle 500ms plus tard
            const t2 = setTimeout(() => setStatus('revealed'), delay + 500);
            
            return () => { clearTimeout(t1); clearTimeout(t2); };
        } else {
            // Si l'élément n'est plus "revealed", on le cache
            setStatus('hidden');
        }
    }, [revealed, delay]);

    return (
        <div className="relative">
            {/* Le contenu réel : apparaît de gauche à droite */}
            <div 
                className="transition-all duration-500 ease-out" // Animation douce
                style={{
                    clipPath: status === 'revealed' 
                        ? 'inset(0 0 0 0)'      // Entièrement visible
                        : 'inset(0 100% 0 0)'   // Caché (masqué par la droite)
                }}
            >
                {children}
            </div>

            {/* Les particules : disparaissent quand le contenu arrive */}
            <div 
                className="absolute inset-0 transition-all duration-500 ease-out" // Animation douce
                style={{
                    clipPath: status === 'revealed' 
                        ? 'inset(0 0 0 100%)'   // Disparues (vers la gauche)
                        : 'inset(0 0 0 0)'      // Visibles
                }}
            >
                {status === 'constructing' && <DottedGlowBackground color="#00A3FF" />}
            </div>
        </div>
    );
};

export default PixelReveal;`}
                </CodeWindow>

                <InfoBox title="L'effet psychologique">
                    Ce n&apos;est pas juste &quot;joli&quot;. C&apos;est de la <Strong>gamification invisible</Strong>. Le visiteur ne sait pas qu&apos;il joue, mais son cerveau libère de la dopamine à chaque découverte. Il veut continuer.
                </InfoBox>
            </Section>

            {/* L'EXPLOSION VISUELLE */}
            <Section>
                <SectionHeader icon={<IconBox animation={CodeIcon} />}>
                    L&apos;explosion : la récompense qui fait &quot;wow&quot;
                </SectionHeader>

                <Paragraph>
                    Quand le visiteur clique sur un point, ce n&apos;est pas juste un clic. C&apos;est une <Strong>explosion de lumière</Strong> qui se propage sur l&apos;écran. Comme un impact. Une onde de choc.
                </Paragraph>

                <Paragraph>
                    Pourquoi ? Parce que <Strong>chaque action mérite une récompense visuelle</Strong>. Un clic silencieux, ça ne donne pas envie de recommencer. Un clic qui déclenche une explosion ? Ça donne envie de cliquer partout.
                </Paragraph>

                <div className="my-8 rounded-xl overflow-hidden border border-white/10">
                    <Image
                        src="/case-studies/magnetic-website/Screenshot3.png"
                        alt="Explosion plasma en action"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">Chaque clic déclenche ça. Le cerveau adore.</p>
                </div>

                <SectionTitle>Ce qui se passe en coulisses</SectionTitle>

                <Paragraph>
                    L&apos;explosion est calculée en temps réel par la carte graphique de l&apos;ordinateur. On utilise une technique appelée <Strong>shader</Strong> : un mini-programme qui dit &quot;quelle couleur donner à chaque pixel de l&apos;écran, 60 fois par seconde&quot;.
                </Paragraph>

                <Paragraph>
                    C&apos;est ce qui permet d&apos;avoir des effets fluides et réactifs, impossibles avec des animations classiques.
                </Paragraph>

                <CodeWindow title="plasma_explosion.glsl (extrait)">
                    {`// Ce code s'exécute sur la carte graphique, 60 fois par seconde
// Pour chaque pixel de l'écran (représenté par 'vUv', de 0 à 1)

// uLife : une valeur qui va de 0 (début de l'explosion) à 1 (fin)
uniform float uLife;
// uTime : le temps qui passe, utilisé pour animer le "bruit"
uniform float uTime;
// uColor : la couleur principale de l'explosion (ex: bleu)
uniform vec3 uColor;

// Fonction pour générer du bruit (pour l'effet plasma organique)
// (Simplifié ici, en réalité c'est plus complexe, comme fbm ou Perlin noise)
float fbm(vec2 coord) {
    return fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    // 1. Calculer la distance de ce pixel au centre de l'explosion (qui est à 0.5, 0.5)
    float dist = length(vUv - vec2(0.5));
    
    // 2. L'anneau de l'explosion grandit avec le temps (uLife)
    float radius = uLife * 0.9;  // Plus uLife augmente, plus l'anneau est grand
    
    // 3. Calculer l'angle du pixel par rapport au centre
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);

    // 4. Ajouter du "bruit" pour un effet plasma organique
    //    (l'anneau n'est jamais parfaitement rond, il est déformé)
    float noiseVal = fbm(vec2(angle * 3.0, uTime * 2.0)); // Utilise l'angle et le temps pour le bruit
    float distort = (noiseVal - 0.5) * 0.4; // Ajuste l'intensité de la distorsion
    
    // 5. Définir l'épaisseur de l'anneau
    float baseWidth = 0.05; 

    // 6. Si ce pixel est "dans l'anneau" de l'onde → le colorier
    //    smoothstep crée un dégradé doux aux bords de l'anneau
    float ring = 1.0 - smoothstep(0.0, baseWidth, abs(dist - radius + distort));
    
    // 7. Ajouter un halo lumineux au centre de l'explosion
    //    Plus le pixel est proche du centre, plus il est lumineux
    float innerGlow = smoothstep(radius, 0.0, dist) * 0.6;
    
    // 8. Couleur finale : mélange la couleur de base (uColor) avec du blanc
    //    L'anneau et le halo sont plus blancs
    vec3 color = mix(uColor, vec3(1.0), ring * 0.9 + innerGlow);
    
    // 9. L'opacité diminue avec le temps → l'onde s'estompe progressivement
    float opacity = pow(1.0 - uLife, 0.5); // Utilise une puissance pour un estompage non linéaire
    
    // gl_FragColor est la couleur finale du pixel
    // C'est un vecteur 4 (rouge, vert, bleu, alpha/opacité)
    gl_FragColor = vec4(color, (ring + innerGlow) * opacity);
}`}
                </CodeWindow>

                <InfoBox title="Pourquoi c'est important pour ton business">
                    Cette récompense visuelle n&apos;est pas du &quot;nice to have&quot;. C&apos;est ce qui fait que le visiteur <Strong>veut interagir avec les 4 points</Strong> au lieu de partir. Chaque interaction le garde 10 secondes de plus. 4 interactions = 40 secondes gagnées. C&apos;est énorme.
                </InfoBox>
            </Section>

            {/* L'ASSEMBLAGE FINAL */}
            <Section>
                <SectionHeader icon={<IconBox animation={SuccessIcon} />}>
                    L&apos;assemblage : le site qui naît sous tes yeux
                </SectionHeader>

                <Paragraph>
                    Quand tous les éléments sont prêts, le visiteur clique sur le nœud central. Et là, <Strong>tout s&apos;assemble</Strong>. Le menu apparaît en haut. Le texte principal au milieu. Les cartes sur les côtés. Le footer en bas.
                </Paragraph>

                <Paragraph>
                    Chaque élément arrive dans l&apos;ordre logique, avec son animation de construction. En quelques secondes, le site est complet. Mais ces secondes sont <Strong>inoubliables</Strong>.
                </Paragraph>

                <div className="my-8 rounded-xl overflow-hidden border border-white/10">
                    <Image
                        src="/case-studies/magnetic-website/Screenshot4.png"
                        alt="État initial - Point central"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">Un point central. Le visiteur clique et déclenche l&apos;assemblage.</p>
                </div>

                <div className="my-8 rounded-xl overflow-hidden border border-white/10">
                    <Image
                        src="/case-studies/magnetic-website/Screenshot5.png"
                        alt="État final - Site assemblé"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">Le résultat : un site complet, construit par le visiteur lui-même.</p>
                </div>

                <InfoBox title="L'effet IKEA du web">
                    C&apos;est prouvé : on valorise davantage ce qu&apos;on a construit soi-même. Même si c&apos;est juste &quot;cliquer sur un point&quot;, le visiteur a le sentiment d&apos;avoir participé. <Strong>Ton site devient SON site.</Strong> Il s&apos;en souviendra.
                </InfoBox>
            </Section>

            {/* POURQUOI ON FAIT ÇA */}
            <Section>
                <SectionHeader icon={<IconBox animation={BrainIcon} />}>
                    Pourquoi on kiffe faire ça chez BigXBang
                </SectionHeader>

                <SectionTitle>1. On croit que le web peut être mieux</SectionTitle>
                <Paragraph>
                    99% des sites web sont des brochures numériques. On scroll, on lit, on part. Chez BigXBang, on pense que le web peut être <Strong>une expérience</Strong>. Quelque chose qu&apos;on vit, pas qu&apos;on subit.
                </Paragraph>

                <SectionTitle>2. La technique au service du business</SectionTitle>
                <Paragraph>
                    Les shaders, les animations, le WebGL... tout ça, c&apos;est des outils. Pas des fins en soi. On les utilise pour <Strong>résoudre un vrai problème : capter et garder l&apos;attention</Strong>. Si ça n&apos;améliorait pas tes résultats, on ne le ferait pas.
                </Paragraph>

                <SectionTitle>3. Le détail fait la différence</SectionTitle>
                <Paragraph>
                    500 millisecondes d&apos;animation en plus. Une explosion au clic. Un ordre d&apos;apparition pensé. Pris isolément, ça semble futile. Ensemble, <Strong>ça crée une expérience qu&apos;on ne trouve nulle part ailleurs</Strong>.
                </Paragraph>

                <InfoBox title="Notre philosophie">
                    On automatise les tâches répétitives pour libérer ce qui fait de toi un humain. On gamifie les expériences pour captiver l&apos;attention. On code ce que les autres jugent &quot;trop complexe&quot;. <Strong>Parce que c&apos;est là que se fait la différence.</Strong>
                </InfoBox>

            </Section>

            {/* POUR TON BUSINESS */}
            <Section>
                <SectionHeader icon={<IconBox animation={TargetIcon} />}>
                    Ce que ça change concrètement pour toi
                </SectionHeader>

                <BulletList items={[
                    <><Strong>Temps sur page x4</Strong> : Les visiteurs restent plus longtemps parce qu&apos;ils veulent voir la suite.</>,
                    <><Strong>Taux de rebond divisé par 2</Strong> : Ils ne partent pas sans avoir exploré.</>,
                    <><Strong>Mémorabilité maximale</Strong> : Ils se souviennent de ton site parmi les 100 qu&apos;ils ont vus cette semaine.</>,
                    <><Strong>Image premium</Strong> : Un site comme ça, ça dit quelque chose sur ton exigence et ton positionnement.</>,
                ]} />

                <InfoBox title="La question à te poser">
                    Ton site actuel, il fait quoi de spécial ? Si la réponse est &quot;rien de particulier&quot;, c&apos;est que tes visiteurs se disent la même chose. Et ils partent.
                </InfoBox>
            </Section>

        </CaseStudyLayout>
    );
}
