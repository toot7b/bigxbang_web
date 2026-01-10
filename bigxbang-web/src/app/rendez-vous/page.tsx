"use client";

import Navbar from "@/components/layout/Navbar";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { ContactForm } from "@/components/contact/ContactForm";
import dynamic from "next/dynamic";

const QuantumFlowBackground = dynamic(() => import("@/components/ui/QuantumFlowBackground"), { ssr: false });

export default function RendezVousPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
            <Navbar />

            {/* FIX: Use 'fixed' instead of 'absolute' for stable background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <QuantumFlowBackground />
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-28 pb-20">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="font-clash text-4xl md:text-5xl font-medium text-white mb-4">Prendre <span className="text-[#306EE8]">rendez-vous</span></h1>
                    <p className="font-jakarta text-white/50">Choisissez un créneau ou envoyez-nous un message.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-6">
                    <BookingCalendar />
                    <ContactForm />
                </div>

                {/* OLD SCHOOL SECTION */}
                <div className="max-w-6xl mx-auto bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-xl">
                    <h3 className="font-clash text-xl font-medium text-white mb-2">Vous êtes de la vieille école ?</h3>
                    <p className="font-jakarta text-sm text-white/60">
                        Contactez-nous par téléphone au{" "}
                        <a href="tel:+33750932625" className="text-white hover:text-[#306EE8] transition-colors">07 50 93 26 25</a>{" "}
                        ou par mail à l&apos;adresse{" "}
                        <a href="mailto:thomas.sarazin@bigxbang.studio" className="text-white hover:text-[#306EE8] transition-colors">thomas.sarazin@bigxbang.studio</a>.
                    </p>
                </div>
            </div>
        </main>
    );
}
