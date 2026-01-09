"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Service { id: string; name: string; duration: string; }

export function BookingCalendar({ className }: { className?: string }) {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Form
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        fetch("/api/booking/services").then(res => res.json()).then(data => {
            if (Array.isArray(data)) { setServices(data); if (data.length) setSelectedService(data[0]); }
        });
    }, []);

    useEffect(() => {
        if (!selectedService || !selectedDate) return;
        setIsLoadingSlots(true);
        setSlots([]);

        // Critical: Zoho needs English date format (e.g., 10-Jan-2024)
        const dateStr = format(selectedDate, "dd-MMM-yyyy", { locale: enUS });

        fetch(`/api/booking/availability?service_id=${selectedService.id}&date=${dateStr}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // FIX: Filter slots to keep only every 2nd slot (15 min -> 30 min intervals)
                    // Zoho sends ["10:00", "10:15", "10:30", "10:45"...]
                    // We want ["10:00", "10:30"...]
                    const filteredSlots = data.filter((_, i) => i % 2 === 0);
                    setSlots(filteredSlots);
                } else {
                    setSlots([]);
                }
            })
            .finally(() => setIsLoadingSlots(false));
    }, [selectedDate, selectedService]);

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
    });

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await fetch("/api/booking/book", {
                method: "POST",
                body: JSON.stringify({
                    service_id: selectedService?.id,
                    // Send date in English to API
                    date: format(selectedDate!, "dd-MMM-yyyy", { locale: enUS }),
                    time: selectedSlot,
                    customer_name: formData.name,
                    customer_email: formData.email,
                    customer_phone: formData.phone,
                    notes: formData.notes
                })
            });
            setIsSuccess(true);
        } catch (e) { console.error(e); } finally { setIsSubmitting(false); }
    };

    if (isSuccess) return (
        <div className={cn("bg-[#0a0a0a]/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center", className)}>
            <div className="w-16 h-16 rounded-full bg-[#306EE8]/20 flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-[#306EE8]" />
            </div>
            <h3 className="font-clash text-2xl text-white mb-2">Réservation Confirmée</h3>
            <button onClick={() => setIsSuccess(false)} className="text-[#306EE8] underline">Nouveau rendez-vous</button>
        </div>
    );

    return (
        <div className={cn("w-full flex flex-col gap-6", className)}>
            <div className="bg-[#0a0a0a]/60 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#306EE8]/5 blur-[60px] rounded-full -z-10 group-hover:bg-[#306EE8]/10 transition-colors" />

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="w-5 h-5 text-white/60 hover:text-white" /></button>
                    <span className="font-clash text-lg text-white capitalize">{format(currentMonth, "MMMM yyyy", { locale: fr })}</span>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="w-5 h-5 text-white/60 hover:text-white" /></button>
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 mb-2 text-center text-xs text-white/30 font-jakarta uppercase">
                    {["l", "m", "m", "j", "v", "s", "d"].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {days.map(day => {
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isCurrent = isSameMonth(day, currentMonth);
                        const isPast = isBefore(day, startOfToday());
                        return (
                            <button
                                key={day.toString()}
                                onClick={() => !isPast && setSelectedDate(day)}
                                disabled={isPast}
                                className={cn(
                                    "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all",
                                    !isCurrent && "invisible",
                                    isPast && "text-white/10 line-through",
                                    !isPast && isCurrent && "text-white/80 hover:bg-white/10",
                                    isSelected && "bg-[#306EE8] text-white shadow-[0_0_15px_rgba(48,110,232,0.4)]"
                                )}
                            >
                                {format(day, "d")}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Slots & Form */}
            <AnimatePresence>
                {selectedDate && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0a]/60 border border-white/10 rounded-2xl p-6">
                        <h3 className="font-clash text-white mb-4 capitalize">{format(selectedDate, "EEEE d MMMM", { locale: fr })}</h3>

                        {!selectedSlot ? (
                            isLoadingSlots ? <Loader2 className="animate-spin text-[#306EE8] mx-auto" /> :
                                slots.length ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        {slots.map(slot => (
                                            <button key={slot} onClick={() => setSelectedSlot(slot)} className="py-2 px-3 rounded bg-white/5 hover:bg-[#306EE8] hover:text-white text-white/80 text-sm transition-colors border border-white/5 hover:border-[#306EE8]">
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : <p className="text-white/30 text-center text-sm">Aucun créneau disponible.</p>
                        ) : (
                            <form onSubmit={handleBooking} className="space-y-4">
                                <div className="text-[#306EE8] text-sm flex justify-between">
                                    <span>{selectedSlot} sélectionné</span>
                                    <button onClick={() => setSelectedSlot(null)} className="underline opacity-80 hover:opacity-100">Modifier</button>
                                </div>
                                <input placeholder="Nom" required className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#306EE8] outline-none text-sm" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                <input placeholder="Email" required className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#306EE8] outline-none text-sm" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                <input placeholder="Téléphone" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#306EE8] outline-none text-sm" onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                <textarea placeholder="Message" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#306EE8] outline-none text-sm" onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                                <button disabled={isSubmitting} className="w-full py-3 bg-[#306EE8] text-white rounded-lg font-medium shadow-[0_0_20px_rgba(48,110,232,0.3)]">
                                    {isSubmitting ? "..." : "Confirmer"}
                                </button>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
