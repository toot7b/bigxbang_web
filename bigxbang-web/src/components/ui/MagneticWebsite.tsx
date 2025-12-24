"use client";

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import Asterisk from './Asterisk';
import { ElectricLine } from './ElectricLine';
import { DynamicElectricLine } from './DynamicElectricLine';
import { AutomationEnergyRing } from './AutomationEnergyRing';
import { cn } from '@/lib/utils';
import * as THREE from 'three';

// --- SHOCKWAVE COMPONENT ---
const SHOCKWAVE_FRAGMENT = `
    uniform float uTime;
    uniform float uLife; // 0 (start) -> 1 (end)
    uniform vec3 uColor;
    varying vec2 vUv;
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
        float opacity = pow(1.0 - uLife, 1.5); 
        vec3 color = mix(vec3(1.0), uColor, 0.5);
        gl_FragColor = vec4(color, ring * opacity * 2.0); 
    }
`;

const NODE_VERTEX = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const ImpactShockwave = ({ position, onComplete }: { position: [number, number, number], onComplete: () => void }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const waveLife = useRef(0.0);
    const { camera } = useThree();
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (!materialRef.current || !meshRef.current) return;
        meshRef.current.quaternion.copy(camera.quaternion);
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        waveLife.current += delta * 3.0; // Fast impact
        if (waveLife.current >= 1.0) onComplete();
        materialRef.current.uniforms.uLife.value = waveLife.current;
    });

    return (
        <mesh ref={meshRef} position={position}>
            <planeGeometry args={[4.0, 4.0]} />
            <shaderMaterial ref={materialRef} vertexShader={NODE_VERTEX} fragmentShader={SHOCKWAVE_FRAGMENT} transparent depthWrite={false} blending={THREE.AdditiveBlending} uniforms={{ uTime: { value: 0 }, uLife: { value: 0 }, uColor: { value: new THREE.Color("#00A3FF") } }} />
        </mesh>
    );
};

