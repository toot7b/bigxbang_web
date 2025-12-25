"use client";

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import Asterisk from './Asterisk';
import { ElectricLine } from './ElectricLine';

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

const PLASMA_FRAGMENT = `
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
    float fbm(vec2 p) {
        float f = 0.0;
        f += 0.5000 * noise(p); p *= 2.02;
        f += 0.2500 * noise(p); p *= 2.03;
        f += 0.1250 * noise(p);
        return f;
    }
    void main() {
        vec2 center = vec2(0.5);
        vec2 p = vUv - center;
        // Aspect ratio correction for circle on rectangular plane (9.2 / 6.0 = ~1.53)
        p.x *= 1.53;
        
        float dist = length(p);
        float angle = atan(p.y, p.x);
        
        // PLASMA EXPLOSION LOGIC (Natural Circle)
        // Radius expands to fit window height (0.5 * 1.0)
        float radius = uLife * 0.9; 
        
        float baseWidth = 0.25 * (1.0 - uLife); 
        
        // Heavy Distortion (Plasma)
        float noiseVal = fbm(vec2(angle * 3.0, uTime * 2.0 - dist * 5.0));
        float distort = (noiseVal - 0.5) * 0.4 * (1.0 - uLife);
        
        float circle = abs(dist - radius + distort);
        float ring = 1.0 - smoothstep(0.0, baseWidth, circle);
        
        // Inner Glow (Fill)
        float innerGlow = smoothstep(radius, 0.0, dist) * 0.6 * (1.0 - uLife);
        
        float alpha = ring + innerGlow;
        
        // Debris
        float debris = step(0.92, noise(vUv * 25.0 + uTime)) * (1.0 - smoothstep(radius, radius + 0.1, dist)) * smoothstep(radius - 0.2, radius, dist);
        alpha += debris * (1.0 - uLife);

        vec3 color = mix(uColor, vec3(1.0, 1.0, 1.0), ring * 0.9 + innerGlow * 0.5);
        float opacity = pow(1.0 - uLife, 0.5);
        
        // VIGNETTE (Soft Edge Fade)
        // Fades out the effect as it touches the exact border of the geometry
        float edgeX = smoothstep(0.48, 0.45, abs(vUv.x - 0.5));
        float edgeY = smoothstep(0.48, 0.45, abs(vUv.y - 0.5));
        alpha *= edgeX * edgeY;

        gl_FragColor = vec4(color, alpha * opacity * 2.5); 
    }
`;

const NODE_VERTEX = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const ImpactShockwave = ({ position, onComplete, size = 4.0, variant = 'simple' }: { position: [number, number, number], onComplete: () => void, size?: number | [number, number], variant?: 'simple' | 'plasma' }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const waveLife = useRef(0.0);
    const { camera } = useThree();
    const meshRef = useRef<THREE.Mesh>(null);

    // Handle args
    const planeArgs: [number, number] = Array.isArray(size) ? size : [size, size];

    useFrame((state, delta) => {
        if (!materialRef.current || !meshRef.current) return;
        meshRef.current.quaternion.copy(camera.quaternion);
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

        // Slower speed for plasma to appreciate the detail
        const speed = variant === 'plasma' ? 1.0 : 3.0;
        waveLife.current += delta * speed;

        if (waveLife.current >= 1.0) onComplete();
        materialRef.current.uniforms.uLife.value = waveLife.current;
    });

    return (
        <mesh ref={meshRef} position={position}>
            <planeGeometry args={planeArgs} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={NODE_VERTEX}
                fragmentShader={variant === 'plasma' ? PLASMA_FRAGMENT : SHOCKWAVE_FRAGMENT}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={{
                    uTime: { value: 0 },
                    uLife: { value: 0 },
                    uColor: { value: new THREE.Color("#00A3FF") }
                }}
            />
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
    const [shockwaveTrigger, setShockwaveTrigger] = useState(false);
    const [frameShock, setFrameShock] = useState(false);

    // Initial Positions (Static Reference)
    const initCorners = useMemo(() => [
        new THREE.Vector3(-4.6, 3.0, 0), new THREE.Vector3(4.6, 3.0, 0),
        new THREE.Vector3(4.6, -3.0, 0), new THREE.Vector3(-4.6, -3.0, 0)
    ], []);

    // REFS FOR DIRECT ANIMATION
    const cornerNodeRefs = useRef<(THREE.Group | null)[]>([]);

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

        // 2. SHOCKWAVE TRIGGER at Impact (approx DURATION_PULL)
        if (t >= DURATION_PULL - 0.05 && t < DURATION_PULL + 0.05 && !shockwaveTrigger) {
            setShockwaveTrigger(true);
            setTimeout(() => setFrameShock(true), 350); // Visual delay for impact
            setTimeout(() => setFrameShock(false), 700); // Reset after shake
        }
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
            setShockwaveTrigger(false); // Reset shockwave
            setFrameShock(false);
            finaleTimer.current = 0;
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

            {/* CENTRAL IMPACT SHOCKWAVE (WINDOW MASKED) */}
            {/* Size = [9.2, 6.0] matching the frame exactly */}
            {shockwaveTrigger && <ImpactShockwave position={[0, 0, -0.1]} onComplete={() => { }} size={[9.2, 6.0]} variant="plasma" />}


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

                return (
                    <ElectricLine
                        key={`frame-${i}`}
                        start={lineStart.toArray()}
                        end={lineEnd.toArray()}
                        mode="stable"
                        color="#00A3FF"
                        fadeEdges={!isFinale}
                        turbulence={frameShock ? 0.3 : 0} // SHOCK REACTION: SUBTLE SHAKE
                    />
                );
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
                        fadeEdges={false}
                        turbulence={frameShock ? 0.5 : 0} // SHOCK REACTION: SUBTLE SHAKE
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
