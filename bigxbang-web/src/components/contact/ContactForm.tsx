"use client";

import { useState } from "react";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className={cn("bg-[#0a0a0a]/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]", className)}>
            <div className="w-16 h-16 rounded-full bg-[#306EE8]/20 flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-[#306EE8]" />
            </div>
            <h3 className="font-clash text-2xl text-white mb-2">Message Envoyé</h3>
            <button onClick={() => setIsSuccess(false)} className="text-[#306EE8] underline">Nouveau message</button>
        </div>
    );

    return (
        // FIX: Removed 'h-full' to prevent stretching when the Calendar neighbor grows
        <div className={cn("bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col", className)}>
            <h3 className="font-clash text-3xl font-medium text-white mb-6">Nous écrire</h3>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                <input required placeholder="Nom & Entreprise" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#306EE8] outline-none text-sm placeholder:text-white/30" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                    <input required type="email" placeholder="Email" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#306EE8] outline-none text-sm placeholder:text-white/30" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <input type="tel" placeholder="Téléphone" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#306EE8] outline-none text-sm placeholder:text-white/30" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <textarea required placeholder="Votre message..." className="w-full flex-1 min-h-[150px] bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#306EE8] outline-none text-sm placeholder:text-white/30" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                <button disabled={isSubmitting} className="w-full py-3 bg-[#306EE8] hover:bg-[#2558c2] text-white rounded-lg flex items-center justify-center gap-2 transition-all group">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <>Envoyer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                </button>
            </form>
        </div>
    );
}
