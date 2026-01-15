import { CASE_STUDIES } from "@/data/case-studies";
import { Metadata } from 'next';
import { notFound } from "next/navigation";

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const study = CASE_STUDIES.find((s) => s.slug === slug);

    if (!study) return {};

    return {
        title: study.title,
        description: study.subtitle,
    };
}

export default function CaseStudyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
