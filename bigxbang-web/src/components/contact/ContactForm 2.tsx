import { useState } from "react";
import { Loader2, Send, Mail, User, Phone, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ContactForm({ className }: { className?: string }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
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

            if (!res.ok) throw new Error("Erreur lors de l'envoi");

            setIsSuccess(true);
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (error) {
            setError("Une erreur est survenue. Réessayez ou appelez-nous directement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "w-full h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-[#306EE8]/30 bg-[#0a0a0a]/80 backdrop-blur-xl",
                    className
                )}
            >
                <div className="w-16 h-16 rounded-full bg-[#306EE8]/20 flex items-center justify-center mb-6 border border-[#306EE8]/30 shadow-[0_0_30px_rgba(48,110,232,0.3)]">
                    <CheckCircle className="w-8 h-8 text-[#306EE8]" />
                </div>
                <h3 className="font-clash text-2xl font-bold text-white mb-2">Message Reçu</h3>
                <p className="font-jakarta text-gray-400 mb-6">
                    Merci {formData.name || "de nous avoir contacté"}.<br />
                    Nous vous répondrons sous 24h.
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="text-sm text-[#306EE8] hover:text-white transition-colors underline underline-offset-4"
                >
                    Envoyer un autre message
                </button>
            </motion.div>
        );
    }

    return (
        <div className={cn(
            "flex flex-col h-full rounded-2xl border border-white/10 bg-[#0a0a0a]/60 backdrop-blur-md p-8 shadow-2xl relative overflow-hidden",
            className
        )}>
            {/* Decoration Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#306EE8]/5 blur-[80px] rounded-full pointer-events-none -z-10" />

            <h3 className="font-clash text-2xl font-bold text-white mb-6">Contact Direct</h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-full">
                <div className="space-y-1">
                    <label className="text-xs font-jakarta uppercase tracking-wider text-gray-500 ml-1">Identité</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-500 group-focus-within:text-[#306EE8] transition-colors" />
                        <input
                            type="text"
                            placeholder="Votre Nom & Entreprise"
                            required
                            className="w-full bg-[#050505] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#306EE8] focus:ring-1 focus:ring-[#306EE8]/50 transition-all placeholder:text-gray-600"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-jakarta uppercase tracking-wider text-gray-500 ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500 group-focus-within:text-[#306EE8] transition-colors" />
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                required
                                className="w-full bg-[#050505] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#306EE8] focus:ring-1 focus:ring-[#306EE8]/50 transition-all placeholder:text-gray-600"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-jakarta uppercase tracking-wider text-gray-500 ml-1">Tél</label>
                        <div className="relative group">
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-500 group-focus-within:text-[#306EE8] transition-colors" />
                            <input
                                type="tel"
                                placeholder="06 12 34 56 78"
                                className="w-full bg-[#050505] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#306EE8] focus:ring-1 focus:ring-[#306EE8]/50 transition-all placeholder:text-gray-600"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1 flex-1">
                    <label className="text-xs font-jakarta uppercase tracking-wider text-gray-500 ml-1">Projet</label>
                    <div className="relative group h-full">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500 group-focus-within:text-[#306EE8] transition-colors" />
                        <textarea
                            placeholder="Décrivez votre besoin..."
                            required
                            rows={4}
                            className="w-full h-full min-h-[120px] bg-[#050505] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#306EE8] focus:ring-1 focus:ring-[#306EE8]/50 transition-all placeholder:text-gray-600 resize-none"
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-shiny w-full group relative flex items-center justify-center gap-2 mt-2"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : (
                        <>
                            <span>Envoyer le message</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-black group-hover:text-white" />
                        </>
                    )}
                </button>

                <div className="mt-6 text-center pt-6 border-t border-white/5">
                    <p className="text-gray-500 text-xs mb-2">Une urgence ?</p>
                    <a href="tel:+33100000000" className="text-white hover:text-[#306EE8] font-jakarta font-medium transition-colors">
                        +33 1 00 00 00 00
                    </a>
                </div>
            </form>
        </div>
    );
}
