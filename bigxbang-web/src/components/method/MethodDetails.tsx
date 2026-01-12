"use client";

import React from "react";

// Layout - Reusing the same layout as Case Studies for consistency
import { CaseStudyLayout, Section, SectionHeader } from "@/components/case-studies/CaseStudyLayout";
import { Paragraph } from "@/components/case-studies";

// Page metadata
const META = {
    slug: "notre-methode",
    title: "Notre Méthode",
    subtitle: "Une approche chirurgicale pour transformer le chaos en clarté. Trois étapes, zéro bullshit.",
    badge: "La Méthode BigXBang",
};

interface MethodDetailsProps {
    mode?: 'page' | 'modal';
    onClose?: () => void;
}

export default function MethodDetails({ mode = 'page', onClose }: MethodDetailsProps) {
    return (
        <CaseStudyLayout meta={META} mode={mode} onClose={onClose}>

            {/* PLACEHOLDER - Content will be added later */}
            <Section withBorder={false}>
                <SectionHeader>
                    Contenu à venir
                </SectionHeader>
                <Paragraph>
                    Cette page détaillera notre méthodologie en trois étapes : Immersion, Architecture, et Exécution.
                </Paragraph>
            </Section>

        </CaseStudyLayout>
    );
}
