"use client";

import React from "react";
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

// Placeholder component for screenshots
const ScreenshotPlaceholder = ({ instruction, caption }: { instruction: string; caption: string }) => (
    <div className="my-8 border-2 border-dashed border-[#306EE8]/50 rounded-xl p-8 bg-[#306EE8]/5">
        <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#306EE8]/20 text-[#306EE8] text-xs font-mono mb-4">
                📸 SCREENSHOT À FAIRE
            </div>
            <p className="text-white font-medium mb-2">{instruction}</p>
            <p className="text-zinc-400 text-sm italic">&quot;{caption}&quot;</p>
        </div>
    </div>
);

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

                <ScreenshotPlaceholder
                    instruction="Screenshot d'un site template classique (Wix/Squarespace) avec un overlay 'AVANT'"
                    caption="Le web moderne : joli, mais oubliable en 54 secondes."
                />

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

                <ScreenshotPlaceholder
                    instruction="Vue du MagneticWebsite avec les 4 nœuds (coins) visibles, état initial avant interaction"
                    caption="4 points cliquables. 4 parties du site à débloquer. L'utilisateur devient explorateur."
                />

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

                <ScreenshotPlaceholder
                    instruction="GIF ou capture mid-animation : un élément (navbar ou card) en train de se construire avec les particules bleues"
                    caption="500 millisecondes de magie. L'élément se matérialise sous les yeux."
                />

                <SectionTitle>Comment ça marche (version simple)</SectionTitle>

                <Paragraph>
                    En coulisses, on superpose deux couches :
                </Paragraph>

                <BulletList items={[
                    "D'abord, une nuée de particules bleues apparaît (le 'chantier')",
                    "Ensuite, le contenu réel 'balaye' de gauche à droite et remplace les particules",
                    "Résultat : l'élément semble se solidifier devant toi",
                ]} />

                <CodeWindow title="Le concept en pseudo-code">
                    {`// Quand le visiteur déclenche l'apparition :

1. Afficher les particules bleues (effet "en construction")
   → Le visiteur sait qu'il se passe quelque chose

2. Après 500ms, faire apparaître le contenu réel
   → Le contenu "balaye" de gauche à droite
   → Les particules disparaissent en même temps

3. Le visiteur voit : "J'ai fait apparaître ça"
   → Dopamine. Engagement. Curiosité pour le prochain.`}
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

                <ScreenshotPlaceholder
                    instruction="Capture de l'explosion plasma en pleine action (le cercle lumineux qui se propage)"
                    caption="Chaque clic déclenche ça. Le cerveau adore."
                />

                <SectionTitle>Ce qui se passe en coulisses</SectionTitle>

                <Paragraph>
                    L&apos;explosion est calculée en temps réel par la carte graphique de l&apos;ordinateur. On utilise une technique appelée <Strong>shader</Strong> : un mini-programme qui dit &quot;quelle couleur donner à chaque pixel de l&apos;écran, 60 fois par seconde&quot;.
                </Paragraph>

                <Paragraph>
                    C&apos;est ce qui permet d&apos;avoir des effets fluides et réactifs, impossibles avec des animations classiques.
                </Paragraph>

                <CodeWindow title="L'idée derrière l'explosion (simplifié)">
                    {`// Pour chaque pixel de l'écran, 60 fois par seconde :

1. Calculer la distance entre ce pixel et le centre de l'explosion

2. Si le pixel est "dans l'anneau" de l'onde → le colorier en bleu/blanc

3. Ajouter un peu de bruit aléatoire → l'anneau n'est jamais parfaitement rond
   (ça donne l'effet "plasma" organique)

4. Faire grandir l'anneau et baisser son opacité → l'onde s'estompe

// Résultat : une explosion fluide, unique à chaque fois.`}
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
                    Quand tous les points ont été débloqués, le visiteur clique au centre. Et là, <Strong>tout s&apos;assemble</Strong>. Le menu apparaît en haut. Le texte principal au milieu. Les cartes sur les côtés. Le footer en bas.
                </Paragraph>

                <Paragraph>
                    Chaque élément arrive dans l&apos;ordre logique, avec son animation de construction. En 2 secondes, le site est complet. Mais ces 2 secondes sont <Strong>inoubliables</Strong>.
                </Paragraph>

                <ScreenshotPlaceholder
                    instruction="Estado final avec tous les éléments assemblés (la mini-page web complète dans le cadre)"
                    caption="Le résultat : un site complet, construit par le visiteur lui-même."
                />

                <ScreenshotPlaceholder
                    instruction="Montage avant/après côte à côte (état initial 4 points VS état final page complète)"
                    caption="Avant : 4 points mystérieux. Après : un site que tu as construit. Tu t'en souviens."
                />

                <InfoBox title="L'effet IKEA du web">
                    C&apos;est prouvé : on valorise davantage ce qu&apos;on a construit soi-même. Même si c&apos;est juste &quot;cliquer 4 fois&quot;, le visiteur a le sentiment d&apos;avoir participé. <Strong>Ton site devient SON site.</Strong> Il s&apos;en souviendra.
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

                <ScreenshotPlaceholder
                    instruction="Vue des différents états de hover sur les nœuds (l'anneau d'énergie bleu qui s'active au survol)"
                    caption="Chaque survol a sa réaction. Le site est vivant."
                />
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
