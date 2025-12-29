"use client";

import React from "react";
import { CaseStudyLayout, Section, SectionHeader } from "@/components/case-studies/CaseStudyLayout";
import { CodeWindow, InfoBox, SectionTitle, Paragraph, BulletList, Strong } from "@/components/case-studies";
import { IconBox } from "@/components/case-studies/IconBox";

// Lottie Icons
import LightBulbIcon from "@/../public/icons/Light bulb.json";
import LoupeIcon from "@/../public/icons/Loupe.json";
import CodeIcon from "@/../public/icons/Code.json";
import SuccessIcon from "@/../public/icons/Success.json";
import BrainIcon from "@/../public/icons/Brain.json";

// Page metadata
const META = {
    slug: "prospection-refonte",
    title: "Pipeline de prospection B2B",
    subtitle: "Comment on a transformé 7 heures de travail répétitif en 47 minutes d'exécution automatique. Pas pour remplacer l'humain, mais pour lui rendre son temps de réflexion.",
    metrics: [
        { number: "47min", label: "Temps machine" },
        { number: "7h", label: "Temps humain libéré" },
        { number: "200", label: "Prospects qualifiés" },
        { number: "90%+", label: "Emails vérifiés" },
    ]
};

interface ProspectionRefonteProps {
    mode?: 'page' | 'modal';
    onClose?: () => void;
}

