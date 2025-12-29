"use client";

import React from "react";

// Layout
import { CaseStudyLayout, Section, SectionHeader } from "@/components/case-studies/CaseStudyLayout";

// UI Components
import { CodeWindow, InfoBox, ProcessStep, SectionTitle, Paragraph, BulletList, Strong } from "@/components/case-studies";
import { IconBox, TechItem } from "@/components/case-studies/IconBox";
import { EmailTemplate } from "@/components/case-studies/EmailTemplate";

// Lottie Icons
import UserIcon from "@/../public/icons/User.json";
import ChecklistIcon from "@/../public/icons/Checklist.json";
import CodeIcon from "@/../public/icons/Code.json";
import Code2Icon from "@/../public/icons/Code 2.json";
import SuccessIcon from "@/../public/icons/Success.json";
import LightBulbIcon from "@/../public/icons/Light bulb.json";
import BrainIcon from "@/../public/icons/Brain.json";
import PaymentIcon from "@/../public/icons/Payment 2.json";
import DeploymentIcon from "@/../public/icons/Deployment.json";
import MailboxIcon from "@/../public/icons/mailbox.json";
import CalendarIcon from "@/../public/icons/Calendar 2.json";
import AnalyticsIcon from "@/../public/icons/Analytics.json";

// Page metadata
const META = {
    slug: "onboarding-automation",
    title: "Automation d'onboarding client",
    subtitle: "On automatise les tâches répétitives pour libérer ce qui fait de toi un humain : penser, créer, décider.",
    metrics: [
        { number: "100%", label: "Automatisé" },
        { number: "30s", label: "Temps total d'exécution" },
        { number: "2h", label: "Économisées par client" },
        { number: "0", label: "Erreurs humaines" },
    ]
};

interface OnboardingAutomationProps {
    mode?: 'page' | 'modal';
    onClose?: () => void;
}

