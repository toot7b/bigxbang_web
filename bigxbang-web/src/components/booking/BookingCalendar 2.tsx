"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle, Clock, Calendar as CalendarIcon, MapPin, User, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Service {
    id: string;
    name: string;
    duration: string;
}

export function BookingCalendar({ className }: { className?: string }) {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Slots State
    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Initial Load
    useEffect(() => {
        const loadServices = async () => {
            try {
                const res = await fetch("/api/booking/services");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setServices(data);
                    if (data.length > 0) setSelectedService(data[0]);
                }
            } catch (e) { console.error(e); }
        };
        loadServices();
    }, []);

    // Load Slots
    useEffect(() => {
        if (!selectedService || !selectedDate) return;
        setIsLoadingSlots(true);
        setSlots([]);

        // Fix: Use EN locale for API (Zoho expects 12-Jan-2024 not 12-janv.-2024)
        const dateStr = format(selectedDate, "dd-MMM-yyyy", { locale: enUS });

        const staffId = process.env.NEXT_PUBLIC_ZOHO_STAFF_ID || "253350000000045014";

        fetch(`/api/booking/availability?service_id=${selectedService.id}&staff_id=${staffId}&date=${dateStr}`)
            .then(res => res.json())
            .then(data => setSlots(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setIsLoadingSlots(false));

    }, [selectedDate, selectedService]);

    const handleDateSelect = (day: Date) => {
        setSelectedDate(day);
        setSelectedSlot(null);
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedService || !selectedSlot || !selectedDate) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/booking/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    service_id: selectedService.id,
                    staff_id: "253350000000045014",
                    // Use EN locale for API submission too
                    date: format(selectedDate, "dd-MMM-yyyy", { locale: enUS }),
                    time: selectedSlot,
                    customer_name: formData.name,
                    customer_email: formData.email,
                    phone: formData.phone,
                    notes: formData.notes
                })
            });
            const data = await res.json();
            if (res.ok) setIsSuccess(true);
            else throw new Error(data.error);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la réservation via Zoho.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
    });

    if (isSuccess) {
        return (
            <div className={cn("bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center", className)}>
                <div className="w-16 h-16 rounded-full bg-[#306EE8]/20 flex items-center justify-center mb-6 border border-[#306EE8]/30">
                    <CheckCircle className="w-8 h-8 text-[#306EE8]" />
                </div>
                <h3 className="font-clash text-2xl font-medium text-white mb-2">Réservation Confirmée</h3>
                <p className="font-jakarta text-white/50 mb-8 max-w-sm">
                    Un email de confirmation vous a été envoyé. Le rendez-vous est bloqué dans notre agenda.
                </p>
                <button
                    onClick={() => { setIsSuccess(false); setSelectedDate(null); setSelectedSlot(null); }}
                    className="text-sm text-[#306EE8] hover:text-white transition-colors underline decoration-[#306EE8]/30 hover:decoration-white"
                >
                    Réserver un autre créneau
                </button>
            </div>
        );
    }

    return (
        <div className={cn("w-full flex flex-col gap-6", className)}>
            {/* Calendar Card */}
            <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#306EE8]/5 blur-[60px] rounded-full -z-10 group-hover:bg-[#306EE8]/10 transition-colors" />

                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                        <span className="block font-clash text-lg font-medium text-white capitalize">
                            {format(currentMonth, "MMMM yyyy", { locale: fr })}
                        </span>
                        <span className="text-xs text-white/30 font-jakarta uppercase tracking-wider">Europe/Paris</span>
                    </div>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-7 mb-4">
                    {["lu", "ma", "me", "je", "ve", "sa", "di"].map(d => (
                        <div key={d} className="text-center text-xs font-jakarta text-white/20 uppercase tracking-widest py-1">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => {
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isPast = isBefore(day, startOfToday());

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => !isPast && handleDateSelect(day)}
                                disabled={isPast}
                                className={cn(
                                    "aspect-square rounded-lg flex items-center justify-center text-sm font-jakarta transition-all relative font-medium",
                                    !isCurrentMonth && "opacity-0 pointer-events-none",
                                    isPast && "text-white/10 cursor-not-allowed line-through decoration-white/10",
                                    !isPast && isCurrentMonth && "text-white/80 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10",
                                    isSelected && "bg-[#306EE8] text-white shadow-[0_0_20px_rgba(48,110,232,0.4)] z-10 !border-transparent scale-105"
                                )}
                            >
                                {format(day, "d")}
                            </button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {selectedDate && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                            <h3 className="font-clash text-white text-lg flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-[#306EE8]" />
                                <span className="capitalize">{format(selectedDate, "EEEE d MMMM", { locale: fr })}</span>
                            </h3>
                            {selectedSlot && (
                                <button onClick={() => setSelectedSlot(null)} className="text-xs text-white/40 hover:text-white underline">
                                    Changer l'heure
                                </button>
                            )}
                        </div>

                        {!selectedSlot ? (
                            <>
                                {isLoadingSlots ? (
                                    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#306EE8]" /></div>
                                ) : slots.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {slots.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className="py-2.5 px-3 rounded-lg bg-white/5 border border-white/5 hover:bg-[#306EE8] hover:border-[#306EE8] text-sm text-white/80 hover:text-white transition-all font-jakarta shadow-sm hover:shadow-[0_0_15px_rgba(48,110,232,0.3)]"
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-white/30 text-sm">Aucun créneau disponible ce jour-là.</div>
                                )}
                            </>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onSubmit={handleBooking}
                                className="space-y-4"
                            >
                                <div className="p-3 bg-[#306EE8]/10 border border-[#306EE8]/20 rounded-lg flex items-center gap-3 mb-6">
                                    <Clock className="w-4 h-4 text-[#306EE8]" />
                                    <span className="text-sm text-[#306EE8] font-medium">Créneau de {selectedSlot} sélectionné</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 w-4 h-4 text-white/30 group-focus-within:text-[#306EE8] transition-colors" />
                                        <input
                                            type="text" placeholder="Nom complet" required
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#306EE8] transition-colors text-sm"
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-3 w-4 h-4 text-white/30 group-focus-within:text-[#306EE8] transition-colors" />
                                        <input
                                            type="email" placeholder="Email professionnel" required
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#306EE8] transition-colors text-sm"
                                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-3 w-4 h-4 text-white/30 group-focus-within:text-[#306EE8] transition-colors" />
                                        <input
                                            type="tel" placeholder="Téléphone"
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#306EE8] transition-colors text-sm"
                                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <textarea
                                            placeholder="Sujet ou message (optionnel)"
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#306EE8] transition-colors text-sm min-h-[80px] resize-none"
                                            value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-shiny w-full flex items-center justify-center gap-2 mt-4"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : "Confirmer la visite"}
                                </button>
                            </motion.form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
