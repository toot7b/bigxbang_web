"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import Asterisk from './Asterisk';
import { ElectricLine } from './ElectricLine';
import { AutomationEnergyRing } from './AutomationEnergyRing';
import { cn } from '@/lib/utils';
import * as THREE from 'three';

// --- SHOCKWAVE COMPONENT (from DNAHelix / ElectricCables) ---
const SHOCKWAVE_FRAGMENT = `
    uniform float uTime;
    uniform float uLife; // 0 (start) -> 1 (end)
    uniform vec3 uColor;
    varying vec2 vUv;

    // Simple noise
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0;
        return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                   mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
    }

    void main() {
        vec2 center = vec2(0.5);
        float dist = distance(vUv, center);
        float angle = atan(vUv.y - 0.5, vUv.x - 0.5);

        float radius = uLife * 0.5; 
        float ringWidth = 0.05 * (1.0 - uLife); 
        float ring = 1.0 - smoothstep(0.0, ringWidth, abs(dist - radius));
        
        float distort = noise(vec2(angle * 4.0, uTime * 3.0)) * 0.1 * (1.0 - uLife);
        ring *= 1.0 + distort;
        
        ring *= smoothstep(0.05, 0.08, dist);
        
        float opacity = (1.0 - uLife); 
        opacity = pow(opacity, 1.5); 
        
        vec3 color = vec3(1.0); 
        color = mix(color, uColor, 0.5);

        gl_FragColor = vec4(color, ring * opacity * 2.0); 
    }
`;

