import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Prendre rendez-vous',
    description: 'Réservez un créneau pour discuter de votre projet ou envoyez-nous un message. Solutions techniques, web et stratégie.',
};

export default function RendezVousLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
