"use client";

import { useEffect, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * ScrollHandler - Handles scroll-to-section on page load
 * 1. Checks sessionStorage for exact saved position (case study return)
 * 2. Checks ?scroll=section-id for anchor links
 */
export default function ScrollHandler() {
    const searchParams = useSearchParams();

    // Use LayoutEffect to restore scroll BEFORE paint if possible to avoid flash
    useLayoutEffect(() => {
        // 1. Check for saved exact position (Return from Case Study)
        const savedPos = sessionStorage.getItem("caseStudyReturnPosition");
        if (savedPos) {
            const y = parseInt(savedPos, 10);
            window.scrollTo(0, y);
            sessionStorage.removeItem("caseStudyReturnPosition");
            return; // Priority over anchor scroll
        }

        // 2. Check for anchor scroll (fallback)
        const scrollTarget = searchParams.get("scroll");

        if (scrollTarget) {
            // Small delay to ensure content is fully rendered
            const timer = setTimeout(() => {
                const element = document.getElementById(scrollTarget);
                if (element) {
                    const offset = 100;
                    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top: y, behavior: "auto" }); // "auto" for instant jump, "smooth" for animation

                    // Clean up URL without reload
                    window.history.replaceState({}, "", "/");
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    return null;
}