export default function ProspectionRefonte({ mode = 'page', onClose }: ProspectionRefonteProps) {
    return (
        <CaseStudyLayout meta={META} mode={mode} onClose={onClose}>

            {/* LE CONTEXTE */}
            <Section withBorder={false}>
                <SectionHeader icon={<IconBox animation={LightBulbIcon} />}>
                    Le contexte : l&apos;automatisation comme miroir
                </SectionHeader>

                <Paragraph>
                    Chercher des prospects B2B à la main, c&apos;est un rituel absurde : 7 heures pour trouver 100 entreprises, copier-coller leurs infos dans un tableur, vérifier manuellement si les emails sont valides, chercher les profils LinkedIn un par un.
                </Paragraph>

                <Paragraph>
                    <Strong>Ce que ça révèle :</Strong> Cette tâche n&apos;a jamais été du travail intellectuel. C&apos;est de la répétition pure. Une logique figée qu&apos;un humain exécute en mode automatique.
                </Paragraph>

                <Paragraph>
                    La vraie question : <Strong>Pourquoi un humain passe-t-il 7 heures à faire ce qu&apos;une machine peut faire en 47 minutes ?</Strong>
                </Paragraph>

                <InfoBox title="L'automatisation révèle l'absurdité">
                    Quand on automatise, on voit enfin ce qui, dans notre travail, n&apos;était plus vraiment du travail. Juste de la répétition. L&apos;IA ne fait qu&apos;amplifier la logique qu&apos;on lui donne : si tu lui donnes du chaos, elle reproduit le chaos. Si tu lui donnes de la clarté, elle libère du temps.
                </InfoBox>

                <SectionTitle>Le problème concret</SectionTitle>
                <BulletList items={[
                    <><Strong>7h de copier-coller</Strong> pour collecter 100 prospects (nom, entreprise, secteur, contacts)</>,
                    <><Strong>50% d&apos;emails faux ou obsolètes</Strong> parce qu&apos;on ne vérifie rien</>,
                    <><Strong>Mental saturé</Strong> : impossible de réfléchir stratégiquement après 7h de répétition</>,
                    <><Strong>Aucune valeur créée</Strong> : juste du transport de données</>,
                ]} />

                <Paragraph>
                    On voulait construire un système qui fait ce travail à notre place, automatiquement, en respectant les limites des outils et la législation (RGPD).
                </Paragraph>

                <Paragraph>
                    <Strong>Mais avant de coder quoi que ce soit, on observe.</Strong> Toujours. Parce qu&apos;automatiser un process qu&apos;on ne comprend pas, c&apos;est juste reproduire le chaos plus vite.
                </Paragraph>
            </Section>

            {/* OBSERVER LE RÉEL */}
            <Section>
                <SectionHeader icon={<IconBox animation={LoupeIcon} />}>
                    Observer le réel
                </SectionHeader>

                <Paragraph>
                    Pendant 3 jours, on a suivi le process manuel de A à Z. Pas pour juger, mais pour comprendre : où ça bloque, ce qui se répète, comment circule l&apos;information.
                </Paragraph>

                <SectionTitle>Ce qu&apos;on a observé, chrono en main</SectionTitle>
                <Paragraph>
                    On a suivi la collecte manuelle de 10 prospects pour comprendre le temps réel passé sur chaque étape :
                </Paragraph>

                <BulletList items={[
                    <><Strong>15 min sur LinkedIn</Strong> : Chercher des entreprises par secteur, vérifier les profils</>,
                    <><Strong>12 min sur Google</Strong> : Trouver les sites web, vérifier qu&apos;ils sont actifs</>,
                    <><Strong>8 min sur Excel</Strong> : Copier-coller nom, secteur, ville, URL dans le tableur</>,
                    <><Strong>10 min à deviner les emails</Strong> : Tester prénom.nom@, contact@, info@... sans certitude</>,
                    <><Strong>5 min de vérification</Strong> : Retours sur LinkedIn pour compléter les infos manquantes</>,
                ]} />

                <Paragraph>
                    <Strong>Total : 50 minutes pour 10 prospects.</Strong> Extrapolé sur 100 prospects, ça fait 8h+ de travail répétitif.
                </Paragraph>

                <SectionTitle>Les patterns identifiés</SectionTitle>
                <Paragraph>
                    <Strong>Le constat :</Strong> 90% de ce process est de la logique pure. Pas de créativité, pas de décision stratégique. Juste des règles répétées en boucle :
                </Paragraph>

                <BulletList items={[
                    "Chercher \"agence de communication Paris\" → Toujours la même requête, juste les mots qui changent",
                    "Copier nom entreprise → Coller dans Excel colonne B → Répété 100 fois",
                    "Deviner format email → Tester 3-4 variantes → Sans jamais être sûr",
                    "Vérifier site web → Cliquer → Regarder 10 secondes → Revenir",
                ]} />

                <Paragraph>
                    Si un humain peut décrire une tâche en 3 étapes claires et répétables, une machine peut la faire. C&apos;est exactement ce qu&apos;on a vu ici.
                </Paragraph>

                <InfoBox title="Terrain > théorie">
                    On n&apos;automatise jamais un process qu&apos;on ne comprend pas. Observer le réel, c&apos;est identifier ce qui se répète, ce qui bloque, ce qui pourrait tourner tout seul. Clarifier avant d&apos;optimiser.
                </InfoBox>

                <Paragraph>
                    Cette observation nous a révélé 4 étapes clés à automatiser : <Strong>recherche d&apos;entreprises</Strong>, <Strong>enrichissement social</Strong>, <Strong>vérification des contacts</Strong>, <Strong>export structuré</Strong>.
                </Paragraph>
            </Section>

            {/* CONSTRUIRE LE SYSTÈME */}
            <Section>
                <SectionHeader icon={<IconBox animation={CodeIcon} />}>
                    Construire le système : 3 piliers
                </SectionHeader>

                <Paragraph>
                    Une fois l&apos;architecture clarifiée, on construit. Trois piliers : <Strong>le pipeline</Strong> (orchestration), <Strong>la résilience</Strong> (gestion des crashs), <Strong>l&apos;enrichissement intelligent</Strong> (respect des APIs).
                </Paragraph>

                <SectionTitle>1. Le pipeline : chef d&apos;orchestre invisible</SectionTitle>
                <Paragraph>
                    Le pipeline, c&apos;est le chef d&apos;orchestre. Il coordonne tous les outils, gère le flux de données, assure que chaque étape se fait dans le bon ordre.
                </Paragraph>

                <InfoBox title="C'est quoi un pipeline ?">
                    Un pipeline, c&apos;est une suite d&apos;étapes automatiques. Comme une chaîne de production : chaque étape transforme les données et les passe à l&apos;étape suivante. Ici, ça part d&apos;une liste d&apos;entreprises et ça finit par un fichier de prospects qualifiés, sans intervention humaine.
                </InfoBox>

                <CodeWindow title="pipeline.py">
                    {`def run_pipeline(output_csv: str = "prospects_unifies.csv") -> pd.DataFrame:
    """Fonction principale qui orchestre la collecte multi-segments"""
    logger.info(f"=== LANCEMENT PIPELINE (Target: {TARGET_TOTAL}) ===")

    try:
        unified_results: List[UnifiedProspect] = []
        completed_segments = []

        # Reprise automatique si crash détecté
        if _checkpoint_manager.has_checkpoint():
            logger.warning("⚠️ Checkpoint détecté - reprise en cours...")
            checkpoint_data = _checkpoint_manager.load_last_checkpoint()
            if checkpoint_data:
                unified_results = checkpoint_data.get("prospects", [])
                completed_segments = checkpoint_data.get("completed_segments", [])

        # Collecte par segment (PME, Studios, Locales)
        for segment_name, collector in SEGMENT_COLLECTORS:
            if segment_name in completed_segments:
                logger.info(f"⏭️ Segment {segment_name} déjà terminé")
                continue

            target = TARGETS_CONFIG.get(segment_name, 0)
            if target > 0:
                segment_prospects = collector(target)
                unified_results.extend(segment_prospects)
                completed_segments.append(segment_name)

                # Checkpoint après chaque segment (sécurité)
                _checkpoint_manager.save_checkpoint(
                    prospects=unified_results,
                    segment_name=segment_name
                )

        # Déduplication intelligente
        df = unify_dicts(unified_results)
        df = df.drop_duplicates(subset=["email", "linkedin", "company_name"])

        # Export CSV final
        df.to_csv(output_csv, index=False, encoding="utf-8")
        logger.info(f"💾 CSV généré → {output_csv} ({len(df)} lignes)")

        _checkpoint_manager.clear_checkpoints()
        return df

    except Exception as e:
        logger.error(f"❌ Erreur pipeline: {e}")
        logger.error("💡 Les checkpoints conservés - relancez pour reprendre")
        raise`}
                </CodeWindow>

                <SectionTitle>2. La résilience : construire pour la durée</SectionTitle>
                <Paragraph>
                    Le système peut crasher. C&apos;est normal. Une API qui plante, un quota épuisé, une coupure réseau : ça arrive. L&apos;important, c&apos;est de savoir reprendre.
                </Paragraph>

                <Paragraph>
                    <Strong>Le système de checkpoint :</Strong> Après chaque segment collecté (PME, Studios, Locales), on sauvegarde l&apos;état complet. Si ça plante au milieu du segment 2, on ne recommence pas tout : on reprend là où on s&apos;est arrêté.
                </Paragraph>

                <CodeWindow title="checkpoint_manager.py">
                    {`def save_checkpoint(self, prospects: List, segment_name: str) -> None:
    """Sauvegarde l'état complet après chaque segment"""
    checkpoint_file = os.path.join(
        self.checkpoint_dir,
        f"checkpoint_{segment_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    )

    checkpoint_data = {
        "timestamp": datetime.now().isoformat(),
        "segment": segment_name,
        "prospects_count": len(prospects),
        "prospects": prospects,
        "progress_info": {
            "completed_segments": completed_segments
        }
    }

    with open(checkpoint_file, 'w', encoding='utf-8') as f:
        json.dump(checkpoint_data, f, ensure_ascii=False, indent=2)

    self.logger.info(f"💾 Checkpoint sauvegardé: {len(prospects)} prospects")`}
                </CodeWindow>

                <Paragraph>
                    <Strong>Ce que ce code fait en langage clair :</Strong>
                </Paragraph>
                <BulletList items={[
                    "À chaque fin de segment (PME, Studios, Locales), il sauvegarde tout dans un fichier JSON avec timestamp",
                    "Ce fichier contient : tous les prospects collectés jusqu'ici + la liste des segments terminés",
                    "Si le système crash, au redémarrage il charge ce fichier et reprend au segment suivant",
                    "Résultat : on ne perd jamais plus d'un segment de travail, même en cas de crash",
                ]} />

                <Paragraph>
                    <Strong>Philosophie :</Strong> L&apos;IA amplifie ce qu&apos;on lui donne. Si on lui donne de la fragilité, elle plante. Si on lui donne de la résilience, elle tient.
                </Paragraph>

                <SectionTitle>3. L&apos;enrichissement intelligent : respecter les outils</SectionTitle>
                <Paragraph>
                    Dropcontact vérifie et enrichit les emails. Mais leur API utilise un système de <Strong>polling</Strong> : tu envoies une requête, tu attends qu&apos;elle soit traitée, tu récupères le résultat.
                </Paragraph>

                <InfoBox title="Le polling, c'est quoi ?">
                    Le polling, c&apos;est comme attendre un colis : tu envoies ta commande, puis tu reviens régulièrement voir si c&apos;est prêt. L&apos;API Dropcontact ne te répond pas immédiatement : elle te donne un numéro de suivi, et tu dois revenir vérifier si le traitement est terminé.
                </InfoBox>

                <Paragraph>
                    <Strong>Le problème :</Strong> Si tu demandes trop vite (&quot;C&apos;est prêt ? C&apos;est prêt ? C&apos;est prêt ?&quot;), tu surcharges l&apos;API et elle te bloque. Si tu attends trop longtemps, tu perds du temps.
                </Paragraph>

                <Paragraph>
                    <Strong>La solution :</Strong> Exponential backoff. On commence par attendre 10 secondes, puis 15s, 20s, 30s... jusqu&apos;à 60s max. On s&apos;adapte progressivement à la vitesse de traitement de l&apos;API.
                </Paragraph>

                <CodeWindow title="dropcontact_enrich.py">
                    {`def dropcontact_enrich_batch_polling(batch_prospects: List[Dict]) -> List[Dict]:
    """Enrichissement avec polling et exponential backoff"""

    # Préparer le batch pour Dropcontact
    dropcontact_batch = [
        {
            "first_name": p.get("prenom", ""),
            "last_name": p.get("nom", ""),
            "company": p.get("entreprise_nom", ""),
            "num_siren": p.get("siren", ""),
        }
        for p in batch_prospects
    ]

    # Envoyer la requête initiale
    resp = requests.post(
        "https://api.dropcontact.com/v1/enrich/all",
        headers=dropcontact_headers,
        json={"data": dropcontact_batch, "siren": True, "language": "fr"}
    )

    request_id = resp.json().get("request_id")

    # Exponential backoff: 10s, 15s, 20s, 30s, 45s, 60s...
    delays = [10, 15, 20, 30, 30, 45, 45, 60, 60, 60]
    total_time = 0

    for attempt, delay in enumerate(delays, 1):
        logger.info(f"⏳ Tentative {attempt} - Attente {delay}s (total: {total_time}s)")
        time.sleep(delay)
        total_time += delay

        # Vérifier si le résultat est prêt
        result_url = f"https://api.dropcontact.com/v1/enrich/all/{request_id}"
        result_resp = requests.get(result_url, headers=dropcontact_headers)

        if result_resp.status_code == 200:
            result_data = result_resp.json()
            if result_data.get("success"):
                logger.info(f"✅ Enrichissement terminé en {total_time}s")
                return result_data.get("data", [])

    return []`}
                </CodeWindow>

                <Paragraph>
                    <Strong>Ce que ce code fait en langage clair :</Strong>
                </Paragraph>
                <BulletList items={[
                    "On envoie une requête avec 10 prospects à Dropcontact → on reçoit un numéro de suivi (request_id)",
                    "On attend 10 secondes, puis on vérifie si c'est prêt. Pas prêt ? On attend 15s. Toujours pas ? 20s. Puis 30s...",
                    "On augmente progressivement l'attente jusqu'à 60s max, pour ne pas spammer l'API",
                    "Dès que l'API répond \"success: true\", on récupère les données enrichies et on passe au batch suivant",
                ]} />

                <InfoBox title="Simplicité > sophistication">
                    On ne force pas les APIs. On s&apos;adapte. Le rate limiting, l&apos;exponential backoff, les retries : c&apos;est du respect pour les outils qu&apos;on utilise. Une bonne automation, c&apos;est celle qui dure, pas celle qui impressionne pendant 5 minutes avant de planter.
                </InfoBox>
            </Section>

            {/* LES RÉSULTATS */}
            <Section>
                <SectionHeader icon={<IconBox animation={SuccessIcon} />}>
                    Les résultats
                </SectionHeader>

                <SectionTitle>Avant l&apos;automation</SectionTitle>
                <BulletList items={[
                    <><Strong>7h de collecte manuelle</Strong> par session</>,
                    <><Strong>Emails non vérifiés</Strong> (50% de taux de bounce)</>,
                    <><Strong>Process différent</Strong> selon qui le fait (inconsistance)</>,
                    <><Strong>Aucune valeur créée</Strong> : juste du transport de données</>,
                ]} />

                <SectionTitle>Après l&apos;automation</SectionTitle>
                <BulletList items={[
                    <><Strong>47 min d&apos;exécution machine</Strong> pendant que l&apos;humain fait autre chose</>,
                    <><Strong>Temps humain retrouvé</Strong> pour analyser, créer, décider</>,
                    <><Strong>Emails vérifiés à 90%+</Strong> grâce à Dropcontact</>,
                    <><Strong>Process identique</Strong> à chaque exécution (fiabilité)</>,
                    <><Strong>Valeur créée</Strong> : l&apos;humain se concentre sur la stratégie</>,
                ]} />

                <InfoBox title="Le but : libérer le temps humain">
                    On n&apos;automatise pas pour remplacer les gens. On automatise pour leur rendre leur capacité à penser, créer, décider. Une bonne automation se fait oublier : elle tourne en silence pendant que tu te concentres sur ce qui compte vraiment.
                </InfoBox>
            </Section>

            {/* CE QU'ON A APPRIS */}
            <Section>
                <SectionHeader icon={<IconBox animation={BrainIcon} />}>
                    Ce qu&apos;on a appris : transparence totale
                </SectionHeader>

                <SectionTitle>1. L&apos;architecture modulaire est critique</SectionTitle>
                <Paragraph>
                    Chaque segment (PME, Studios, Locales) est indépendant. Si un segment plante, les autres continuent. On isole les erreurs, on ne les laisse pas contaminer tout le système.
                </Paragraph>

                <SectionTitle>2. Le cache = respect des ressources</SectionTitle>
                <Paragraph>
                    On a implémenté un cache persistant de 90 jours pour les données Apify. Pourquoi repayer pour scraper les mêmes profils Instagram ? On garde en mémoire, on économise les crédits API, on respecte les outils qu&apos;on utilise.
                </Paragraph>

                <SectionTitle>3. La gestion d&apos;erreurs &gt; le code parfait</SectionTitle>
                <Paragraph>
                    Le système peut crasher. C&apos;est normal. L&apos;important, c&apos;est qu&apos;il sache reprendre là où il s&apos;est arrêté. Les checkpoints, les logs détaillés, les retry logic : c&apos;est du respect pour l&apos;utilisateur.
                </Paragraph>

                <CodeWindow title="error_handling.py">
                    {`try:
    # Tentative d'enrichissement Dropcontact
    enriched_data = dropcontact_enrich_batch(prospects)
except Exception as e:
    # Logger l'erreur mais continuer le process
    logger.error(f"❌ Erreur Dropcontact: {e}")

    # Sauvegarder les prospects non enrichis quand même
    save_prospects_csv_common(prospects, "prospects_partiels.csv")

    # Le pipeline continue avec les autres segments
    pass`}
                </CodeWindow>

                <SectionTitle>4. Observer avant de coder, toujours</SectionTitle>
                <Paragraph>
                    On a passé plusieurs jours à regarder le process manuel avant d&apos;écrire une ligne de code. Cette phase d&apos;observation nous a évité de construire un système qui ne correspond pas au réel. Terrain &gt; théorie.
                </Paragraph>

                <InfoBox title="Transparence > perfection">
                    On te montre les erreurs, les choix, le réel. Pas de bullshit marketing. Le code n&apos;est pas parfait, le système peut crasher. Mais il est résilient, et il libère du temps humain. C&apos;est ça qui compte.
                </InfoBox>
            </Section>

        </CaseStudyLayout>
    );
}
