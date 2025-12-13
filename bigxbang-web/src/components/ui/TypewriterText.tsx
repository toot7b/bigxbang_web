"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
    text: string;
    className?: string;
    cursorClassName?: string;
    speed?: number; // ms per char
    delay?: number; // start delay in ms
    start?: boolean; // trigger
}

export const TypewriterText = ({
    text,
    className,
    cursorClassName,
    speed = 30,
    delay = 0,
    start = true
}: TypewriterTextProps) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!start) {
            setDisplayedText("");
            setIsComplete(false);
            return;
        }

        let timeoutId: NodeJS.Timeout;
        let currentIndex = 0;

        const typeChar = () => {
            if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
                timeoutId = setTimeout(typeChar, speed);
            } else {
                setIsComplete(true);
            }
        };

        const startTimeout = setTimeout(() => {
            typeChar();
        }, delay);

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(startTimeout);
        };
    }, [text, speed, delay, start]);

    return (
        <span className={cn("inline-block", className)}>
            {displayedText}
            <span
                className={cn(
                    "inline-block w-[2px] h-[1em] bg-current ml-1 align-middle",
                    isComplete ? "animate-pulse" : "opacity-100",
                    cursorClassName
                )}
            />
        </span>
    );
};