// --- HERO ASSEMBLY COMPONENTS ---
// --- HERO ASSEMBLY COMPONENTS ---
const HeroNavbar = () => (
    <div className="w-[360px] h-9 bg-black/60 border border-white/10 rounded-full flex items-center justify-between px-5 backdrop-blur-md">
        <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 bg-[#306EE8] rounded-full" /><div className="w-14 h-2 bg-white/20 rounded-full" /></div>
        <div className="flex items-center gap-5"><div className="w-9 h-2 bg-white/10 rounded-full" /><div className="w-9 h-2 bg-white/10 rounded-full" /><div className="w-18 h-6 bg-[#306EE8]/20 border border-[#306EE8]/50 rounded-full flex items-center justify-center"><div className="w-9 h-1 bg-[#306EE8] rounded-full" /></div></div>
    </div>
);
const HeroText = () => (
    <div className="flex flex-col gap-2.5 origin-center scale-65"><div className="flex flex-col gap-1"><div className="w-44 h-5.5 bg-white/90 rounded-sm" /><div className="w-26 h-5.5 bg-white/50 rounded-sm" /></div><div className="w-36 h-2 bg-white/20 rounded-sm" /><div className="flex gap-2.5 mt-1"><div className="w-22 h-7 bg-[#306EE8] rounded-md" /><div className="w-22 h-7 border border-white/20 rounded-md" /></div></div>
);
const HeroCard = () => (
    <div className="w-44 h-30 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-xl backdrop-blur-md p-2.5 flex flex-col gap-2.5 origin-center scale-65"><div className="w-full h-18 bg-white/5 rounded-lg border border-white/5 relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-tr from-[#306EE8]/20 to-transparent" /></div><div className="w-full h-2 bg-white/20 rounded-full" /><div className="w-2/3 h-2 bg-white/10 rounded-full" /></div>
);
const HeroFooter = () => (
    <div className="flex items-center justify-center gap-10 opacity-30"><div className="w-20 h-3 bg-white/20 rounded-md" /><div className="w-20 h-3 bg-white/20 rounded-md" /><div className="w-20 h-3 bg-white/20 rounded-md" /></div>
);
const HeroAssembly3D = () => (
    <group>
        <Html position={[0, 2.3, 0]} center><HeroNavbar /></Html>
        <Html position={[-2.8, 0, 0]} center><HeroText /></Html>
        <Html position={[2.8, 0, 0]} center><HeroCard /></Html>
        <Html position={[0, -2.3, 0]} center><HeroFooter /></Html>
    </group>
);


// --- WEBSITE NODE ---
const WebsiteNode = React.forwardRef<THREE.Group, {
    position: THREE.Vector3 | [number, number, number],
    type?: 'CENTER' | 'CORNER',
    isUnlocked?: boolean,
    revealed?: boolean,
    isActiveTarget?: boolean,
    isFinale?: boolean, // Added prop
    onHover?: () => void
}>(({
    position,
    type = 'CORNER',
    isUnlocked,
    revealed,
    isActiveTarget,
    isFinale = false,
    onHover
}, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const isCenter = type === 'CENTER';
    const containerClass = isCenter ? "size-20" : "size-14";
    const iconClass = isCenter ? "w-10 h-10" : "w-6 h-6";
    const scaleOverride = isCenter ? 0.9 : 0.65;

    // Hide during finale? Or just the ring? User said "ronds électriques restent".
    // So we hide the ring if isFinale.
    const showRing = (type === 'CENTER' || revealed) && !isFinale;
    const isVisible = type === 'CENTER' || revealed;

    const opacityClass = isVisible ? "opacity-100" : "opacity-0 pointer-events-none";
    const automationStyle = "border-[#306EE8] bg-[#306EE8]/10 shadow-[0_0_50px_rgba(48,110,232,0.4)]";
    const automationActiveStyle = "scale-110 shadow-[0_0_60px_rgba(48,110,232,0.6)]";
    const borderClass = (isCenter || isUnlocked) ? `border-2 backdrop-blur-md ${automationStyle}` : "border-white/10 bg-white/5";

    return (
        <group ref={ref} position={position}>
            <AutomationEnergyRing isActive={isHovered} revealed={showRing} scaleOverride={scaleOverride} color="#60a5fa" wobbleScale={isCenter ? 1.0 : 0.5} />
            <Html center style={{ pointerEvents: 'none' }}>
                <div
                    onMouseEnter={() => { setIsHovered(true); if (onHover) onHover(); }}
                    onMouseLeave={() => setIsHovered(false)}
                    className={cn(`relative flex items-center justify-center rounded-full pointer-events-auto cursor-pointer transition-all duration-500`, containerClass, opacityClass, borderClass, isHovered && automationActiveStyle, isActiveTarget && !isHovered && "animate-guide-glow-v2 border-[#306EE8] shadow-[0_0_30px_rgba(48,110,232,0.8)]")}
                >
                    <Asterisk className={cn(iconClass, "text-white transition-all duration-300")} />
                </div>
            </Html>
        </group>
    );
});
WebsiteNode.displayName = 'WebsiteNode';

// --- ANIMATION CONFIG ---
const DURATION_PULL = 0.5; // Slightly slower pulling to see the blast

const MagneticScene = ({ guideStep, setGuideStep }: {
    guideStep: number,
    setGuideStep: React.Dispatch<React.SetStateAction<number>>
}) => {
    const CENTER_POS = useRef(new THREE.Vector3(0, 0, 0)).current;

    // FINALE STATE
    const [isFinale, setIsFinale] = useState(false);
    const finaleTimer = useRef(0);
    const [blastTriggers, setBlastTriggers] = useState<boolean[]>([false, false, false, false]);

    // Initial Positions (Static Reference)
    const initCorners = useMemo(() => [
        new THREE.Vector3(-4.6, 3.0, 0), new THREE.Vector3(4.6, 3.0, 0),
        new THREE.Vector3(4.6, -3.0, 0), new THREE.Vector3(-4.6, -3.0, 0)
    ], []);

    // REFS FOR DIRECT ANIMATION
    const cornerNodeRefs = useRef<(THREE.Group | null)[]>([]);

    // For the LINES to follow the nodes without re-render, we need to pass Refs or use a specialized line.
    // BUT the user insists on using the EXISTING ElectricLine. 
    // Existing ElectricLine takes `start` and `end` as [number, number, number] | Vector3.
    // If we want them to animate, we MUST re-render the parent or the line needs to opt-in to refs.
    // Compromise: We will use a `useFrame` to force update a locally created Ref-based line?
    // User hates "fancy".
    // Let's rely on the fact that `blast` is fast.
    // We will triggers the blasts (static start/end from initCorners is fine because at t=0 of blast, nodes are there).
    // As nodes move IN, the blast might look weird if it stays at perimeter.
    // Use `forceUpdate` pattern? No, expensive.
    // Let's just use the `initCorners` for the START of the blast.
    // The blast is a "shot". It doesn't necessarily need to stick to the moving node perfectly if it's an "impulse".

    const corners = useRef([
        new THREE.Vector3(-4.6, 3.0, 0), new THREE.Vector3(4.6, 3.0, 0),
        new THREE.Vector3(4.6, -3.0, 0), new THREE.Vector3(-4.6, -3.0, 0)
    ]);

    // HELPERS
    const { viewport, size } = useThree();
    const hasDimensions = size.width > 0;
    const { centerRadius, cornerRadius } = useMemo(() => {
        const toUnits = (pixels: number) => hasDimensions ? (pixels / size.width) * viewport.width : 0;
        return { centerRadius: toUnits(80 * 0.9 * 0.46), cornerRadius: toUnits(80 * 0.65 * 0.46) };
    }, [size.width, viewport.width, hasDimensions]);

    // We need a helper that returns mutable vectors if possible, or just values.
    const getPerimeterPoint = useCallback((from: THREE.Vector3, to: THREE.Vector3, radius: number) => {
        const dir = to.clone().sub(from).normalize();
        return from.clone().add(dir.multiplyScalar(radius));
    }, []);

    // --- ANIMATION LOOP ---
    useFrame((state, delta) => {
        if (!isFinale) return;

        finaleTimer.current += delta;
        const t = finaleTimer.current;

        // 1. THE PULL (Corners -> Center)
        const pullProgress = Math.min(t / DURATION_PULL, 1.0);
        const pullEase = pullProgress * pullProgress * pullProgress; // EaseInCubic

        corners.current.forEach((c, i) => {
            // Update Vector
            c.lerpVectors(initCorners[i], CENTER_POS, pullEase);

            // Update Visual Node
            if (cornerNodeRefs.current[i]) {
                cornerNodeRefs.current[i]!.position.copy(c);
            }
        });
    });

    const handleCenterHover = () => {
        if (guideStep === -1) {
            setBlastTriggers(b => { const nb = [...b]; nb[0] = true; return nb; });
            setTimeout(() => setBlastTriggers(b => { const nb = [...b]; nb[0] = false; return nb; }), 500);
            setGuideStep(1);
        } else if (guideStep >= 4 && !isFinale) {
            // TRIGGER FINAL SEQUENCE: 4 Simultaneous Blasts
            setBlastTriggers([true, true, true, true]); // All fire!
            setTimeout(() => setBlastTriggers([false, false, false, false]), 600); // 600ms blast

            setIsFinale(true);
        }
    };

    const handleCornerHover = (index: number) => {
        if (index === guideStep && !isFinale) {
            setBlastTriggers(prev => { const next = [...prev]; next[index] = true; return next; });
            setTimeout(() => setBlastTriggers(prev => { const next = [...prev]; next[index] = false; return next; }), 500);
            setGuideStep(prev => prev + 1);
        }
    };

    return (
        <group>
            {/* 1. BLAST BEAMS - Shared for Guide AND Finale */}
            {initCorners.map((pos, i) => {
                // To keep it simple, blasts always go to the INIT position (the "Perimeter").
                // Even if node is moving, the "Blast" was the trigger.
                const start = getPerimeterPoint(CENTER_POS, pos, centerRadius).toArray();
                const end = getPerimeterPoint(pos, CENTER_POS, cornerRadius).toArray();

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

            {/* 1.5 SHOCKWAVES */}
            {blastTriggers.map((active, i) => active && <ImpactShockwave key={`shock-${i}`} position={initCorners[i].toArray()} onComplete={() => { }} />)}

            {/* 2. THE FRAME */}
            {initCorners.map((_, i) => {
                const nextI = (i + 1) % 4;
                if (guideStep < i + 1 && !isFinale) return null;

                const c1 = initCorners[i];
                const c2 = initCorners[nextI];
                const R = 0.8; // Corner radius

                // Calculate line endpoints
                let lineStart = getPerimeterPoint(initCorners[i], initCorners[nextI], cornerRadius);
                let lineEnd = getPerimeterPoint(initCorners[nextI], initCorners[i], cornerRadius);

                // During finale: shorten lines to make room for corners
                if (isFinale) {
                    const dir = c2.clone().sub(c1).normalize();
                    lineStart = c1.clone().add(dir.clone().multiplyScalar(R));
                    lineEnd = c2.clone().sub(dir.clone().multiplyScalar(R));
                }

                return <ElectricLine key={`frame-${i}`} start={lineStart.toArray()} end={lineEnd.toArray()} mode="stable" color="#00A3FF" />;
            })}

            {/* 2.5 CORNER CURVES - FINALE ONLY */}
            {isFinale && initCorners.map((cornerPos, i) => {
                const prevI = (i - 1 + 4) % 4;
                const nextI = (i + 1) % 4;
                const R = 0.8;

                // Incoming line direction (from prev corner)
                const prevCorner = initCorners[prevI];
                const vecIn = cornerPos.clone().sub(prevCorner).normalize();
                const curveStart = cornerPos.clone().sub(vecIn.multiplyScalar(R));

                // Outgoing line direction (to next corner)
                const nextCorner = initCorners[nextI];
                const vecOut = nextCorner.clone().sub(cornerPos).normalize();
                const curveEnd = cornerPos.clone().add(vecOut.multiplyScalar(R));

                return (
                    <ElectricLine
                        key={`corner-curve-${i}`}
                        start={curveStart.toArray()}
                        end={curveEnd.toArray()}
                        cornerPoint={cornerPos.toArray()}
                        mode="stable"
                        color="#00A3FF"
                    />
                );
            })}

            {/* 3. CENTER NODE */}
            <WebsiteNode
                position={CENTER_POS}
                type="CENTER"
                isUnlocked={true}
                revealed={true}
                isActiveTarget={guideStep === -1 || (guideStep >= 4 && !isFinale)}
                isFinale={isFinale}
                onHover={handleCenterHover}
            />

            {/* 3. HERO ASSEMBLY */}
            <HeroAssembly3D />

            {/* 4. CORNER NODES */}
            {initCorners.map((pos, i) => (
                <WebsiteNode
                    key={i}
                    ref={(el: THREE.Group | null) => { cornerNodeRefs.current[i] = el; }}
                    position={pos}
                    type="CORNER"
                    isUnlocked={guideStep >= i}
                    revealed={guideStep >= i}
                    isActiveTarget={guideStep === i}
                    isFinale={isFinale}
                    onHover={() => handleCornerHover(i)}
                />
            ))}
        </group>
    );
};

export const MagneticWebsite = ({ isActive = false }: { isActive?: boolean }) => {
    const [guideStep, setGuideStep] = useState(-1);
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