const NODE_VERTEX = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const ImpactShockwave = ({ position, onComplete }: { position: [number, number, number], onComplete: () => void }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const { camera } = useThree();
    const waveLife = useRef(0.0);

    useFrame((state, delta) => {
        if (!materialRef.current) return;

        // BILLBOARD
        if (meshRef.current) {
            meshRef.current.quaternion.copy(camera.quaternion);
        }

        const time = state.clock.elapsedTime;
        materialRef.current.uniforms.uTime.value = time;

        // ANIMATION SPEED (Fast impact)
        waveLife.current += delta * 3.0;

        if (waveLife.current >= 1.0) {
            onComplete();
        }

        materialRef.current.uniforms.uLife.value = waveLife.current;
    });

    return (
        <mesh ref={meshRef} position={position}>
            <planeGeometry args={[4.0, 4.0]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={NODE_VERTEX}
                fragmentShader={SHOCKWAVE_FRAGMENT}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={{
                    uTime: { value: 0 },
                    uLife: { value: 0.0 },
                    uColor: { value: new THREE.Color("#00A3FF") } // Cyan Impact
                }}
            />
        </mesh>
    );
};


// --- 3D UI COMPONENTS (Hero Assembly) ---
const HeroNavbar = () => (
    <div className="w-[300px] h-8 bg-black/60 border border-white/10 rounded-full flex items-center justify-between px-4 backdrop-blur-md">
        <div className="flex gap-2">
            <div className="w-2 h-2 bg-[#306EE8] rounded-full"></div>
            <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
        </div>
        <div className="flex gap-4">
            <div className="w-8 h-1.5 bg-white/10 rounded-full"></div>
            <div className="w-8 h-1.5 bg-white/10 rounded-full"></div>
            <div className="w-16 h-5 bg-[#306EE8]/20 border border-[#306EE8]/50 rounded-full flex items-center justify-center">
                <div className="w-8 h-1 bg-[#306EE8] rounded-full"></div>
            </div>
        </div>
    </div>
);

const HeroText = () => (
    <div className="flex flex-col gap-2 origin-center scale-60">
        <div className="flex flex-col gap-1">
            <div className="w-40 h-5 bg-white/90 rounded-sm"></div>
            <div className="w-24 h-5 bg-white/50 rounded-sm"></div>
        </div>
        <div className="w-32 h-2 bg-white/20 rounded-sm"></div>
        <div className="flex gap-2 mt-1">
            <div className="w-20 h-6 bg-[#306EE8] rounded-md"></div>
            <div className="w-20 h-6 border border-white/20 rounded-md"></div>
        </div>
    </div>
);

const HeroCard = () => (
    <div className="w-40 h-28 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-xl backdrop-blur-md p-2 flex flex-col gap-2 origin-center scale-60">
        <div className="w-full h-16 bg-white/5 rounded-lg border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#306EE8]/20 to-transparent"></div>
        </div>
        <div className="w-full h-1.5 bg-white/20 rounded-full"></div>
        <div className="w-2/3 h-1.5 bg-white/10 rounded-full"></div>
    </div>
);

const HeroFooter = () => (
    <div className="flex items-center justify-center gap-6 opacity-30">
        <div className="w-16 h-3 bg-white/20 rounded-md"></div>
        <div className="w-16 h-3 bg-white/20 rounded-md"></div>
        <div className="w-16 h-3 bg-white/20 rounded-md"></div>
    </div>
);

const HeroAssembly3D = () => {
    // 3D Positions for the assembled state
    // Top/Bottom at +/- 1.8 units 
    // Left/Right at +/- 2.2 units
    return (
        <group>
            <Html position={[0, 1.8, 0]} center>
                <HeroNavbar />
            </Html>
            <Html position={[-2.2, 0, 0]} center>
                <HeroText />
            </Html>
            <Html position={[2.2, 0, 0]} center>
                <HeroCard />
            </Html>
            <Html position={[0, -1.8, 0]} center>
                <HeroFooter />
            </Html>
        </group>
    );
};


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
        [-4.5, 2.5, 0],  // TL (Restored Original)
        [4.5, 2.5, 0],   // TR
        [4.5, -2.5, 0],  // BR
        [-4.5, -2.5, 0]  // BL
    ] as [number, number, number][];

    const [unlockedNodes, setUnlockedNodes] = useState<boolean[]>([false, false, false, false]);
    const [centerHovered, setCenterHovered] = useState(false);
    const [blastTriggers, setBlastTriggers] = useState<boolean[]>([false, false, false, false]);

    // HELPERS FOR BEAM CONNECTION POINTS
    const { viewport, size } = useThree();
    // Replicate AutomationEnergyRing logic: 80px base size * scale
    // Radius is roughly half of that. Visual ring radius is 0.46 * Size.
    // Logic: toUnits(80) * scale * 0.46
    const hasDimensions = size.width > 0;
    const toUnits = (pixels: number) => hasDimensions ? (pixels / size.width) * viewport.width : 0;

    // Radii in World Units
    // Center: Scale 0.9 -> 80 * 0.9 = 72px base -> Ring Radius ~33px visually
    const centerRadius = toUnits(80 * 0.9 * 0.46);
    // Corner: Scale 0.65 -> 80 * 0.65 = 52px base -> Ring Radius ~24px visually
    const cornerRadius = toUnits(80 * 0.65 * 0.46);

    const getPerimeterPoint = (from: [number, number, number], to: [number, number, number], radius: number) => {
        const vFrom = new THREE.Vector3(...from);
        const vTo = new THREE.Vector3(...to);
        const dir = vTo.clone().sub(vFrom).normalize();
        return vFrom.add(dir.multiplyScalar(radius)).toArray() as [number, number, number];
    };


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
            {/* 1. BLAST BEAMS (#306EE8) */}
            {ORDERED_CORNERS.map((pos, i) => {
                // Blast: From Center Edge -> Corner Edge
                // Actually blast usually comes from "inside" or edge?
                // Let's go Edge to Edge for clean look.
                const start = getPerimeterPoint(CENTER_POS, pos, centerRadius);
                const end = getPerimeterPoint(pos, CENTER_POS, cornerRadius);

                return (
                    <ElectricLine
                        key={`blast-${i}`}
                        start={start}
                        end={end}
                        mode="blast"
                        trigger={blastTriggers[i]}
                        color="#00A3FF"
                    />
                );
            })}

            {/* 1.5 SHOCKWAVES (Triggers when blast hits) */}
            {blastTriggers.map((isActive, i) => (
                isActive && (
                    <ImpactShockwave
                        key={`shock-${i}`}
                        position={ORDERED_CORNERS[i]} // Impact on the CORNER
                        onComplete={() => {
                            // No-op, managed by parent state timeout
                        }}
                    />
                )
            ))}

            {/* 2. STABLE LINKS (#306EE8) */}
            {ORDERED_CORNERS.map((pos, i) => {
                const nextIndex = (i + 1) % 4;
                const isConnected = unlockedNodes[i] && unlockedNodes[nextIndex];
                if (!isConnected) return null;

                // Link: Corner Edge -> Corner Edge
                const start = getPerimeterPoint(pos, ORDERED_CORNERS[nextIndex], cornerRadius);
                const end = getPerimeterPoint(ORDERED_CORNERS[nextIndex], pos, cornerRadius);

                return (
                    <ElectricLine
                        key={`link-${i}`}
                        start={start}
                        end={end}
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

            {/* 3. HERO ASSEMBLY (3D UI) - For Preview/Final State */}
            <HeroAssembly3D />

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
