"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/ui/Loader";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const isJohnny = pathname === "/johnny-le-chat";

    useEffect(() => {
        // Check if user has already seen the loader in this session OR if on Johnny page
        const hasSeenLoader = sessionStorage.getItem("hasSeenLoader");
        if (hasSeenLoader || isJohnny) {
            setLoading(false);
        }
    }, [isJohnny]);

    const handleComplete = () => {
        sessionStorage.setItem("hasSeenLoader", "true");
        setLoading(false);
    };

    return (
        <>
            {loading && !isJohnny && <Loader onComplete={handleComplete} />}
            {children}
        </>
    );
}
