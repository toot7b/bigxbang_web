"use client";

import { useState, useEffect } from "react";

export type Theme = "dark" | "light";

export function useSectionTheme(): Theme {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Find the entry with the largest intersection ratio
                let maxRatio = 0;
                let mostVisibleEntry: IntersectionObserverEntry | null = null;

                entries.forEach((entry) => {
                    if (entry.intersectionRatio > maxRatio) {
                        maxRatio = entry.intersectionRatio;
                        mostVisibleEntry = entry;
                    }
                });

                if (mostVisibleEntry) {
                    const sectionTheme = (mostVisibleEntry as any).target.getAttribute("data-theme") as Theme;
                    if (sectionTheme) {
                        setTheme(sectionTheme);
                    }
                }
            },
            {
                threshold: [0, 0.1, 0.5], // Simplified thresholds
                rootMargin: "-2% 0px -98% 0px", // Detect strictly at the very top (where navbar is)
            }
        );

        const sections = document.querySelectorAll("[data-theme]");
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return theme;
}
