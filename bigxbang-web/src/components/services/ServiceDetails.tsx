"use client";

import React from "react";

// Layout - Reusing the same layout as Case Studies for consistency
import { CaseStudyLayout, Section, SectionHeader } from "@/components/case-studies/CaseStudyLayout";
import { Paragraph } from "@/components/case-studies";

// Content per service (placeholder for now)
const SERVICE_CONTENT: Record<number, {
    slug: string;
    title: string;
    subtitle: string;
    badge: string;
}> = {
    1: {
        slug: "experience-web",
        title: "Expérience Web",
        subtitle: "Une interface web immersive qui ne ressemble à rien de connu. Performance maximale, design liquide, impact immédiat.",
        badge: "Module 01 // Web",
    },
    2: {
        slug: "le-reseau",
        title: "Le Réseau",
        subtitle: "Connectez vos outils. Automatisez les tâches ingrates. Laissez la machine travailler pendant que vous dormez.",
        badge: "Module 02 // Automation",
    },
    3: {
        slug: "identite-de-marque",
        title: "Identité de Marque",
        subtitle: "Créez une identité visuelle forte et cohérente. Du logo aux guidelines, tout ce qu'il faut pour marquer les esprits.",
        badge: "Module 03 // Brand",
    },
};

interface ServiceDetailsProps {
    serviceId: number;
    mode?: 'page' | 'modal';
    onClose?: () => void;
}

export default function ServiceDetails({ serviceId, mode = 'page', onClose }: ServiceDetailsProps) {
    const content = SERVICE_CONTENT[serviceId] || SERVICE_CONTENT[1];

    const meta = {
        slug: content.slug,
        title: content.title,
        subtitle: content.subtitle,
        badge: content.badge,
    };

    return (
        <CaseStudyLayout meta={meta} mode={mode} onClose={onClose}>

            {/* PLACEHOLDER - Content will be added later */}
            <Section withBorder={false}>
                <SectionHeader>
                    Contenu à venir
                </SectionHeader>
                <Paragraph>
                    Cette page détaillera l&apos;offre {content.title} avec ses fonctionnalités, cas d&apos;usage et tarifs.
                </Paragraph>
            </Section>

        </CaseStudyLayout>
    );
}
