import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mentions Légales',
    description: 'Informations légales, protection des données (RGPD) et crédits du site BigxBang Studio.',
};

export default function MentionsLegales() {
    return (
        <div className="min-h-screen w-full bg-black">
            <main className="max-w-4xl mx-auto py-20 px-4 md:px-8 text-white">
                <nav className="mb-12">
                    <Link href="/" className="inline-block mb-12">
                        <GradientButton
                            variant="ghost"
                            theme="dark"
                            className="gap-3 px-6 rounded-full whitespace-nowrap"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Retour à l&apos;accueil</span>
                        </GradientButton>
                    </Link>
                    <h1 className="font-clash text-4xl md:text-5xl font-medium mb-4">Mentions Légales</h1>
                    <p className="text-white/60">Dernière mise à jour : 14 janvier 2026</p>
                </nav>

                <div className="space-y-12 text-gray-300 font-sans leading-relaxed">

                    {/* SECTION 1 */}
                    <section>
                        <h2 className="font-clash text-2xl text-white mb-4">1. ÉDITEUR DU SITE</h2>
                        <p>Le présent site, accessible à l'adresse <a href="https://bigxbang.studio" className="text-blue-400 hover:underline">https://bigxbang.studio</a>, est édité par :</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-white/80">
                            <li><strong>Thomas Sarazin</strong>, micro-entrepreneur.</li>
                            <li>Immatriculé sous le numéro SIREN <strong>992 780 635</strong>.</li>
                            <li>Adresse : Disponible sur demande</li>
                            <li>Email : <a href="mailto:thomas.sarazin@bigxbang.studio" className="text-blue-400 hover:underline">thomas.sarazin@bigxbang.studio</a></li>
                            <li>Directeur de la publication : Thomas Sarazin</li>
                        </ul>
                    </section>

                    {/* SECTION 2 */}
                    <section>
                        <h2 className="font-clash text-2xl text-white mb-4">2. HÉBERGEMENT ET NOM DE DOMAINE</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-white font-medium mb-1">Hébergement :</h3>
                                <p>Le site est hébergé par <strong>Vercel Inc.</strong>, société américaine.<br />
                                    Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
                                    Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://vercel.com</a></p>
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Nom de domaine :</h3>
                                <p>Le nom de domaine est enregistré via <strong>Squarespace Domains, LLC</strong>,<br />
                                    225 Varick Street, 12th Floor, New York, NY 10014, USA<br />
                                    Site web : <a href="https://domains.squarespace.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://domains.squarespace.com</a></p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3 */}
                    <section>
                        <h2 className="font-clash text-2xl text-white mb-4">3. PROPRIÉTÉ INTELLECTUELLE</h2>
                        <p className="mb-4">
                            L'ensemble des éléments présents sur le site (textes, images, graphismes, logo, vidéos, structure, etc.) sont la propriété exclusive de Thomas Sarazin, sauf mention contraire.
                        </p>
                        <p className="mb-4">
                            Le code source du site est distribué sous licence MIT et disponible en open source sur GitHub.<br />
                            Vous êtes libre d'utiliser, modifier et redistribuer le code source, sous réserve de conserver la mention de copyright et la licence MIT.
                        </p>
                        <p className="mb-4">
                            <strong>Lien du repository : </strong>
                            <a href="https://github.com/toot7b/bigxbang_web" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                                https://github.com/toot7b/bigxbang_web
                            </a>
                        </p>
                        <p>
                            Toute reproduction, représentation, modification, publication ou adaptation des contenus éditoriaux (textes, images, marque BigxBang, logo) sans autorisation écrite préalable reste strictement interdite.<br />
                            Toute exploitation non autorisée des contenus éditoriaux constitue une contrefaçon susceptible d'engager la responsabilité de son auteur (articles L.335-2 et suivants du Code de la propriété intellectuelle).
                        </p>
                    </section>

                    {/* SECTION 4 */}
                    <section>
                        <h2 className="font-clash text-2xl text-white mb-4">4. RESPONSABILITÉ</h2>
                        <p className="mb-2">L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, il ne saurait être tenu responsable :</p>
                        <ul className="list-disc pl-5 space-y-1 mb-2 text-white/80">
                            <li>des erreurs ou omissions dans les contenus mis à disposition,</li>
                            <li>des interruptions ou dysfonctionnements du site,</li>
                            <li>ou de tout dommage direct ou indirect résultant de l'accès ou de l'utilisation du site.</li>
                        </ul>
                        <p>L'utilisateur accède au site sous sa seule responsabilité.</p>
                    </section>

                    {/* SECTION 5 */}
                    <section>
                        <h2 className="font-clash text-2xl text-white mb-4">5. PROTECTION DES DONNÉES PERSONNELLES (RGPD)</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-white font-medium mb-1">5.1. Responsable du traitement</h3>
                                <p>Le responsable du traitement des données collectées sur ce site est :<br />
                                    Thomas Sarazin, micro-entrepreneur – <a href="mailto:thomas.sarazin@bigxbang.studio" className="text-blue-400 hover:underline">thomas.sarazin@bigxbang.studio</a></p>
                            </div>

                            <div>
                                <h3 className="text-white font-medium mb-1">5.2. Données collectées</h3>
                                <p className="mb-2">Le site collecte uniquement les données nécessaires à la gestion du formulaire de contact et de la prise de rendez-vous :</p>
                                <ul className="list-disc pl-5 space-y-1 mb-2 text-white/80">
                                    <li>Nom / prénom</li>
                                    <li>Adresse e-mail</li>
                                    <li>Message libre (formulaire de contact)</li>
                                    <li>Créneau de rendez-vous (calendrier)</li>
                                </ul>
                                <p>Aucune autre donnée personnelle (adresse IP, géolocalisation, etc.) n'est collectée sans consentement explicite.</p>
                            </div>

                            <div>
                                <h3 className="text-white font-medium mb-1">5.3. Finalité du traitement</h3>
                                <p className="mb-2">Les données sont utilisées exclusivement pour :</p>
                                <ul className="list-disc pl-5 space-y-1 mb-2 text-white/80">
                                    <li>répondre aux messages envoyés via le formulaire,</li>
                                    <li>gérer les prises de rendez-vous professionnels,</li>
                                    <li>assurer un suivi éventuel des échanges professionnels.</li>
                                </ul>
                                <p>Elles ne font l'objet d'aucune cession ni utilisation commerciale.</p>
                            </div>

                            <div>
                                <h3 className="text-white font-medium mb-1">5.4. Base légale du traitement</h3>
                                <p>Le traitement repose sur le consentement de l'utilisateur (article 6.1.a du RGPD).</p>
                            </div>

                            <div>
                                <h3 className="text-white font-medium mb-1">5.5. Durée de conservation</h3>
                                <p>Les données ne sont pas conservées par le site. Elles transitent uniquement via Resend pour l'envoi d'e-mails, puis sont stockées dans la boîte e-mail professionnelle pendant une durée maximale de 12 mois après le dernier échange, sauf demande de suppression.<br />
                                    Les données de rendez-vous sont conservées dans Zoho Calendar pour la durée nécessaire à la gestion des rendez-vous, puis supprimées automatiquement ou sur simple demande.</p>
                            </div>

                            <div>
                                <h3 className="text-white font-medium mb-1">5.6. Destinataires</h3>
                                <p className="mb-2">Les données collectées sont transmises aux prestataires suivants :</p>
                                <ul className="list-disc pl-5 space-y-4 text-white/80">
                                    <li>
                                        <strong>Resend</strong> (envoi d'e-mails de contact)<br />
                                        Resend, Inc., 340 S Lemon Ave #3223, Walnut, CA 91789, USA<br />
                                        <span className="text-white/60 text-sm">Les données transitent par ce service uniquement pour l'envoi d'e-mails. Conformité RGPD via Standard Contractual Clauses (SCC).</span><br />
                                        <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Politique de confidentialité</a>
                                    </li>
                                    <li>
                                        <strong>Zoho Calendar Europe</strong> (gestion des prises de rendez-vous)<br />
                                        Zoho Corporation Europe B.V., Hoogoorddreef 15, 1101 BA Amsterdam, Netherlands<br />
                                        <span className="text-white/60 text-sm">Les données de rendez-vous sont stockées sur les serveurs européens de Zoho (Hébergement UE).</span><br />
                                        <a href="https://www.zoho.eu/privacy.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Politique de confidentialité</a>
                                    </li>
                                </ul>
                                <p className="mt-2">Aucune donnée n'est vendue ou utilisée à des fins commerciales par ces prestataires.</p>
                            </div>

                            <div>
                                <h3 className="text-white font-medium mb-1">5.7. Sécurité et hébergement</h3>
                                <p>Le site est hébergé par Vercel Inc. (serveurs sécurisés). Les données de contact transitent via Resend (conformité RGPD via SCC) et les données de rendez-vous sont stockées chez Zoho Europe (serveurs situés dans l'Union Européenne). L'ensemble des communications bénéficie d'un chiffrement HTTPS et de mesures de sécurité conformes aux standards européens.</p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 6 */}
                    <section>
                        <h2 className="font-clash text-2xl text-white mb-4">6. DROITS DE L'UTILISATEUR</h2>
                        <p className="mb-2">Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, chaque utilisateur dispose des droits suivants :</p>
                        <ul className="list-disc pl-5 space-y-1 mb-4 text-white/80">
                            <li><strong>Droit d'accès</strong> : obtenir la copie des données le concernant.</li>
                            <li><strong>Droit de rectification</strong> : corriger des données inexactes.</li>
                            <li><strong>Droit d'opposition</strong> : s'opposer à un traitement.</li>
                            <li><strong>Droit à l'effacement</strong> : demander la suppression de ses données.</li>
                            <li><strong>Droit à la portabilité</strong> : recevoir ses données dans un format exploitable.</li>
                        </ul>
                        <p>Pour exercer ces droits, adressez votre demande à : <a href="mailto:thomas.sarazin@bigxbang.studio" className="text-blue-400 hover:underline">thomas.sarazin@bigxbang.studio</a><br />
                            Une réponse sera apportée dans un délai maximum de 30 jours.</p>
                    </section>

                    {/* SECTION 7 */}
                    <section>
                        <h2 className="font-clash text-2xl text-white mb-4">7. COOKIES</h2>
                        <p className="mb-2">Ce site peut utiliser des cookies fonctionnels et analytiques pour :</p>
                        <ul className="list-disc pl-5 space-y-1 mb-2 text-white/80">
                            <li>assurer son bon fonctionnement,</li>
                            <li>mesurer de manière anonyme l'audience et l'expérience utilisateur.</li>
                        </ul>
                        <p className="mb-2">Ces cookies ne permettent pas d'identifier personnellement l'utilisateur.<br />
                            Vous pouvez configurer votre navigateur pour bloquer ou supprimer les cookies à tout moment.</p>
                        <p>En poursuivant la navigation, vous acceptez le dépôt de cookies sur votre terminal.</p>
                    </section>

                    {/* SECTION 8 */}
                    <section>
                        <h2 className="font-clash text-2xl text-white mb-4">8. CRÉDITS</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p><strong>Design & développement :</strong> Thomas Sarazin</p>
                                <p><strong>Hébergement :</strong> Vercel Inc.</p>
                                <p><strong>Nom de domaine :</strong> Squarespace Domains, LLC</p>
                            </div>
                            <div>
                                <p className="mb-1"><strong>Ressources graphiques :</strong></p>
                                <ul className="list-disc pl-5 text-white/80 text-sm">
                                    <li>Illustrations originales : BigxBang Studio</li>
                                    <li>Icônes : Lucide React</li>
                                    <li>Animations : LottieFiles & GSAP</li>
                                </ul>
                            </div>
                            <div className="md:col-span-2">
                                <p className="mb-1"><strong>Polices :</strong></p>
                                <ul className="list-disc pl-5 text-white/80 text-sm">
                                    <li>Plus Jakarta Sans – police principale du site (Google Fonts)</li>
                                    <li>Clash Display – titres et éléments visuels (Fontshare)</li>
                                </ul>
                                <p className="text-white/60 text-sm mt-1">Toutes les polices utilisées sont libres de droits et distribuées sous licence Open Font License (OFL).</p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 9 */}
                    <section>
                        <h2 className="font-clash text-2xl text-white mb-4">9. MODIFICATION DU DOCUMENT</h2>
                        <p>Les présentes mentions légales et la politique de confidentialité peuvent être mises à jour à tout moment pour tenir compte d'évolutions légales, techniques ou éditoriales.</p>
                    </section>

                </div>
            </main>
        </div>
    );
}
