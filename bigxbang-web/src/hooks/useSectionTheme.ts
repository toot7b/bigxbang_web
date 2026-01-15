"use client";

import { useState, useEffect, useRef } from "react";

export type Theme = "dark" | "light";

export function useSectionTheme(): Theme {
    const [theme, setTheme] = useState<Theme>("dark");
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const updateTheme = () => {
            const sections = document.querySelectorAll("[data-theme]");
            let foundLight = false;

            // Navbar typically occupies the top 80-100px
            const NAVBAR_HEIGHT = 100;

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                // If any part of the section is within the navbar's vertical zone
                if (rect.top < NAVBAR_HEIGHT && rect.bottom > 0) {
                    if (section.getAttribute("data-theme") === "light") {
                        foundLight = true;
                    }
                }
            });

            setTheme(foundLight ? "light" : "dark");
        };

        const observer = new IntersectionObserver(updateTheme, {
            threshold: [0, 0.1, 0.5, 0.9, 1],
            rootMargin: "0px 0px -90% 0px",
        });

        const observeSections = () => {
            const sections = document.querySelectorAll("[data-theme]");
            sections.forEach((section) => observer.observe(section));
        };

        observeSections();

        const mutationObserver = new MutationObserver(() => {
            observeSections();
            updateTheme(); // Re-check on DOM changes
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also check on scroll for extra safety if needed, 
        // though IntersectionObserver should handle it.
        window.addEventListener("scroll", updateTheme, { passive: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener("scroll", updateTheme);
        };
    }, []);

    return theme;
}
