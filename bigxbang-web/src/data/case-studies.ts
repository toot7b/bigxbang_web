export interface CaseStudy {
    slug: string;
    title: string;
    subtitle: string;
    client: string;
    timeline: string;
    stack: string[];
    content: {
        type: "text" | "code" | "image" | "section_header" | "info_box";
        value: string;
        language?: string; // for code blocks
        caption?: string; // for images
    }[];
}

export const CASE_STUDIES: CaseStudy[] = [
    {
        slug: "onboarding-automation",
        title: "Onboarding Autopilot",
        subtitle: "On automatise les tâches répétitives pour libérer ce qui fait de toi un humain : penser, créer, décider.",
        client: "SaaS Confidential",
        timeline: "2 Semaines",
        stack: ["Python", "Flask", "Stripe API", "Notion API", "SendGrid"],
        content: [
            {
                type: "section_header",
                value: "1. Le Problème : Le Chaos Administratif"
            },
            {
                type: "text",
                value: "Au lancement, chaque client reçu était une victoire... suivie d'une heure de copier-coller. <strong>Le fondateur gérait tout à la main :</strong>"
            },
            {
                type: "text",
                value: "1. Recevoir la notif Stripe.<br>2. Dupliquer le template Notion client.<br>3. Créer le dossier Drive.<br>4. Envoyer le mail de bienvenue (en oubliant parfois la pièce jointe...).<br>5. Mettre à jour le CRM."
            },
            {
                type: "text",
                value: "Résultat ? Des erreurs, des oublis, et un fondateur qui ne pouvait plus scaler."
            },
            {
                type: "section_header",
                value: "2. L'Audit"
            },
            {
                type: "text",
                value: "On a mappé chaque étape du processus. Le constat était sans appel : <strong>95% des actions étaient répétitives et automatisables.</strong> Seule la relation client (le coaching) avait de la valeur."
            },
            {
                type: "section_header",
                value: "3. La Solution : Zero-Touch Onboarding"
            },
            {
                type: "text",
                value: "On a construit un système qui écoute directement les événements de paiement. Plus besoin d'humain dans la boucle administrative."
            },
            {
                type: "section_header",
                value: "4. Le Code Simplifié (Structure Globale)"
            },
            {
                type: "text",
                value: "Voici la structure globale du système (code simplifié pour la lisibilité) :"
            },
            {
                type: "code",
                language: "python",
                value: `from flask import Flask, request
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

    return {"status": "success"}, 200`
            },
            {
                type: "info_box",
                value: "Ce code est simplifié. En production, on ajoute : gestion des erreurs, vérification de la signature Stripe (sécurité), logs pour tracker chaque étape, retry logic (réessayer si ça plante), et tests automatisés."
            },
            {
                type: "section_header",
                value: "4. Tester en conditions réelles"
            },
            {
                type: "text",
                value: "Pendant deux semaines, on a gardé l'ancien onboarding manuel tout en lançant l'automation sur 3 clients volontaires. Chaque action automatique était doublée d'une vérification humaine pour comparer les résultats. C'est comme ça qu'on a ajusté le ton de l'email, l'ordre des étapes et le timing des invitations Calendly."
            },
            {
                type: "section_header",
                value: "Résultats"
            },
            {
                type: "text",
                value: "Le système tourne aujourd'hui en autonomie totale. Le temps de gestion par client est passé de <strong>45 min à 0 min</strong>. Le taux d'erreur est nul. Et surtout, le client reçoit ses accès dans la seconde après son paiement, effet 'Wow' garanti."
            }
        ]
    }
];
