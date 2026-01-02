"use client";

import React from "react";
import Image from "next/image";
import { CaseStudyLayout, Section, SectionHeader } from "@/components/case-studies/CaseStudyLayout";
import { CodeWindow, InfoBox, SectionTitle, Paragraph, BulletList, Strong } from "@/components/case-studies";
import { IconBox } from "@/components/case-studies/IconBox";
import { EmailTemplate } from "@/components/case-studies/EmailTemplate";

// Lottie Icons
import LightBulbIcon from "@/../public/icons/Light bulb.json";
import LoupeIcon from "@/../public/icons/Loupe.json";
import TargetIcon from "@/../public/icons/Target.json";
import CodeIcon from "@/../public/icons/Code.json";
import SuccessIcon from "@/../public/icons/Success.json";
import BrainIcon from "@/../public/icons/Brain.json";

// Page metadata
const META = {
    slug: "smart-newsletter",
    title: "Smart Newsletter : La newsletter qui s'écrit (presque) toute seule",
    subtitle: "Comment on a transformé 3h de veille juridique en 1h de rédaction créative. Sans perdre l'âme du cabinet.",
    metrics: [
        { number: "-66%", label: "Temps de préparation" },
        { number: "4x", label: "Plus de newsletters" },
        { number: "0", label: "Texte important raté" },
        { number: "100%", label: "ADN de marque" },
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

interface SmartNewsletterProps {
    mode?: 'page' | 'modal';
    onClose?: () => void;
}

export default function SmartNewsletter({ mode = 'page', onClose }: SmartNewsletterProps) {
    return (
        <CaseStudyLayout meta={META} mode={mode} onClose={onClose}>

            {/* LE CONTEXTE */}
            <Section withBorder={false}>
                <SectionHeader icon={<IconBox animation={LightBulbIcon} />}>
                    Le contexte : un cabinet qui veut informer ses clients
                </SectionHeader>

                <Paragraph>
                    <Strong>Bogati Avocats</Strong> (nom anonymisé) est un cabinet spécialisé en droit des affaires. Leurs clients : des dirigeants de PME, des startups en levée de fonds, des grands groupes. Des gens qui n&apos;ont pas le temps de lire le Journal Officiel, mais qui doivent être informés quand une loi les concerne.
                </Paragraph>

                <Paragraph>
                    Le cabinet voulait envoyer une <Strong>newsletter hebdomadaire de veille juridique</Strong>. Simple sur le papier. Infernal en pratique.
                </Paragraph>

                <InfoBox title="Note">
                    Le nom &quot;Bogati Avocats&quot; est fictif. Le cas d&apos;usage est réel, mais le client reste anonyme.
                </InfoBox>

                <SectionTitle>Le problème concret</SectionTitle>
                <BulletList items={[
                    <><Strong>3h/semaine</Strong> pour lire le Journal Officiel et trouver 5-10 textes pertinents</>,
                    <><Strong>80% du temps</Strong> passé à lire des textes hors scope (agriculture, santé, collectivités...)</>,
                    <><Strong>Newsletter 1x/mois</Strong> parce que c&apos;est trop chronophage pour faire plus</>,
                    <><Strong>Contenu fade</Strong> : des résumés techniques sans personnalité</>,
                ]} />

                <Paragraph>
                    Résultat : une newsletter que personne n&apos;attend, que personne ne lit, et qui ne reflète pas l&apos;expertise du cabinet.
                </Paragraph>

                <div className="my-8 rounded-xl overflow-hidden border border-white/10">
                    <Image
                        src="/case-studies/smart-newsletter/legifrance.png"
                        alt="Interface Légifrance - Journal Officiel"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">Le Journal Officiel : des centaines de textes par semaine. Lequel te concerne ?</p>
                </div>
            </Section>

            {/* OBSERVER LE RÉEL */}
            <Section>
                <SectionHeader icon={<IconBox animation={LoupeIcon} />}>
                    Observer le réel : où part le temps ?
                </SectionHeader>

                <Paragraph>
                    Avant de proposer une solution, on a regardé comment le cabinet préparait sa newsletter. Chrono en main.
                </Paragraph>

                <SectionTitle>Le process manuel</SectionTitle>
                <BulletList items={[
                    <><Strong>1h30 de lecture</Strong> : Parcourir le JO (lundi-jeudi) pour identifier les textes potentiellement intéressants</>,
                    <><Strong>45min de tri</Strong> : Relire les textes sélectionnés, vérifier leur pertinence</>,
                    <><Strong>45min de rédaction</Strong> : Écrire la newsletter (la seule étape à vraie valeur ajoutée)</>,
                ]} />

                <Paragraph>
                    <Strong>Total : 3h/semaine.</Strong> Dont seulement 45 minutes de travail intellectuel réel. Le reste, c&apos;est du tri.
                </Paragraph>

                <InfoBox title="L'insight">
                    Le problème n&apos;est pas le manque d&apos;information. Légifrance publie tout, c&apos;est public. Le problème, c&apos;est le <Strong>manque de temps pour transformer l&apos;info brute en contenu captivant</Strong>.
                </InfoBox>
            </Section>

            {/* LA SOLUTION */}
            <Section>
                <SectionHeader icon={<IconBox animation={TargetIcon} />}>
                    La solution : l&apos;IA trie, l&apos;humain crée
                </SectionHeader>

                <Paragraph>
                    On a construit un système en 3 couches. L&apos;idée : <Strong>automatiser tout ce qui est répétitif, garder l&apos;humain là où il fait la différence</Strong>.
                </Paragraph>

                <SectionTitle>Couche 1 : L&apos;automatisation intelligente</SectionTitle>
                <Paragraph>
                    Chaque matin (lundi-jeudi), un script Python scrappe automatiquement le Journal Officiel sur Légifrance. Tous les textes publiés sont récupérés et stockés dans une base de données.
                </Paragraph>

                <InfoBox title="C'est quoi MongoDB ?">
                    <Strong>MongoDB</Strong> est une base de données. Imagine un immense classeur numérique où tu peux ranger des fiches (ici, les textes de loi). Chaque fiche contient le titre, le contenu, la date, etc. L&apos;avantage de MongoDB : on peut chercher très vite parmi des milliers de fiches, et on garde un historique complet de tout ce qui a été stocké.
                </InfoBox>

                <Paragraph>
                    On utilise <Strong>deux collections</Strong> (deux classeurs) : une pour tous les textes scrapés (textes_bruts), une autre pour les textes validés par l&apos;IA (textes_pertinents). Ça permet de garder la traçabilité : si un jour on veut savoir ce qu&apos;on a raté, on peut vérifier.
                </Paragraph>

                <SectionTitle>Couche 2 : Le tri par l&apos;IA</SectionTitle>
                <Paragraph>
                    Une fois les textes stockés, l&apos;IA prend le relais. On utilise un modèle appelé <Strong>DeepSeek-V3.2</Strong>, accessible via une plateforme qui s&apos;appelle DeepInfra.
                </Paragraph>

                <InfoBox title="C'est quoi DeepInfra ?">
                    <Strong>DeepInfra</Strong> est une plateforme qui permet d&apos;utiliser des modèles d&apos;intelligence artificielle sans avoir à les installer sur son propre ordinateur. C&apos;est comme un service de location de cerveau artificiel : tu envoies une question, le modèle réfléchit, et tu reçois la réponse. Le gros avantage : on peut choisir parmi plein de modèles différents (Llama, Mistral, DeepSeek...) et payer uniquement ce qu&apos;on utilise.
                </InfoBox>

                <InfoBox title="C'est quoi l'open source ?">
                    <Strong>Open source</Strong> signifie que le code du logiciel est public et modifiable par tout le monde. C&apos;est l&apos;opposé des logiciels propriétaires (comme ceux de Google ou OpenAI) où le code est secret. Chez BigXBang, on préfère l&apos;open source parce que ça nous donne <Strong>l&apos;autonomie</Strong> : on ne dépend pas d&apos;une entreprise qui peut changer ses prix ou ses conditions du jour au lendemain.
                </InfoBox>

                <Paragraph>
                    L&apos;IA lit chaque texte et répond à une question simple : <Strong>&quot;Ce texte est-il pertinent pour un cabinet de droit des affaires ?&quot;</Strong>
                </Paragraph>

                <BulletList items={[
                    "Si oui → elle génère un résumé + une note de pertinence (1-5 étoiles)",
                    "Si non → le texte est marqué comme traité, on passe au suivant",
                    "Les textes pertinents sont stockés dans la 2ème collection MongoDB",
                ]} />

                <div className="my-8 rounded-xl overflow-hidden border border-white/10">
                    <Image
                        src="/case-studies/smart-newsletter/deepinfra.png"
                        alt="Interface DeepInfra - Modèles IA"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                    />
                    <p className="text-center text-zinc-400 text-sm italic mt-4">DeepInfra : choisir le bon modèle IA pour chaque tâche.</p>
                </div>

                <SectionTitle>Couche 3 : Le rapport hebdomadaire</SectionTitle>
                <Paragraph>
                    Chaque jeudi matin, un script Python récupère tous les textes pertinents de la semaine. Il génère un rapport HTML (une page web) avec :
                </Paragraph>

                <BulletList items={[
                    "Le titre de chaque texte",
                    "Un résumé automatique (2-3 phrases)",
                    "Un lien direct vers le texte complet sur Légifrance",
                    "Une note de pertinence (pour prioriser)",
                ]} />

                <Paragraph>
                    Le rapport est envoyé par email à BigXBang via un service d&apos;envoi d&apos;emails (SendGrid). <Strong>Zéro intervention manuelle.</Strong>
                </Paragraph>

                <SectionTitle>Exemple de rapport reçu</SectionTitle>
                <Paragraph>
                    Voici à quoi ressemble le rapport que BigXBang reçoit chaque jeudi matin :
                </Paragraph>

                <EmailTemplate
                    title="📋 Veille juridique - Semaine 2025-W05"
                    greeting="Bonjour BigXBang,"
                    intro="8 textes pertinents cette semaine pour Bogati Avocats. Voici la sélection triée par pertinence."
                    tasks={[
                        {
                            title: "Décret n° 2025-123 - Réforme des SAS ⭐⭐⭐⭐⭐",
                            description: "Ce décret modifie les règles de constitution des SAS. Impact direct sur les procédures de création d'entreprise."
                        },
                        {
                            title: "Arrêté du 15/01 - TVA sur les prestations numériques ⭐⭐⭐⭐",
                            description: "Clarification des règles de TVA pour les services SaaS. À vérifier pour les clients startups."
                        },
                        {
                            title: "Loi n° 2025-45 - Droit des entreprises en difficulté ⭐⭐⭐⭐",
                            description: "Nouvelles procédures de sauvegarde accélérée. Pertinent pour les dossiers de restructuration."
                        }
                    ]}
                    ctaText="Voir tous les textes sur Légifrance"
                    ctaUrl="https://www.legifrance.gouv.fr/jorf/jo"
                    footerItems={["Rapport généré automatiquement", "5 autres textes en annexe"]}
                    signature="Le système de veille BigXBang"
                />
            </Section>

            {/* L'INTELLIGENCE HUMAINE */}
            <Section>
                <SectionHeader icon={<IconBox animation={BrainIcon} />}>
                    L&apos;intelligence humaine : ce que l&apos;IA ne sait pas faire
                </SectionHeader>

                <Paragraph>
                    Avant même de lancer le système, on a passé 2 heures avec Bogati Avocats pour comprendre leur <Strong>ADN de marque</Strong>.
                </Paragraph>

                <SectionTitle>Le brief initial (une seule fois)</SectionTitle>
                <BulletList items={[
                    <><Strong>Qui sont les clients ?</Strong> Dirigeants de PME, DAF, DG de startups</>,
                    <><Strong>Quel ton ?</Strong> Accessible mais expert. Pas de jargon inutile.</>,
                    <><Strong>Quelle valeur ajoutée ?</Strong> Pas juste &quot;voici les lois&quot;, mais &quot;voici ce que ça change pour toi&quot;</>,
                    <><Strong>Quelle personnalité ?</Strong> Le cabinet qui rend le droit compréhensible</>,
                ]} />

                <Paragraph>
                    Ces guidelines sont définies une fois, au départ. Ensuite, chaque semaine, BigXBang reçoit le rapport et rédige la newsletter en suivant ces règles.
                </Paragraph>

                <SectionTitle>Ce que l&apos;IA ne sait pas faire</SectionTitle>
                <BulletList items={[
                    "Comprendre l'ADN de marque d'un cabinet (son histoire, son positionnement)",
                    "Adapter le ton selon l'audience (un DG vs un DAF, ce n'est pas le même langage)",
                    "Créer un angle éditorial qui capte l'attention",
                    "Contextualiser un texte de loi : \"Cette réforme fiscale, ça veut dire X pour ton entreprise\"",
                ]} />

                <InfoBox title="Notre conviction">
                    L&apos;IA ne remplace pas l&apos;humain. Elle lui donne les munitions. En 20 minutes de lecture (au lieu de 3h), on a toute la matière première. Le reste du temps, on crée du contenu qui <Strong>résonne</Strong> avec l&apos;audience.
                </InfoBox>
            </Section>

            {/* LE CODE */}
            <Section>
                <SectionHeader icon={<IconBox animation={CodeIcon} />}>
                    Le code : comment ça marche concrètement
                </SectionHeader>

                <SectionTitle>1. Scraping + stockage MongoDB</SectionTitle>
                <Paragraph>
                    Chaque matin, le script récupère les textes du Journal Officiel et les stocke dans MongoDB. Voici le code (simplifié et commenté) :
                </Paragraph>

                <CodeWindow title="scrape_legifrance.py">
                    {`# On importe les outils nécessaires
from pymongo import MongoClient  # Pour se connecter à MongoDB
import requests  # Pour faire des requêtes sur le web
from datetime import datetime  # Pour les dates

# Connexion à MongoDB (notre base de données)
client = MongoClient("mongodb://localhost:27017/")
db = client["veille_juridique"]  # On crée une base nommée "veille_juridique"

# Fonction pour récupérer les textes du Journal Officiel
def scrape_journal_officiel():
    # On appelle l'API de Légifrance (l'interface programmable)
    response = requests.get("https://api.piste.gouv.fr/.../jo/today")
    textes = response.json()["textes"]  # On récupère la liste des textes
    return textes

# On exécute le scraping
nouveaux_textes = scrape_journal_officiel()

# Pour chaque texte récupéré...
for texte in nouveaux_textes:
    # On vérifie qu'il n'existe pas déjà (éviter les doublons)
    if not db.textes_bruts.find_one({"numero": texte["numero"]}):
        # On l'ajoute dans la collection "textes_bruts"
        db.textes_bruts.insert_one({
            "titre": texte["titre"],
            "numero": texte["numero"],
            "date_publication": texte["date"],
            "texte_complet": texte["contenu"],
            "url_legifrance": texte["url"],
            "date_scraping": datetime.now(),
            "traite": False  # Pas encore analysé par l'IA
        })

print(f"{len(nouveaux_textes)} textes récupérés et stockés.")`}
                </CodeWindow>

                <SectionTitle>2. Filtrage avec DeepSeek via DeepInfra</SectionTitle>
                <Paragraph>
                    L&apos;IA lit chaque texte non traité et décide s&apos;il est pertinent pour le droit des affaires. On lui pose la question, elle répond en JSON (un format structuré).
                </Paragraph>

                <CodeWindow title="filter_with_ai.py">
                    {`import requests
from datetime import datetime

# Clé d'accès à DeepInfra (comme un mot de passe)
DEEPINFRA_API_KEY = "ton_api_key"
MODEL = "deepseek-ai/DeepSeek-V3.2"  # Le modèle IA qu'on utilise

def filter_texte(texte):
    """Demande à l'IA si le texte est pertinent pour le droit des affaires."""
    
    # On construit la question qu'on pose à l'IA
    prompt = f"""Tu es un assistant juridique spécialisé en droit des affaires.
    
Analyse ce texte de loi et réponds en JSON :
- "pertinent": true/false (pertinent pour droit des affaires, sociétés, fiscal, commercial)
- "resume": résumé en 2-3 phrases si pertinent
- "note": note de 1 à 5 (5 = très important)

Texte : {texte["titre"]}
{texte["texte_complet"][:2000]}
"""
    
    # On envoie la question à DeepInfra
    response = requests.post(
        "https://api.deepinfra.com/v1/openai/chat/completions",
        headers={"Authorization": f"Bearer {DEEPINFRA_API_KEY}"},
        json={
            "model": MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"}
        }
    )
    
    # On récupère la réponse de l'IA
    return response.json()["choices"][0]["message"]["content"]

# On récupère tous les textes pas encore traités
textes_a_traiter = db.textes_bruts.find({"traite": False})

for texte in textes_a_traiter:
    result = filter_texte(texte)
    
    # Si l'IA dit que c'est pertinent...
    if result["pertinent"]:
        # On l'ajoute dans la collection des textes pertinents
        db.textes_pertinents.insert_one({
            "titre": texte["titre"],
            "url_legifrance": texte["url_legifrance"],
            "resume_ia": result["resume"],
            "note_pertinence": result["note"],
            "semaine": datetime.now().strftime("%Y-W%V")  # Ex: "2025-W05"
        })
    
    # On marque le texte comme traité (pour ne pas le refaire)
    db.textes_bruts.update_one(
        {"_id": texte["_id"]},
        {"$set": {"traite": True}}
    )`}
                </CodeWindow>

                <SectionTitle>3. Génération et envoi du rapport hebdomadaire</SectionTitle>
                <Paragraph>
                    Chaque jeudi, le script récupère les textes de la semaine, génère un rapport HTML, et l&apos;envoie par email à BigXBang.
                </Paragraph>

                <CodeWindow title="send_weekly_report.py">
                    {`from jinja2 import Template  # Pour créer des pages HTML
import requests
from datetime import datetime

SENDGRID_API_KEY = "ton_api_key"  # Clé pour le service d'envoi d'emails

# Template HTML du rapport (la structure de la page)
TEMPLATE = Template("""
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #306EE8;">📋 Veille juridique - Semaine {{ semaine }}</h1>
    <p><strong>{{ nb_textes }} textes pertinents</strong> cette semaine pour Bogati Avocats.</p>
    
    {% for texte in textes %}
    <div style="border-left: 4px solid #306EE8; padding-left: 15px; margin: 25px 0;">
        <h3 style="margin: 0;">{{ texte.titre }}</h3>
        <p style="color: #666;">⭐ Pertinence : {{ texte.note_pertinence }}/5</p>
        <p>{{ texte.resume_ia }}</p>
        <a href="{{ texte.url_legifrance }}" style="color: #306EE8;">Lire le texte complet →</a>
    </div>
    {% endfor %}
    
    <hr style="border: 1px solid #eee; margin: 30px 0;">
    <p style="color: #999; font-size: 12px;">
        Rapport généré automatiquement par le système de veille BigXBang.
    </p>
</body>
</html>
""")

# On récupère les textes pertinents de la semaine en cours
semaine_actuelle = datetime.now().strftime("%Y-W%V")
textes = list(db.textes_pertinents.find({"semaine": semaine_actuelle}).sort("note_pertinence", -1))

# On génère le rapport HTML
rapport_html = TEMPLATE.render(
    semaine=semaine_actuelle,
    nb_textes=len(textes),
    textes=textes
)

# On envoie l'email via SendGrid
requests.post(
    "https://api.sendgrid.com/v3/mail/send",
    headers={
        "Authorization": f"Bearer {SENDGRID_API_KEY}",
        "Content-Type": "application/json"
    },
    json={
        "personalizations": [{"to": [{"email": "thomas@bigxbang.studio"}]}],
        "from": {"email": "veille@bogati-avocats.fr", "name": "Veille Bogati"},
        "subject": f"📋 Veille juridique - Semaine {semaine_actuelle}",
        "content": [{"type": "text/html", "value": rapport_html}]
    }
)

print(f"Rapport envoyé : {len(textes)} textes.")`}
                </CodeWindow>
            </Section>

            {/* LES RÉSULTATS */}
            <Section>
                <SectionHeader icon={<IconBox animation={SuccessIcon} />}>
                    Les résultats : moins de temps, plus de valeur
                </SectionHeader>

                <SectionTitle>Les chiffres</SectionTitle>
                <BulletList items={[
                    <><Strong>Avant :</Strong> 3h/semaine de préparation → newsletter 1x/mois</>,
                    <><Strong>Après :</Strong> 1h/semaine de rédaction → newsletter 1x/semaine</>,
                    <><Strong>Gain de temps :</Strong> 66% (de 3h à 1h)</>,
                    <><Strong>Régularité :</Strong> 4x plus de newsletters envoyées</>,
                ]} />

                <SectionTitle>Ce qui a changé</SectionTitle>
                <BulletList items={[
                    "L'avocat ne lit plus 200 textes, il en lit 10 (pré-triés par l'IA)",
                    "La newsletter a du caractère (écrite par BigXBang, pas générée)",
                    "Les clients sont mieux informés (régularité hebdomadaire)",
                    "Le cabinet se positionne comme expert accessible",
                ]} />

                <InfoBox title="Le vrai gain">
                    Ce n&apos;est pas juste du temps économisé. C&apos;est du temps <Strong>réinvesti dans ce qui compte</Strong> : créer du contenu qui reflète l&apos;expertise et la personnalité du cabinet.
                </InfoBox>
            </Section>

            {/* CE QU'ON A APPRIS */}
            <Section>
                <SectionHeader icon={<IconBox animation={BrainIcon} />}>
                    Ce qu&apos;on a appris
                </SectionHeader>

                <SectionTitle>1. L&apos;IA ne remplace pas l&apos;humain, elle lui donne les munitions</SectionTitle>
                <Paragraph>
                    L&apos;IA fait le tri (lire 200 textes, en garder 10). L&apos;humain fait le reste (comprendre l&apos;audience, choisir l&apos;angle, rédiger avec personnalité). Les deux sont nécessaires. L&apos;un sans l&apos;autre ne marche pas.
                </Paragraph>

                <SectionTitle>2. MongoDB = traçabilité + agrégation</SectionTitle>
                <Paragraph>
                    Deux collections (textes_bruts + textes_pertinents) permettent de garder l&apos;historique complet. Si un jour on veut savoir pourquoi on a raté un texte important, on peut vérifier. Et l&apos;agrégation hebdomadaire évite d&apos;envoyer 4 emails par semaine.
                </Paragraph>

                <SectionTitle>3. Open source = autonomie</SectionTitle>
                <Paragraph>
                    DeepInfra nous permet de choisir le modèle le plus adapté (DeepSeek pour le raisonnement juridique) sans dépendre d&apos;OpenAI. C&apos;est cohérent avec notre philosophie : maîtriser nos outils, pas être maîtrisé par eux.
                </Paragraph>

                <InfoBox title="Notre conviction">
                    La technique est au service du contenu. L&apos;automatisation libère du temps pour ce qui compte : comprendre l&apos;audience, créer un angle, captiver. <Strong>Un bon contenu = data (IA) + compréhension humaine (marketing).</Strong>
                </InfoBox>
            </Section>

        </CaseStudyLayout>
    );
}
