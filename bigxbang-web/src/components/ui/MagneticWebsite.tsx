"use client";

import React, { useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import Asterisk from './Asterisk';
import { ElectricLine } from './ElectricLine';
import { AutomationEnergyRing } from './AutomationEnergyRing';
import { cn } from '@/lib/utils';
import * as THREE from 'three';

// --- NODE COMPONENT ---
const WebsiteNode = ({
    position,
    type = 'CORNER',
    isUnlocked = false,
    isGhost = false,
    onHover,
}: {
    position: [number, number, number],
    type?: 'CENTER' | 'CORNER',
    isUnlocked?: boolean,
    isGhost?: boolean,
    onHover?: () => void,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const isCenter = type === 'CENTER';

    // HTML Size
    const containerClass = isCenter ? "size-20" : "size-14";
    const iconClass = isCenter ? "w-10 h-10" : "w-6 h-6";

    // 3D Scale - AutomationEnergyRing is ~80px base
    // Center -> 0.9 scale (Tuck in)
    // Corner -> 0.65 scale (Tuck in)
    const scaleOverride = isCenter ? 0.9 : 0.65;

    // Reform deformation: Small nodes deform too much with standard math.
    // We dampen the wobble for corners.
    const wobbleScale = isCenter ? 1.0 : 0.5;

    // Visibility: Ghost nodes must be FULLY visible
    const isVisible = isCenter || isUnlocked || isGhost;
    const opacityClass = isVisible ? "opacity-100" : "opacity-0 pointer-events-none";

    // STYLE PARITY WITH AUTOMATION NETWORK (Center Icon)
    // "border-[#306EE8] bg-[#306EE8]/10 shadow-[0_0_50px_rgba(48,110,232,0.4)]"
    const automationStyle = "border-[#306EE8] bg-[#306EE8]/10 shadow-[0_0_50px_rgba(48,110,232,0.4)]";
    const automationActiveStyle = "scale-110 shadow-[0_0_60px_rgba(48,110,232,0.6)]";

    // We apply this base style to BOTH Center and Corners now as requested ("same contour")
    const borderClass = (isCenter || isUnlocked)
        ? `border-2 backdrop-blur-md ${automationStyle}`
        : "border-white/10 bg-white/5"; // Locked style (dim)

    return (
        <group position={position}>
            {/* ELECTRIC RING ASSET - Color matched to DNAHelix Electric Blue (#60a5fa) */}
            <AutomationEnergyRing
                isActive={isHovered}
                revealed={isVisible}
                scaleOverride={scaleOverride}
                color="#60a5fa"
                wobbleScale={wobbleScale}
            />

            {/* HTML ICON */}
            <Html center style={{ pointerEvents: 'none' }}>
                <div
                    onMouseEnter={() => { setIsHovered(true); if (onHover) onHover(); }}
                    onMouseLeave={() => setIsHovered(false)}
                    className={cn(
                        `relative flex items-center justify-center rounded-full pointer-events-auto cursor-pointer
                        transition-all duration-500`,
                        containerClass,
                        opacityClass,
                        borderClass,
                        // Active Hover Override
                        isHovered && automationActiveStyle
                    )}
                >
                    <Asterisk className={cn(iconClass, "text-white transition-all duration-300")} />
                </div>
            </Html>
        </group>
    );
};

// --- SCENE ---
const MagneticScene = () => {
    const CENTER_POS = [0, 0, 0] as [number, number, number];
    const ORDERED_CORNERS = [
        [-4.5, 2.5, 0],  // TL
        [4.5, 2.5, 0],   // TR
        [4.5, -2.5, 0],  // BR
        [-4.5, -2.5, 0]  // BL
    ] as [number, number, number][];

    const [unlockedNodes, setUnlockedNodes] = useState<boolean[]>([false, false, false, false]);
    const [centerHovered, setCenterHovered] = useState(false);
    const [blastTriggers, setBlastTriggers] = useState<boolean[]>([false, false, false, false]);

    const handleCornerHover = (index: number) => {
        if (unlockedNodes[index]) return;

        // BLAST
        setBlastTriggers(prev => {
            const next = [...prev];
            next[index] = true;
            return next;
        });
        setTimeout(() => setBlastTriggers(prev => {
            const next = [...prev];
            next[index] = false;
            return next;
        }), 500);

        // UNLOCK
        setTimeout(() => {
            setUnlockedNodes(prev => {
                const n = [...prev];
                n[index] = true;
                return n;
            });
        }, 200);
    };

    return (
        <group>
            {/* 1. BLAST BEAMS (#306EE8) */}
            {ORDERED_CORNERS.map((pos, i) => (
                <ElectricLine
                    key={`blast-${i}`}
                    start={CENTER_POS}
                    end={pos}
                    mode="blast"
                    trigger={blastTriggers[i]}
                    color="#00A3FF"
                />
            ))}

            {/* 2. STABLE LINKS (#306EE8) */}
            {ORDERED_CORNERS.map((pos, i) => {
                const nextIndex = (i + 1) % 4;
                const isConnected = unlockedNodes[i] && unlockedNodes[nextIndex];
                if (!isConnected) return null;

                return (
                    <ElectricLine
                        key={`link-${i}`}
                        start={pos}
                        end={ORDERED_CORNERS[nextIndex]}
                        mode="stable"
                        color="#00A3FF"
                    />
                );
            })}

            {/* 3. NODES */}
            <WebsiteNode
                position={CENTER_POS}
                type="CENTER"
                onHover={() => setCenterHovered(true)}
                isUnlocked={true}
            />

            {ORDERED_CORNERS.map((pos, i) => (
                <WebsiteNode
                    key={i}
                    position={pos}
                    type="CORNER"
                    isUnlocked={unlockedNodes[i]}
                    isGhost={centerHovered}
                    onHover={() => handleCornerHover(i)}
                />
            ))}
        </group>
    );
};

export const MagneticWebsite = ({ isActive = true }: { isActive?: boolean }) => {
    return (
        <div className="w-full h-[400px] relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <MagneticScene />
            </Canvas>
        </div>
    );
};
