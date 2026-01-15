"use client";

import { ReactLenis } from "lenis/react";
import { useIsDesktop } from "@/lib/useIsDesktop";

export default function SmoothScroll({
    children,
}: {
    children: React.ReactNode;
}) {
    // Only enable smooth scroll on desktop (wider than 1024px)
    // This prevents the "fighting" behavior on mobile touch screens
    const isDesktop = useIsDesktop();

    if (!isDesktop) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
            {children}
        </ReactLenis>
    );
}
