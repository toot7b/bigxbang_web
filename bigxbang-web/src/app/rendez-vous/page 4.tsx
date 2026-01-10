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

            {/* FIX: Use 'fixed' instead of 'absolute' so the background doesn't stretch/shift when content grows */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <QuantumFlowBackground />
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-28 pb-20">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="font-clash text-4xl md:text-5xl font-medium text-white mb-4">Prendre rendez-vous</h1>
                    <p className="font-jakarta text-white/50">Choisissez un créneau ou envoyez-nous un message.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <BookingCalendar />
                    {/* ContactForm will check its own height, grid items-start prevents forced stretching if h-full is removed */}
                    <ContactForm />
                </div>
            </div>
        </main>
    );
}