export default function OnboardingAutomation({ mode = 'page', onClose }: OnboardingAutomationProps) {
    return (
        <CaseStudyLayout meta={META} mode={mode} onClose={onClose}>

            {/* LE CONTEXTE */}
            <Section withBorder={false}>
                <SectionHeader icon={<IconBox animation={UserIcon} />}>
                    Le contexte
                </SectionHeader>

                <Paragraph>
                    Un nouveau client signe. Génial ! Sauf que maintenant il faut : lui envoyer le questionnaire d&apos;onboarding, créer sa page dans Notion, l&apos;ajouter au CRM, générer ses accès, planifier le kick-off, lui envoyer le guide de démarrage...
                </Paragraph>

                <Paragraph>
                    Bref, <Strong>2 heures de tâches répétitives</Strong> où tu te dis &quot;un robot pourrait faire ça&quot;.
                </Paragraph>

                <Paragraph>
                    Spoiler : oui, un robot peut faire ça.
                </Paragraph>

                <SectionTitle>Le problème initial</SectionTitle>

                <BulletList items={[
                    "Agence avec 5-10 nouveaux clients par mois",
                    "Chaque onboarding = 2h de tâches administratives",
                    "Process inconsistant (on oublie des étapes, chaque personne fait différemment)",
                    "Les clients attendent parfois 48h avant de recevoir leurs infos"
                ]} />

                <Paragraph>
                    Avant d&apos;écrire une ligne de code, on a passé plusieurs jours à observer l&apos;onboarding réel pour voir comment circulaient les infos entre Stripe, Notion, le CRM et les emails. Cette cartographie nous a servi de base pour remettre de l&apos;ordre.
                </Paragraph>

                <InfoBox title="La réalité terrain">
                    10 clients/mois × 2h = <Strong>20h/mois de travail répétitif</Strong>. Sans méthode, ça mange du temps et ça crée des écarts d&apos;expérience client.
                </InfoBox>
            </Section>

            {/* LA SOLUTION */}
            <Section>
                <SectionHeader icon={<IconBox animation={ChecklistIcon} />}>
                    La solution : un système d&apos;automation complet
                </SectionHeader>

                <Paragraph>
                    On a construit un système qui automatise 100% de l&apos;onboarding client, de la réception du paiement Stripe jusqu&apos;à l&apos;envoi de l&apos;email de bienvenue personnalisé avec le lien Calendly.
                </Paragraph>

                <InfoBox title="La méthode en action">
                    Observer le réel (audit du process manuel) → Mettre de l&apos;ordre (carto des outils, checklists) → Construire le système (automations + docs). Chaque étape a été validée avec l&apos;équipe avant de passer à la suivante.
                </InfoBox>

                <SectionTitle className="mt-12">Le flow global</SectionTitle>

                <div className="space-y-2">
                    <ProcessStep number={1} title="Client paie sur Stripe" description="Le client achète une offre (Starter, Pro ou Enterprise). Stripe déclenche un webhook automatiquement." />
                    <ProcessStep number={2} title="Python reçoit les données" description="Le script Python récupère les infos du client (nom, email, offre achetée) et lance le process d'automation." />
                    <ProcessStep number={3} title="L'IA génère l'email personnalisé" description="Groq (Llama 3.1) rédige un email de bienvenue adapté à l'offre du client en 2-3 secondes." />
                    <ProcessStep number={4} title="Création automatique dans Notion" description="Une page projet structurée est créée avec toutes les infos du client, prête pour l'équipe." />
                    <ProcessStep number={5} title="Ajout au CRM (HubSpot)" description="Le client est ajouté au CRM avec un deal créé et une tâche assignée au Account Manager." />
                    <ProcessStep number={6} title="Génération du lien Calendly" description="Un lien personnalisé est créé pour que le client puisse planifier son kick-off call." />
                    <ProcessStep number={7} title="Envoi de l'email via SendGrid" description="L'email de bienvenue + guide PDF + lien Calendly sont envoyés. Total : 30 secondes." />
                </div>
            </Section>

            {/* LA TECHNIQUE */}
            <Section>
                <SectionHeader icon={<IconBox animation={CodeIcon} />}>
                    La technique expliquée
                </SectionHeader>

                <SectionTitle>Étape 1 : Le webhook Stripe (le déclencheur)</SectionTitle>

                <InfoBox title="C'est quoi un webhook ?">
                    Un webhook, c&apos;est comme une sonnette. Quand un événement se produit (ici, un paiement Stripe), Stripe &quot;sonne&quot; à une URL que tu lui as donnée. Ton système reçoit la notification et peut agir automatiquement.
                </InfoBox>

                <Paragraph>
                    Quand un client paie, Stripe envoie automatiquement une requête POST à notre serveur Python avec toutes les infos :
                </Paragraph>

                <CodeWindow title="stripe_webhook.py">
                    {`@app.route('/webhook/stripe', methods=['POST'])
def handle_stripe_webhook():
    """Appelée automatiquement par Stripe quand un client paie"""
    
    # Vérifier la signature (sécurité)
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return 'Invalid payload', 400
    
    # Récupérer les données du client
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        client_email = session['customer_details']['email']
        client_name = session['customer_details']['name']
        offer_type = session['metadata']['offer_name']
        
        # Lancer le process d'automation
        run_onboarding_automation(client_name, client_email, offer_type)
    
    return 'OK', 200`}
                </CodeWindow>

                <SectionTitle className="mt-12">Étape 2 : Génération de l&apos;email avec l&apos;IA</SectionTitle>

                <Paragraph>
                    On utilise Groq (Llama 3.1) pour générer un email de bienvenue personnalisé. Le prompt est adapté à l&apos;offre achetée pour que le ton soit pertinent.
                </Paragraph>

                <CodeWindow title="email_generator.py">
                    {`def generate_welcome_email(client_name, offer_type):
    """Génère un email de bienvenue personnalisé avec l'IA"""
    
    prompt = f"""Tu es l'assistant de bigxbang. Rédige un email de bienvenue 
chaleureux et professionnel pour {client_name} qui vient d'acheter l'offre {offer_type}.

L'email doit :
- Être friendly mais pas trop familier
- Mentionner les prochaines étapes (questionnaire, kick-off call)
- Donner envie de commencer rapidement
- Faire moins de 150 mots
"""
    
    # Appel API Groq
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama-3.1-70b-versatile",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7  # Un peu de créativité
        }
    )
    
    return response.json()['choices'][0]['message']['content']`}
                </CodeWindow>

                <Paragraph className="mt-8">
                    <Strong>Exemple d&apos;email généré :</Strong>
                </Paragraph>

                <EmailTemplate
                    greeting="Salut Thomas ! Merci d'avoir rejoint bigxbang. On est ravis de bosser avec toi sur ton projet, tu vas être onboardé en douceur."
                    intro="Ce qui se passe dans les prochaines 24h :"
                    tasks={[
                        { title: "Questionnaire d'onboarding", description: "Tu reçois un rapide formulaire (5 minutes) pour nous donner toutes les infos essentielles." },
                        { title: "Création de ton espace Notion", description: "Dès que tu valides, on crée ton hub client avec toutes les ressources et suivis." },
                        { title: "Kick-off planifié automatiquement", description: "Tu reçois un lien Calendly pour booker le créneau qui fonctionne pour toi (30 minutes)." },
                    ]}
                />

                <SectionTitle className="mt-12">Étape 3 : Création automatique dans Notion</SectionTitle>

                <Paragraph>
                    Chaque client = une page Notion structurée avec toutes les infos nécessaires pour l&apos;équipe.
                </Paragraph>

                <InfoBox title="L'API Notion, c'est quoi ?">
                    Notion expose une API qui permet à ton code Python de créer/modifier des pages Notion automatiquement. C&apos;est comme si tu cliquais dans l&apos;interface, mais en automatique.
                </InfoBox>

                <CodeWindow title="notion_sync.py">
                    {`def create_notion_page(client_name, client_email, offer_type):
    """Crée automatiquement une page Notion pour le client"""
    
    response = requests.post(
        "https://api.notion.com/v1/pages",
        headers={
            "Authorization": f"Bearer {NOTION_API_KEY}",
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28"
        },
        json={
            "parent": {"database_id": NOTION_DATABASE_ID},
            "properties": {
                "Nom": {"title": [{"text": {"content": client_name}}]},
                "Email": {"email": client_email},
                "Offre": {"select": {"name": offer_type}},
                "Statut": {"select": {"name": "Onboarding en cours"}}
            }
        }
    )
    
    return response.json()`}
                </CodeWindow>

                <Paragraph className="mt-6">
                    <Strong>Ce que ça évite :</Strong> 15 min de copier-coller manuel + risque d&apos;oublier des sections.
                </Paragraph>

                <SectionTitle className="mt-12">Étape 4 : Les autres intégrations (CRM + Calendly + Email)</SectionTitle>

                <Paragraph>
                    Le même principe s&apos;applique pour :
                </Paragraph>
                <BulletList items={[
                    <><Strong>HubSpot API :</Strong> Ajouter le client au CRM avec un deal + une tâche assignée</>,
                    <><Strong>Calendly API :</Strong> Générer un lien de planification personnalisé</>,
                    <><Strong>SendGrid API :</Strong> Envoyer l&apos;email avec le guide PDF en pièce jointe</>,
                ]} />
                <Paragraph>
                    Toutes ces actions se font en parallèle. Total : <Strong>30 secondes</Strong>.
                </Paragraph>
            </Section>

            {/* LA STACK */}
            <Section>
                <SectionHeader icon={<IconBox animation={CodeIcon} />}>
                    La stack technique
                </SectionHeader>

                <div className="grid md:grid-cols-2 gap-6">
                    <TechItem animation={CodeIcon} name="Python + Flask" description="Le cerveau de l'automation. Léger, rapide à déployer, parfait pour les webhooks." />
                    <TechItem animation={PaymentIcon} name="Stripe" description="Paiements et webhooks. Le système est déclenché automatiquement à chaque vente." />
                    <TechItem animation={BrainIcon} name="Groq (Llama 3.1)" description="Génération des emails personnalisés. Rapide (2-3 secondes) et gratuit jusqu'à 30 req/min." />
                    <TechItem animation={CodeIcon} name="Notion API" description="Base de données clients. Chaque nouveau client = une page Notion structurée automatiquement." />
                    <TechItem animation={AnalyticsIcon} name="HubSpot API" description="CRM commercial. Le client est ajouté automatiquement avec un deal et une tâche assignée." />
                    <TechItem animation={CalendarIcon} name="Calendly API" description="Planification du kick-off. Génère un lien personnalisé qui pré-remplit les infos du client." />
                    <TechItem animation={MailboxIcon} name="SendGrid API" description="Envoi des emails avec délivrabilité optimale. Support des pièces jointes (guide PDF)." />
                    <TechItem animation={DeploymentIcon} name="Railway / Render" description="Hébergement du script Python. Pas cher (~10€/mois), facile à déployer, toujours disponible." />
                </div>
            </Section>

            {/* LES RÉSULTATS */}
            <Section>
                <SectionHeader icon={<IconBox animation={SuccessIcon} />}>
                    Les résultats
                </SectionHeader>

                <SectionTitle>Avant l&apos;automation</SectionTitle>
                <BulletList items={[
                    <><Strong>2h de travail manuel</Strong> par client</>,
                    <>Emails envoyés avec <Strong>24-48h de délai</Strong></>,
                    <><Strong>Oublis fréquents</Strong> (guide pas envoyé, CRM pas mis à jour)</>,
                    <><Strong>Process différent</Strong> selon qui gère l&apos;onboarding</>,
                ]} />

                <SectionTitle>Après l&apos;automation</SectionTitle>
                <BulletList items={[
                    <><Strong>30 secondes</Strong> (temps machine)</>,
                    <>Emails envoyés <Strong>instantanément</Strong></>,
                    <><Strong>0 oubli</Strong> (tout est systématique)</>,
                    <><Strong>Process identique</Strong> pour tous les clients</>,
                ]} />

                <SectionTitle className="mb-6">ROI mensuel (pour 10 clients/mois)</SectionTitle>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-[#306EE8]/10 to-[#306EE8]/5 border border-white/5 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#306EE8]/30">
                        <div className="text-4xl md:text-5xl font-bold font-clash bg-gradient-to-br from-[#306EE8] to-[#306EE8]/60 bg-clip-text text-transparent mb-3">20h</div>
                        <div className="text-white/60 font-medium">Économisées par mois</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#306EE8]/10 to-[#306EE8]/5 border border-white/5 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#306EE8]/30">
                        <div className="text-4xl md:text-5xl font-bold font-clash bg-gradient-to-br from-[#306EE8] to-[#306EE8]/60 bg-clip-text text-transparent mb-3">0.5</div>
                        <div className="text-white/60 font-medium">ETP libéré</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#306EE8]/10 to-[#306EE8]/5 border border-white/5 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#306EE8]/30">
                        <div className="text-4xl md:text-5xl font-bold font-clash bg-gradient-to-br from-[#306EE8] to-[#306EE8]/60 bg-clip-text text-transparent mb-3">~50€</div>
                        <div className="text-white/60 font-medium">Coût mensuel total</div>
                    </div>
                </div>

                <InfoBox title="Le calcul du ROI">
                    20h économisées/mois = 0.5 ETP libéré pour du vrai conseil client. Si on valorise ce temps à 40€/h, ça fait <Strong>800€/mois d&apos;économies</Strong> pour un coût d&apos;infrastructure de ~50€/mois. ROI : 16x.
                </InfoBox>
            </Section>

            {/* CE QU'ON A APPRIS */}
            <Section>
                <SectionHeader icon={<IconBox animation={LightBulbIcon} />}>
                    Ce qu&apos;on a appris
                </SectionHeader>

                <SectionTitle>1. L&apos;IA n&apos;est pas magique</SectionTitle>
                <Paragraph>
                    Le prompt doit être précis pour avoir des résultats cohérents. On a testé 15 versions avant de trouver le bon équilibre entre ton friendly et professionnel.
                </Paragraph>

                <SectionTitle>2. Commencer simple</SectionTitle>
                <Paragraph>
                    On a d&apos;abord automatisé juste l&apos;email. Puis Notion. Puis le reste. Pas tout d&apos;un coup. Chaque étape validée avant de passer à la suivante.
                </Paragraph>

                <SectionTitle>3. La gestion d&apos;erreurs est critique</SectionTitle>
                <Paragraph>
                    Si Notion plante, le process doit continuer quand même. On log l&apos;erreur et on crée la page manuellement plus tard. Mais l&apos;email part quoi qu&apos;il arrive.
                </Paragraph>

                <CodeWindow title="error_handling.py">
                    {`try:
    create_notion_page(client_name, client_email, offer_type)
except Exception as e:
    # Logger l'erreur mais continuer le process
    log_error(f"Notion failed: {e}")
    send_slack_alert(f"Alerte : création Notion impossible pour {client_name}")
    # L'automation continue (email, CRM, etc.)`}
                </CodeWindow>

                <SectionTitle className="mt-10">4. Tester en conditions réelles</SectionTitle>
                <Paragraph>
                    Pendant deux semaines, on a gardé l&apos;ancien onboarding manuel tout en lançant l&apos;automation sur 3 clients volontaires. Chaque action automatique était doublée d&apos;une vérification humaine pour comparer les résultats. C&apos;est comme ça qu&apos;on a ajusté le ton de l&apos;email, l&apos;ordre des étapes et le timing des invitations Calendly.
                </Paragraph>
            </Section>

            {/* CODE COMPLET */}
            <Section>
                <SectionHeader icon={<IconBox animation={Code2Icon} />}>
                    Le code simplifié (structure globale)
                </SectionHeader>

                <Paragraph>
                    Voici la structure globale du système (code simplifié pour la lisibilité) :
                </Paragraph>

                <CodeWindow title="automation.py">
                    {`from flask import Flask, request
import requests
import json

app = Flask(__name__)

# Webhook Stripe : reçoit la notification de paiement
@app.route('/webhook/stripe', methods=['POST'])
def handle_stripe_webhook():
    """Appelée automatiquement par Stripe quand un client paie"""
    
    # 1. Récupérer les données du paiement
    data = request.json
    client_email = data['customer_email']
    client_name = data['customer_name']
    offer_type = data['product_name']
    
    # 2. Générer l'email avec l'IA
    welcome_email = generate_welcome_email_with_ai(client_name, offer_type)
    
    # 3. Créer la page Notion
    create_notion_page(client_name, client_email, offer_type)
    
    # 4. Ajouter au CRM
    add_to_crm(client_email, client_name, offer_type)
    
    # 5. Générer le lien Calendly
    calendly_link = generate_calendly_link(client_email, client_name)
    
    # 6. Envoyer l'email
    send_email(
        to=client_email,
        subject="Bienvenue chez bigxbang",
        body=welcome_email,
        calendly_link=calendly_link
    )
    
    return {"status": "success"}, 200`}
                </CodeWindow>

                <InfoBox title="Ce code est simplifié">
                    En production, on ajoute : gestion des erreurs, vérification de la signature Stripe (sécurité), logs pour tracker chaque étape, retry logic (réessayer si ça plante), et tests automatisés.
                </InfoBox>
            </Section>
        </CaseStudyLayout>
    );
}
