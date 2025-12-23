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
    <div className="w-[380px] h-8 bg-black/60 border border-white/10 rounded-full flex items-center justify-between px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#306EE8] rounded-full"></div>
            <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
        </div>
        <div className="flex items-center gap-4">
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
    // Left/Right at +/- 2.6 units (increased spacing for wider navbar)
    return (
        <group>
            <Html position={[0, 1.8, 0]} center>
                <HeroNavbar />
            </Html>
            <Html position={[-2.6, 0, 0]} center>
                <HeroText />
            </Html>
            <Html position={[2.6, 0, 0]} center>
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
    revealed = false,
    isFirst = false,
    isActiveTarget = false,
    onHover,
}: {
    position: [number, number, number],
    type?: 'CENTER' | 'CORNER',
    isUnlocked?: boolean,
    revealed?: boolean,
    isFirst?: boolean,
    isActiveTarget?: boolean,
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

    // Visibility logic
    const isVisible = type === 'CENTER' || revealed;
    const opacityClass = isVisible ? "opacity-100" : "opacity-0 pointer-events-none";

    // Scale Logic:
    // If not revealed: Scale 0. 
    // If revealed: Scale 1. (Animated)
    // We handle scale in CSS for the DIV, and scaleOverride used for the RING component.

    // NOTE: WebsiteNode receives position but AutomationEnergyRing handles internal logic.
    // We need to ensure the RING is also hidden if not revealed.


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
                        isHovered && automationActiveStyle,
                        // GUIDE PULSE (Exact DNAHelix Style)
                        isActiveTarget && !isHovered && "animate-guide-glow-v2 border-[#306EE8] shadow-[0_0_30px_rgba(48,110,232,0.8)]"
                    )}
                >
                    <Asterisk className={cn(iconClass, "text-white transition-all duration-300")} />
                </div>
            </Html>
        </group>
    );
};

// --- SCENE ---
const MagneticScene = ({ guideStep, setGuideStep }: {
    guideStep: number,
    setGuideStep: React.Dispatch<React.SetStateAction<number>>
}) => {
    const CENTER_POS = [0, 0, 0] as [number, number, number];
    const CORNER_DEFS = [
        { id: 0, position: [-4.5, 2.5, 0] as [number, number, number] },  // TL
        { id: 1, position: [4.5, 2.5, 0] as [number, number, number] },   // TR
        { id: 2, position: [4.5, -2.5, 0] as [number, number, number] },  // BR
        { id: 3, position: [-4.5, -2.5, 0] as [number, number, number] }   // BL
    ];

    const [blastTriggers, setBlastTriggers] = useState<boolean[]>([false, false, false, false]);

    // HELPERS FOR BEAM CONNECTION POINTS
    const { viewport, size } = useThree();
    const hasDimensions = size.width > 0;
    const toUnits = (pixels: number) => hasDimensions ? (pixels / size.width) * viewport.width : 0;
    const centerRadius = toUnits(80 * 0.9 * 0.46);
    const cornerRadius = toUnits(80 * 0.65 * 0.46);

    const getPerimeterPoint = (from: [number, number, number], to: [number, number, number], radius: number) => {
        const vFrom = new THREE.Vector3(...from);
        const vTo = new THREE.Vector3(...to);
        const dir = vTo.clone().sub(vFrom).normalize();
        return vFrom.add(dir.multiplyScalar(radius)).toArray() as [number, number, number];
    };

    const handleCenterHover = () => {
        if (guideStep === -1) {
            // JUMP START: Reveal Node 0 AND Node 1 immediately.
            // Triggers blast on Node 0 to visualize the "Strike".
            setBlastTriggers(b => {
                const nb = [...b];
                nb[0] = true;
                return nb;
            });
            setTimeout(() => setBlastTriggers(b => {
                const nb = [...b];
                nb[0] = false;
                return nb;
            }), 500);

            // Skip to Step 1 (Node 1 is now the Target)
            setGuideStep(1);
        }
    };

    const handleCornerHover = (index: number) => {
        // Logic: Hovering the pulsing target blasts IT and reveals the next.
        if (index === guideStep) {
            // Blast the CURRENT target
            setBlastTriggers(prev => {
                const next = [...prev];
                next[index] = true;
                return next;
            });

            // Reset Blast
            setTimeout(() => setBlastTriggers(prev => {
                const next = [...prev];
                next[index] = false;
                return next;
            }), 500);

            // Unlock next step
            setGuideStep(prev => prev + 1);
        }
    };

    return (
        <group>
            {/* 1. BLAST BEAMS (#306EE8) */}
            {CORNER_DEFS.map((corner) => {
                // Blast logic: When corner X triggers, blast goes to IT from Center?
                // Yes, blast from center to the new node.
                const start = getPerimeterPoint(CENTER_POS, corner.position, centerRadius);
                const end = getPerimeterPoint(corner.position, CENTER_POS, cornerRadius);

                return (
                    <ElectricLine
                        key={`blast-${corner.id}`}
                        start={start}
                        end={end}
                        mode="blast"
                        trigger={blastTriggers[corner.id]}
                        color="#00A3FF"
                    />
                );
            })}

            {/* 1.5 SHOCKWAVES (Triggers when blast hits) */}
            {blastTriggers.map((isActive, i) => (
                isActive && (
                    <ImpactShockwave
                        key={`shock-${i}`}
                        position={CORNER_DEFS[i].position}
                        onComplete={() => { }}
                    />
                )
            ))}

            {/* 2. STABLE LINKS (#306EE8) */}
            {CORNER_DEFS.map((corner) => {
                const nextIndex = (corner.id + 1) % 4;
                const nextCorner = CORNER_DEFS[nextIndex];

                // Link exists if we have completed this step
                // Sequence: 0->1 at Step 1, 1->2 at Step 2, ..., 3->0 at Step 4.
                const isConnected = guideStep >= corner.id + 1;
                if (!isConnected) return null;

                const start = getPerimeterPoint(corner.position, nextCorner.position, cornerRadius);
                const end = getPerimeterPoint(nextCorner.position, corner.position, cornerRadius);

                return (
                    <ElectricLine
                        key={`link-${corner.id}`}
                        start={start}
                        end={end}
                        mode="stable"
                        color="#00A3FF"
                    />
                );
            })}

            {/* 3. CENTER NODE */}
            <WebsiteNode
                position={CENTER_POS}
                type="CENTER"
                // Center is always unlocked/revealed
                isUnlocked={true}
                revealed={true}
                isActiveTarget={guideStep === -1} // Blink at start
                onHover={handleCenterHover}
            />

            {/* 3. HERO ASSEMBLY (3D UI) */}
            <HeroAssembly3D />

            {/* 4. CORNER NODES */}
            {CORNER_DEFS.map((corner, i) => (
                <WebsiteNode
                    key={i}
                    position={corner.position}
                    type="CORNER"
                    isUnlocked={guideStep >= i}
                    revealed={guideStep >= i}
                    isFirst={i === 0}
                    isActiveTarget={guideStep === i}
                    onHover={() => handleCornerHover(i)}
                />
            ))}
        </group >
    );
};

export const MagneticWebsite = ({ isActive = false }: { isActive?: boolean }) => {
    // -1 = Hidden/Start. 0 = Center active, 1st node reveals. 1 = 1st Node hovered, 2nd reveals...
    const [guideStep, setGuideStep] = useState(-1);

    useEffect(() => {
        // Removed auto-start to allow Center to blink first.
    }, [isActive]);

    return (
        <div className="w-full h-[400px] relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <MagneticScene guideStep={guideStep} setGuideStep={setGuideStep} />
            </Canvas>
        </div>
    );
};
