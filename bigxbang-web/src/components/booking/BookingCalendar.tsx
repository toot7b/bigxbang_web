"use client";

import { useState, useEffect } from "react";
import { format, parse, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import successAnimation from "./success.json";
import { GradientButton } from "@/components/ui/gradient-button";

interface Service { id: string; name: string; duration: string; }

export function BookingCalendar({ className }: { className?: string }) {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Selection State
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [view, setView] = useState<"calendar" | "slots" | "form">("calendar");

    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Form - Split Name fields + Company
    const [formData, setFormData] = useState({ firstName: "", lastName: "", company: "", email: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [bookingData, setBookingData] = useState<any>(null);

    // Helper to convert 12h "02:00 PM" -> 24h "14:00"
    const formatTime = (timeStr: string) => {
        try {
            const parsed = parse(timeStr, "hh:mm a", new Date());
            return format(parsed, "HH:mm");
        } catch (e) {
            return timeStr;
        }
    };

    useEffect(() => {
        fetch("/api/booking/services").then(res => res.json()).then(data => {
            if (Array.isArray(data)) { setServices(data); if (data.length) setSelectedService(data[0]); }
        });
    }, []);

    useEffect(() => {
        if (!selectedService || !selectedDate) return;
        setIsLoadingSlots(true);
        setSlots([]);
        setView("slots");

        const dateStr = format(selectedDate, "dd-MMM-yyyy", { locale: enUS });

        fetch(`/api/booking/availability?service_id=${selectedService.id}&date=${dateStr}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const filteredSlots = data.filter((_, i) => i % 2 === 0);
                    setSlots(filteredSlots);
                } else {
                    setSlots([]);
                }
            })
            .finally(() => setIsLoadingSlots(false));
    }, [selectedDate, selectedService]);

    // Always generate 42 days (6 weeks) for consistent grid height
    const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const days = eachDayOfInterval({
        start: startDate,
        end: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 41),
    });

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        const notes = formData.company ? `Entreprise: ${formData.company}` : "";

        try {
            const res = await fetch("/api/booking/book", {
                method: "POST",
                body: JSON.stringify({
                    service_id: selectedService?.id,
                    date: format(selectedDate!, "dd-MMM-yyyy", { locale: enUS }),
                    time: selectedSlot,
                    customer_name: fullName,
                    customer_email: formData.email,
                    customer_phone: "0600000000",
                    notes: notes
                })
            });

            const data = await res.json();

            if (data.success) {
                setBookingData(data.data.returnvalue);
            }
        } catch (e) { console.error(e); } finally { setIsSubmitting(false); }
    };

    if (bookingData) {
        // ... success view (keep as is but check height)
        const joinLink = bookingData.meeting_info?.join_link || bookingData.zoho_meeting_info?.join_link;

        return (
            <div className={cn("bg-[#0a0a0a]/60 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-auto lg:h-[644px]", className)}>
                <div className="w-24 h-24 mb-6">
                    <Lottie animationData={successAnimation} loop={false} />
                </div>

                <h3 className="font-clash text-2xl text-white mb-2">C&apos;est dans la boîte !</h3>
                <p className="font-jakarta text-white/60 text-sm mb-6 max-w-[80%]">
                    Rendez-vous confirmé. On a hâte d&apos;échanger avec vous.<br />
                    Un email récapitulatif est en route.
                </p>

                {joinLink && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full mb-6">
                        <p className="text-xs text-white/40 uppercase tracking-widest font-jakarta mb-2">Lien de la visio</p>
                        <a href={joinLink} target="_blank" rel="noopener noreferrer" className="text-[#306EE8] font-jakarta text-sm underline truncate block hover:text-[#306EE8]/80 transition-colors">
                            {joinLink}
                        </a>
                    </div>
                )}

                <button onClick={() => { setBookingData(null); setView("calendar"); setSelectedDate(null); setSelectedSlot(null); }} className="text-white/40 font-jakarta text-xs hover:text-white transition-colors">
                    Planifier un autre rendez-vous
                </button>
            </div>
        );
    }

    return (
        <div className={cn("bg-[#0a0a0a]/60 border border-white/10 rounded-2xl shadow-xl relative overflow-hidden group h-auto lg:h-[644px] flex flex-col", className)}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#306EE8]/5 blur-[60px] rounded-full -z-10 group-hover:bg-[#306EE8]/10 transition-colors" />

            {/* Content Container */}
            <div className="p-2 md:p-6 relative flex-1 flex flex-col">
                <AnimatePresence mode="popLayout" initial={false}>
                    {view === "calendar" && (
                        <motion.div
                            key="calendar"
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="flex-1 flex flex-col"
                        >
                            <h3 className="font-clash text-2xl md:text-3xl font-medium text-white mb-4 md:mb-6 px-2">Planifier un échange</h3>

                            <div className="flex items-center justify-between mb-4 md:mb-6 px-1 h-10">
                                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors z-10"><ChevronLeft className="w-5 h-5" /></button>
                                <div className="relative flex-1 flex justify-center overflow-hidden h-full items-center">
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        <motion.span
                                            key={currentMonth.toISOString()}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="font-jakarta text-xl md:text-2xl text-white capitalize font-medium tracking-wide absolute"
                                        >
                                            {format(currentMonth, "MMMM yyyy", { locale: fr })}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors z-10"><ChevronRight className="w-5 h-5" /></button>
                            </div>

                            <div className="grid grid-cols-7 mb-2 text-center">
                                {["l", "m", "m", "j", "v", "s", "d"].map((d, idx) => (
                                    <div key={idx} className="text-[10px] md:text-xs text-white/40 font-jakarta uppercase tracking-wider font-medium">{d}</div>
                                ))}
                            </div>

                            <div className="relative flex-1">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.div
                                        key={currentMonth.toISOString() + "-grid"}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="grid grid-cols-7 gap-1 md:gap-3 mb-4 content-start w-full"
                                    >
                                        {days.map(day => {
                                            const isCurrent = isSameMonth(day, currentMonth);
                                            const isPast = isBefore(day, startOfToday());
                                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                                            const isTodayDate = isToday(day);

                                            return (
                                                <button
                                                    key={day.toString()}
                                                    onClick={() => !isPast && isCurrent && setSelectedDate(day)}
                                                    disabled={isPast || !isCurrent}
                                                    className={cn(
                                                        "aspect-square w-full h-full rounded-xl flex items-center justify-center text-base font-jakarta transition-colors transition-transform duration-300 relative group/day",
                                                        !isCurrent && "text-white/20 cursor-default",
                                                        isPast && isCurrent && "text-white/20 line-through decoration-white/20 cursor-not-allowed",
                                                        !isPast && isCurrent && !isSelected && "text-white hover:bg-white/10 hover:text-white hover:scale-105",
                                                        isSelected && "bg-[#306EE8] text-white shadow-[0_0_20px_rgba(48,110,232,0.4)] scale-105 font-bold z-10"
                                                    )}
                                                >
                                                    {format(day, "d")}
                                                    {isTodayDate && !isSelected && (
                                                        <span className="absolute bottom-1.5 w-1 h-1 bg-[#306EE8] rounded-full" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                    {view === "slots" && (
                        <motion.div
                            key="slots"
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="h-full flex flex-col"
                        >
                            <div className="flex items-center gap-4 mb-6 px-2">
                                <button onClick={() => setView("calendar")} className="p-2 -ml-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h3 className="font-jakarta text-lg md:text-xl font-medium text-white capitalize">
                                    {selectedDate && format(selectedDate, "EEEE d MMMM", { locale: fr })}
                                </h3>
                            </div>

                            {!selectedSlot ? (
                                isLoadingSlots ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-[#306EE8] w-8 h-8" />
                                    </div>
                                ) : slots.length ? (
                                    <div className="grid grid-cols-3 gap-2 md:gap-3 align-start content-start">
                                        {slots.map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => { setSelectedSlot(slot); setView("form"); }}
                                                className="py-3 px-2 md:px-3 rounded-lg bg-white/5 hover:bg-[#306EE8] hover:text-white text-white/80 text-sm font-jakarta font-medium transition-colors border border-white/5 hover:border-[#306EE8] hover:shadow-[0_0_15px_rgba(48,110,232,0.2)]"
                                            >
                                                {formatTime(slot)}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-center gap-4">
                                        <p className="font-jakarta text-sm">Oups, ce jour est complet !</p>
                                        <p className="font-jakarta text-xs text-white/40">Essayez un autre créneau ou contactez-nous directement.</p>
                                        <button onClick={() => setView("calendar")} className="text-[#306EE8] underline text-sm font-jakarta hover:text-[#306EE8]/80">Choisir une autre date</button>
                                    </div>
                                )
                            ) : null}
                        </motion.div>
                    )}

                    {view === "form" && (
                        <motion.div
                            key="form"
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="h-full flex flex-col"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <button onClick={() => { setView("slots"); setSelectedSlot(null); }} className="p-2 -ml-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h3 className="font-jakarta text-xl font-medium text-white">Finaliser</h3>
                                    <p className="text-xs text-[#306EE8] font-jakarta mt-0.5 font-medium">{selectedSlot && formatTime(selectedSlot)} - {selectedDate && format(selectedDate, "d MMMM", { locale: fr })}</p>
                                </div>
                            </div>

                            <form onSubmit={handleBooking} className="flex-1 flex flex-col gap-4">
                                <input placeholder="Prénom" required className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/30 focus:border-[#306EE8] focus:bg-[#306EE8]/5 outline-none text-sm font-jakarta transition-all" onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                <input placeholder="Nom" required className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/30 focus:border-[#306EE8] focus:bg-[#306EE8]/5 outline-none text-sm font-jakarta transition-all" onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                <input placeholder="Entreprise (Optionnel)" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/30 focus:border-[#306EE8] focus:bg-[#306EE8]/5 outline-none text-sm font-jakarta transition-all" onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                <input type="email" placeholder="Email" required className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/30 focus:border-[#306EE8] focus:bg-[#306EE8]/5 outline-none text-sm font-jakarta transition-all" onChange={e => setFormData({ ...formData, email: e.target.value })} />

                                <div className="flex-1 min-h-[20px]" />

                                <div className="mt-auto">
                                    <GradientButton
                                        type="submit"
                                        disabled={isSubmitting}
                                        hoverText="Je réserve"
                                        className="w-full h-12 text-sm"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirmer"}
                                    </GradientButton>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
