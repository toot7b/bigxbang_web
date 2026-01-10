"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle, ArrowRight, CornerRightDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ContactForm({ className }: { className?: string }) {
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setIsSuccess(true);
                setFormData({ name: "", email: "", phone: "", message: "" });
            } else {
                throw new Error("Failed to send");
            }
        } catch (err) {
            setError("Erreur lors de l'envoi. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className={cn("bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center h-full min-h-[400px]", className)}>
                <div className="w-16 h-16 rounded-full bg-[#306EE8]/20 flex items-center justify-center mb-6 border border-[#306EE8]/30">
                    <CheckCircle className="w-8 h-8 text-[#306EE8]" />
                </div>
                <h3 className="font-clash text-2xl font-medium text-white mb-2">Message Reçu</h3>
                <p className="font-jakarta text-white/50 mb-8 max-w-sm">
                    Nous avons bien reçu votre demande. Notre équipe vous répondra sous 24h.
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="text-sm text-[#306EE8] hover:text-white transition-colors underline decoration-[#306EE8]/30 hover:decoration-white"
                >
                    Envoyer un autre message
                </button>
            </div>
        );
    }

    return (
        <div className={cn("bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8 shadow-xl h-full flex flex-col relative overflow-hidden", className)}>

            {/* Ambient Glow */}
            <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] bg-[#306EE8]/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2 opacity-50">
                    <CornerRightDown className="w-5 h-5 text-[#306EE8]" />
                    <span className="font-jakarta text-xs uppercase tracking-widest text-[#306EE8]">Direct Message</span>
                </div>
                <h3 className="font-clash text-3xl font-medium text-white">Nous écrire</h3>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
                <div className="space-y-1">
                    <label className="text-xs font-jakarta uppercase tracking-wider text-white/30 ml-1">Identité</label>
                    <input
                        type="text" placeholder="Nom & Entreprise" required
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#306EE8] transition-colors text-sm placeholder:text-white/20"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-jakarta uppercase tracking-wider text-white/30 ml-1">Email</label>
                        <input
                            type="email" placeholder="email@exemple.com" required
                            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#306EE8] transition-colors text-sm placeholder:text-white/20"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-jakarta uppercase tracking-wider text-white/30 ml-1">Téléphone</label>
                        <input
                            type="tel" placeholder="06..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#306EE8] transition-colors text-sm placeholder:text-white/20"
                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1 flex-1">
                    <label className="text-xs font-jakarta uppercase tracking-wider text-white/30 ml-1">Projet</label>
                    <textarea
                        placeholder="Décrivez votre besoin..." required
                        className="w-full h-full min-h-[150px] bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#306EE8] transition-colors text-sm placeholder:text-white/20 resize-none"
                        value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                    />
                </div>

                {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-shiny w-full group relative flex items-center justify-center gap-2 mt-4"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : (
                        <>
                            <span>Envoyer le message</span>
                            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
