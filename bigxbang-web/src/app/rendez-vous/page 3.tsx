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

            {/* Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <QuantumFlowBackground />
                {/* Subtle deep nebula effect */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#306EE8] opacity-[0.05] blur-[150px] rounded-full animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-28 pb-20">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="font-clash text-4xl md:text-5xl font-medium text-white mb-6">
                        Prendre rendez-vous
                    </h1>
                    <p className="font-jakarta text-lg text-white/50 max-w-xl mx-auto">
                        Choisissez un créneau dans notre agenda pour une démonstration, ou contactez-nous directement via le formulaire.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">

                    {/* Left Column: Calendar */}
                    <div className="w-full">
                        <BookingCalendar />
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="w-full lg:h-full">
                        <ContactForm className="lg:h-full" />
                    </div>

                </div>
            </div>
        </main>
    );
}
