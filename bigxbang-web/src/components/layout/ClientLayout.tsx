"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/ui/Loader";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);

    return (
        <>
            {loading && <Loader onComplete={() => setLoading(false)} />}
            {children}
        </>
    );
}
