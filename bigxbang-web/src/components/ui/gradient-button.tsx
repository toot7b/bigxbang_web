"use client"

import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Rocket } from "lucide-react"
import { cn } from "@/lib/utils"
import { TextScramble } from "@/components/ui/text-scramble"

export interface GradientButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    hoverText?: string
    variant?: "default" | "ghost"
    theme?: "dark" | "light"
    /** Style to use on light sections: "black" | "anthracite" | "bluish" | "glass" | "outline" */
    lightStyle?: "black" | "anthracite" | "bluish" | "glass" | "outline"
}

/**
 * GradientButton
 * High-Contrast: White Base -> Blue Fill.
 * Text Swap: 'hoverText' scrambles in on hover.
 * centering: Uses "Phantom Spacer" technique for arrow.
 * Variants: "default" (white bg) or "ghost" (transparent with border).
 */
const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
    ({ className, children, hoverText, variant = "default", theme = "dark", lightStyle = "anthracite", ...props }, ref) => {
        const buttonRef = useRef<HTMLButtonElement>(null)
        const [isHovered, setIsHovered] = useState(false)
        const [scale, setScale] = useState(0) // Start at 0
        const [duration, setDuration] = useState(500)

        const updateMousePosition = (e: React.MouseEvent<HTMLButtonElement>) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            e.currentTarget.style.setProperty('--x', `${x}px`)
            e.currentTarget.style.setProperty('--y', `${y}px`)
        }

        const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
            updateMousePosition(e)

            // Calculate exact scale needed to cover the button from any point (diagonal)
            const rect = e.currentTarget.getBoundingClientRect()
            const diagonal = Math.sqrt(rect.width ** 2 + rect.height ** 2)

            // Diameter needs to be 2 * diagonal to be safe (covering from opposite corner)
            // Base size is 20px
            const MotionButton = motion.create('button'); // This line was added based on the instruction.
            const newScale = (diagonal * 2) / 20
            setScale(newScale)

            // Calculate duration to maintain consistent visual speed
            // Base: Scale 20 (~400px) takes 500ms.
            // Ratio: 25ms per unit of scale.
            const newDuration = Math.min(1500, Math.max(500, newScale * 25))
            setDuration(newDuration)

            setIsHovered(true)
        }

        const isGhost = variant === "ghost"

        // Helper function to get light theme styles based on lightStyle prop
        const getLightStyles = () => {
            if (isGhost) return "bg-transparent border border-black/20 text-black/70"
            switch (lightStyle) {
                case "black":
                    return "bg-black text-white"
                case "anthracite":
                    return "bg-[#1a1a1a] text-white"
                case "bluish":
                    return "bg-[#1e2230] text-white"
                case "glass":
                    return "bg-black/40 backdrop-blur-md text-white border border-white/10"
                case "outline":
                    return "bg-transparent border-2 border-black/80 text-black"
                default:
                    return "bg-[#1a1a1a] text-white"
            }
        }

        return (
            <motion.button
                ref={ref || buttonRef}
                className={cn(
                    "group relative inline-flex items-center justify-center cursor-pointer",
                    "px-5 py-2 rounded-xl text-xs font-medium",
                    isGhost
                        ? theme === "light"
                            ? "bg-transparent border border-black/20 text-black/70"
                            : "bg-transparent border border-white/10 text-white/70"
                        : theme === "light"
                            ? getLightStyles()
                            : "bg-[#1C1C1C] text-white/90 border border-white/5",
                    "overflow-hidden transition-all duration-300",
                    isGhost
                        ? "shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(48,110,232,0.5)]"
                        : theme === "light" && lightStyle === "glass"
                            ? "shadow-[0_0_30px_rgba(0,0,0,0.1)]"
                            : "shadow-none hover:shadow-[0_0_30px_rgba(48,110,232,0.5)]",
                    className
                )}
                onMouseMove={updateMousePosition}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                {...props as any}
            >
                {/* Magnetic Blue Fill Layer - Controlled by CSS Variables for instant response */}
                <span
                    className="absolute bg-[#306EE8] rounded-xl transition-transform ease-out z-0 pointer-events-none"
                    style={{
                        left: 'var(--x)',
                        top: 'var(--y)',
                        width: '20px',
                        height: '20px',
                        transformOrigin: 'center center',
                        translate: '-50% -50%',
                        transform: isHovered ? `scale(${scale})` : 'scale(0)',
                        transitionDuration: `${duration}ms`,
                    }}
                />

                {/* Content Layer - Uses "Phantom Spacer" logic */}
                <span className={cn(
                    "relative z-10 font-jakarta tracking-wide flex items-center gap-2 transition-all duration-300",
                    !isGhost && "translate-x-[12px] group-hover:translate-x-0"
                )}>
                    {/* Text Container - Relative to hold the absolute text */}
                    <span className="relative flex items-center justify-center">
                        {/* 1. LAYOUT DRIVER (Phantom Spacer) - Invisible but takes up physical space
                            Uses Grid to stack both texts (Children + HoverText) in the same cell.
                            This forces the container to be [Max(Width), Max(Height)].
                        */}
                        <div className="invisible grid font-medium" aria-hidden="true">
                            <span className="col-start-1 row-start-1 whitespace-nowrap opacity-0 px-1">{children}</span>
                            {hoverText && <span className="col-start-1 row-start-1 whitespace-nowrap opacity-0 px-1">{hoverText}</span>}
                        </div>

                        {/* 2. VISIBLE LAYER (Absolute) - Visuals only, zero layout impact
                            Centered over the Phantom Spacer using absolute positioning.
                            Prevents "scramble jitter" (wide chars like 'W') from resizing the button.
                        */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <TextScramble
                                className={cn(
                                    "font-medium transition-colors duration-200 whitespace-nowrap",
                                    isHovered ? "text-white delay-100" : isGhost
                                        ? (theme === "light" ? "text-black/70" : "text-white/70")
                                        : (theme === "light" && lightStyle === "outline" ? "text-black" : "text-white/90")
                                )}
                                as="span"
                                trigger={true}
                                duration={0.3}
                            >
                                {(isHovered && hoverText) ? hoverText : children as string}
                            </TextScramble>
                        </div>
                    </span>

                    {/* Rocket - Hidden for Ghost variant */}
                    {!isGhost && (
                        <Rocket
                            className="w-4 h-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-white"
                        />
                    )}
                </span>
            </motion.button>
        )
    }
)
GradientButton.displayName = "GradientButton"

export { GradientButton }
