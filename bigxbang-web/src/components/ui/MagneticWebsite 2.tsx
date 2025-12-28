import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import Asterisk from './Asterisk';
import { AutomationEnergyRing } from './AutomationEnergyRing';

// --- CONFIGURATION ---
const BLUE_ELECTRIC = "#306EE8";

// --- SUB-COMPONENT: REUSABLE NODE ---
const WebsiteNode = ({
    position,
    size = "small",
    parentActive = false
}: {
    position: [number, number, number],
    size?: "large" | "small",
    parentActive?: boolean
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const isActive = isHovered || parentActive;

    // Size Configurations
    const isLarge = size === "large";
    const containerClass = isLarge ? "size-20" : "size-12";
    const iconClass = isLarge ? "w-10 h-10" : "w-6 h-6";
    // Scale Override: 1.0 for Large (Center), 0.6 for Small (Corners) to match visual ratio
    const ringScale = isLarge ? 1.0 : 0.6;

    // Styles
    const baseBorder = "border-[#306EE8] bg-[#306EE8]/10";
    const activeStyle = isActive
        ? `scale-110 shadow-[0_0_${isLarge ? '80px' : '40px'}_rgba(48,110,232,0.8)] bg-[#306EE8]/20`
        : `hover:scale-105 shadow-[0_0_${isLarge ? '50px' : '25px'}_rgba(48,110,232,0.4)]`;

    return (
        <group position={position}>
            {/* 1. Energy Ring (WebGL) */}
            <AutomationEnergyRing isActive={isActive} revealed={true} scaleOverride={ringScale} />

            {/* 2. HTML Node */}
            <Html center style={{ pointerEvents: 'none' }}>
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`
                        relative ${containerClass} flex items-center justify-center rounded-full pointer-events-auto cursor-pointer
                        border-2 ${baseBorder} backdrop-blur-md
                        transition-all duration-300
                        ${activeStyle}
                    `}
                >
                    <Asterisk className={`${iconClass} text-white`} />
                </div>
            </Html>
        </group>
    );
};

export const MagneticWebsite = ({ isActive = true }: { isActive?: boolean }) => {
    // Corner Positions (forming a rectangle)
    // Canvas View height at Z=0 (cam Z=10) is ~8.28 units.
    // +/- 2.5 is safe for height.
    // Width is variable. +/- 4.0 is usually safe for desktop.
    const CORNERS = [
        [-4.5, 2.5, 0], // Top Left
        [4.5, 2.5, 0],  // Top Right
        [-4.5, -2.5, 0], // Bottom Left
        [4.5, -2.5, 0]   // Bottom Right
    ] as [number, number, number][];

    return (
        <div className="w-full h-[400px] relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <Environment preset="city" />

                <group>
                    {/* CENTER NODE (Large, responds to local hover only) */}
                    <WebsiteNode position={[0, 0, 0]} size="large" />

                    {/* CORNER NODES (Small, local hover only) */}
                    {CORNERS.map((pos, i) => (
                        <WebsiteNode key={i} position={pos} size="small" />
                    ))}
                </group>
            </Canvas>
        </div>
    );
};
