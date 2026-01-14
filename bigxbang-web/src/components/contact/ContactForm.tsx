"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";
import successAnimation from "../booking/success.json";
import { GradientButton } from "@/components/ui/gradient-button";

export function ContactForm({ className }: { className?: string }) {
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                body: JSON.stringify(formData)
            });
            if (res.ok) setIsSuccess(true);
        } catch (e) { console.error(e); } finally { setIsSubmitting(false); }
    };

    if (isSuccess) return (
        <div className={cn("bg-[#0a0a0a]/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[500px] lg:h-[644px]", className)}>
            <div className="w-24 h-24 mb-6">
                <Lottie animationData={successAnimation} loop={false} />
            </div>

            <h3 className="font-clash text-2xl text-white mb-2">C&apos;est dans la boîte !</h3>
            <div className="font-jakarta text-white/60 text-sm mb-6 max-w-[80%] space-y-2">
                <p>Votre message a bien été envoyé. On a hâte de vous lire.<br />On revient vers vous très vite.</p>
                <p className="text-xs text-white/40">(Un mail de confirmation vous attend. Pensez à vérifier vos spams, on ne sait jamais !)</p>
            </div>

            <button onClick={() => setIsSuccess(false)} className="text-white/40 font-jakarta text-xs hover:text-white transition-colors">
                Envoyer un autre message
            </button>
        </div>
    );

    return (
        <div className={cn("bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col min-h-[500px] lg:h-[644px]", className)}>
            <h3 className="font-clash text-2xl md:text-3xl font-medium text-white mb-6">Nous écrire</h3>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                <input required placeholder="Nom & Entreprise" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#306EE8] focus:bg-[#306EE8]/5 outline-none text-sm placeholder:text-white/30" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required type="email" placeholder="Email" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#306EE8] outline-none text-sm placeholder:text-white/30" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <input type="tel" placeholder="Téléphone" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#306EE8] outline-none text-sm placeholder:text-white/30" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <textarea required placeholder="Votre message..." className="w-full flex-1 min-h-[150px] bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#306EE8] outline-none text-sm placeholder:text-white/30" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />

                <div className="mt-auto pt-4">
                    <GradientButton
                        type="submit"
                        disabled={isSubmitting}
                        hoverText="On l'envoie ?"
                        className="w-full h-12 text-sm"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Envoyer"}
                    </GradientButton>
                </div>
            </form>
        </div>
    );
}
