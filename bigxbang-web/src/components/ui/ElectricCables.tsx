"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PerspectiveCamera, Line } from "@react-three/drei";

// --- SCANNER-STYLE SHADER ---
// "Recycled" from TechScanner but adapted for TubeGeometry UVs.

// CONSTANTS (Tweakable)
const NOISE_SCALE = 2.0;
const SPEED_IDLE = 1.5;
const SPEED_ACTIVE = 6.0;

// --- TECH SCANNER SHADER PORT (SCALED FOR TUBE) ---

const SCANNER_VERTEX = `
    varying vec2 vUv;
    varying vec3 vPos;
    uniform float uTime;
    
    void main() {
        vUv = uv;
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const SCANNER_FRAGMENT = `
    // SCALING FACTORS FOR TUBE GEOMETRY
    // Original ARC_WIDTH was 0.004 (for screen space). 
    // We increase it because UV space on tube is small.
    #define ARC_WIDTH 0.15 
    #define GLOW_FALLOFF 4.0
    #define BOLT_SPEED 4.0

    uniform float uTime;
    uniform float uIntensity; 
    uniform vec3 uColor;
    varying vec2 vUv;

    // --- NOISE ---
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
        f += 0.1250 * noise(p); p *= 2.01;
        f += 0.0625 * noise(p);
        return f;
    }

    void main() {
        // vUv.y is the circumference (0 to 1). 
        // vUv.x is the length (0 to 1).
        
        float t = uTime * BOLT_SPEED;
        
        // 1. MAIN BOLT
        float jaggedness = 15.0; 
        if (uIntensity > 0.5) jaggedness = 30.0; 

        // Distortion using FBM
        // We scroll noise along X
        float distortion = fbm(vec2(vUv.x * jaggedness - t * 1.5, t * 1.2)); 
        
        // Map distortion to Y offset (-0.5 to 0.5 coverage)
        float path = (distortion - 0.5) * 0.8; 
        
        // Distance from center line (modified by path)
        float dist = abs(vUv.y - 0.5 - path);
        
        // Electric Bolt (Inverse distance)
        float bolt = ARC_WIDTH / max(dist, 0.01);
        
        // 2. GLOW
        // Base glow from center
        float glow = exp(-abs(vUv.y - 0.5) * GLOW_FALLOFF);
        
        // 3. COMBINE
        // Scale by intensity
        float interaction = (bolt + glow) * uIntensity;
        
        // Color: Mix User Color with White Core.
        // CAP WHITE to 30% max as requested.
        vec3 finalColor = mix(uColor, vec3(1.0), clamp(interaction * 0.4, 0.0, 0.3));
        
        // Alpha (Visual intensity)
        float alpha = interaction;
        
        // Fade Ends (Soft start/end)
        float fade = smoothstep(0.0, 0.05, vUv.x) * (1.0 - smoothstep(0.95, 1.0, vUv.x));
        alpha *= fade;
        
        // Clamp alpha to avoid glitch
        gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
    }
`;

// --- ORCHESTRATION TYPES ---
// ORCHESTRATION TYPES
type ConductorState = 'ACCUMULATION' | 'DISCHARGE';

interface Conductor {
    state: ConductorState;
    targets: number[];
    lastActionTime: number;
    params: any[];
}

const Cable = ({
    startPos,
    endPos,
    index,
    activeIndex,
    conductor,
    startOffset = 0,
    endOffset = 0
}: {
    startPos: [number, number, number],
    endPos: [number, number, number],
    index: number,
    activeIndex: number | null,
    conductor: React.MutableRefObject<Conductor>,
    startOffset?: number,
    endOffset?: number
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // SAFETY: If start/end are too close, don't render
    const dist = new THREE.Vector3(...startPos).distanceTo(new THREE.Vector3(...endPos));
    const isValid = dist > 1.0;

    // GEOMETRY (Curve)
    const curve = useMemo(() => {
        if (!isValid) return null;
        const start = new THREE.Vector3(...startPos);
        const end = new THREE.Vector3(...endPos);

        // Apply Horizontal Offsets (Connect to 3 o'clock / 9 o'clock)
        if (startOffset > 0 || endOffset > 0) {
            start.x += startOffset;
            end.x -= endOffset;
        }

        const rangeX = end.x - start.x;
        const cp1 = new THREE.Vector3(start.x + rangeX * 0.3, start.y, 0);
        const funnelX = start.x + rangeX * 0.7;
        const funnelY = end.y + (start.y - end.y) * 0.1;
        const cp2 = new THREE.Vector3(funnelX, funnelY, 0);
        return new THREE.CatmullRomCurve3([start, cp1, cp2, end]);
    }, [startPos, endPos, isValid, startOffset, endOffset]);

    useFrame((state) => {
        if (!materialRef.current) return;
        const time = state.clock.elapsedTime;
        materialRef.current.uniforms.uTime.value = time;

        const isHovered = activeIndex === index;
        const isSourceHovered = activeIndex !== null;
        let target = conductor.current.targets[index] || 0;
        if (isHovered) target = 2.0;
        else if (isSourceHovered) target *= 0.3;

        const current = materialRef.current.uniforms.uIntensity.value;
        materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(current, target, 0.5);
    });

    if (!isValid || !curve) return null;

    return (
        <mesh ref={meshRef}>
            <tubeGeometry args={[curve, 64, 0.04, 8, false]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={SCANNER_VERTEX}
                fragmentShader={SCANNER_FRAGMENT}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                uniforms={{
                    uTime: { value: 0 },
                    uIntensity: { value: 0 },
                    uColor: { value: new THREE.Color("#00A3FF") }
                }}
            />
        </mesh>
    );
};

// --- SCENE CONTENT ---

// --- ENERGY NODE VISUAL (RING CHARGE & PROPAGATING SHOCK) ---
// Center: Arcs meet -> Flare.
// Right: Propagating Shockwave from Left to Right.
const EnergyNode = ({
    pos,
    type,
    conductor
}: {
    pos: [number, number, number],
    type: 'CENTER' | 'RIGHT',
    conductor: React.MutableRefObject<Conductor>
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const NODE_VERTEX = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const NODE_FRAGMENT = `
        uniform float uTime;
        uniform float uProgress;    // 0 -> 1 
        uniform float uIntensity;
        uniform float uType;        // 0 = CENTER, 1 = RIGHT
        uniform vec3 uColor;
        varying vec2 vUv;

        #define PI 3.14159265359

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
            vec2 toCenter = vUv - center;
            float dist = length(toCenter);
            float angle = atan(toCenter.y, toCenter.x); // -PI..PI
            
            // --- RING BASE ---
            float electricDistort = noise(vec2(angle * 4.0, uTime * 5.0)) * 0.02;
            float ringRadius = 0.46 + electricDistort;
            float ringDist = abs(dist - ringRadius);
            float ring = 0.005 / max(ringDist, 0.001); 
            
            float alpha = 0.0;
            vec3 finalColor = uColor;

            if (uType < 0.5) { 
                // --- CENTER: CHARGING ARCS ---
                float p = 1.0 - (abs(angle) / PI); 
                
                if (p < uProgress) {
                    float isTip = smoothstep(0.0, 0.1, p - (uProgress - 0.1));
                    alpha = ring;
                    finalColor += vec3(isTip * 3.0); 
                    
                    // Sparks trail
                    float sparks = fbm(vUv * 10.0 - vec2(uTime * 2.0, 0.0));
                    alpha += sparks * 0.2 * step(0.4, dist) * step(dist, 0.5);
                }

                // IMPACT AT CROSSING (Angle 0)
                if (uProgress > 0.95) {
                    float impactDist = distance(vUv, vec2(0.5 + 0.46, 0.5)); // 3 o'clock
                    float shockwave = 1.0 - smoothstep(0.0, 0.15, impactDist);
                    float flash = sin(uTime * 30.0) * 0.5 + 0.5;
                    finalColor += vec3(1.0) * shockwave * flash * 3.0; // Lens Flare Intensity
                    alpha += shockwave * flash;
                }
                
            } else {
                // --- RIGHT: PROPAGATING SHOCKWAVE ---
                // No global ring by default, only the wave
                alpha = ring * 0.3; // Dim base ring

                // Wave Origin: Left Edge (Angle PI)
                // We simulate a wave travelling from Left (0.0) to Right (1.0) in UV space
                
                float waveDist = distance(vUv, vec2(0.05, 0.5)); // Start at left edge
                float wavePos = uProgress * 2.5; // Expands to cover circle
                
                // The Wave (Thin bright ring)
                float wave = 1.0 - smoothstep(0.0, 0.1, abs(waveDist - wavePos));
                
                // Front of the wave is sharp
                wave *= step(waveDist, wavePos); 
                
                // Intensity fade over distance
                float waveIntensity = (1.0 - uProgress) * 4.0; 

                alpha += wave * waveIntensity;
                finalColor += vec3(1.0) * wave * waveIntensity; // White Hot Wave
            }

            // Global Mask
            alpha *= smoothstep(0.5, 0.48, dist); 

            gl_FragColor = vec4(finalColor, alpha);
        }
    `;

    useFrame((state) => {
        if (!materialRef.current) return;
        const C = conductor.current;
        const time = state.clock.elapsedTime;
        materialRef.current.uniforms.uTime.value = time;

        const CYCLE_DURATION = 4.0;
        const BURST_DURATION = 0.5;
        const CHARGE_DURATION = CYCLE_DURATION - BURST_DURATION;
        const cycleTime = time % CYCLE_DURATION;

        let targetProgress = 0;
        let targetIntensity = 0.0;

        const isCenter = type === 'CENTER';
        materialRef.current.uniforms.uType.value = isCenter ? 0.0 : 1.0;

        if (C.state === 'ACCUMULATION') {
            const progress = cycleTime / CHARGE_DURATION;
            if (isCenter) {
                targetProgress = Math.pow(progress, 1.5);
                targetIntensity = 1.0;
            } else {
                // Right: Off
                targetProgress = 0.0;
                targetIntensity = 0.0;
            }
        } else {
            // DISCHARGE
            const burstProgress = (cycleTime - CHARGE_DURATION) / BURST_DURATION;
            if (isCenter) {
                targetProgress = 1.0;
                targetIntensity = 1.0 - burstProgress * 2.0;
            } else {
                // Right: PROPAGATING SHOCK
                // Pass the burst progress directly to drive the wave
                targetProgress = burstProgress;
                targetIntensity = 1.0; // Handled in shader
            }
        }

        const m = materialRef.current;
        if (isCenter && C.state === 'ACCUMULATION') {
            m.uniforms.uProgress.value = targetProgress;
        } else if (!isCenter) {
            // For Right, we want instant update for the wave, no smoothing lag
            m.uniforms.uProgress.value = targetProgress;
        } else {
            m.uniforms.uProgress.value = THREE.MathUtils.lerp(m.uniforms.uProgress.value, targetProgress, 0.1);
        }

        m.uniforms.uIntensity.value = THREE.MathUtils.lerp(m.uniforms.uIntensity.value, targetIntensity, 0.1);
    });

    return (
        <mesh ref={meshRef} position={pos}>
            <planeGeometry args={[2.1, 2.1]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={NODE_VERTEX}
                fragmentShader={NODE_FRAGMENT}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={{
                    uTime: { value: 0 },
                    uProgress: { value: 0 },
                    uIntensity: { value: 0 },
                    uType: { value: 0 },
                    uColor: { value: new THREE.Color("#00A3FF") }
                }}
            />
        </mesh>
    );
};

const ElectricCablesContent = ({ inputs, output, finalOutput, activeIndex }: {
    inputs: { x: number, y: number }[],
    output: { x: number, y: number },
    finalOutput?: { x: number, y: number },
    activeIndex: number | null
}) => {
    const { viewport, size } = useThree();

    // ORCHESTRATOR STATE
    const conductor = useRef<Conductor>({
        state: 'ACCUMULATION',
        targets: inputs.map(() => 0).concat([0]), // +1 for final output
        lastActionTime: 0,
        params: []
    });

    // CONDUCTOR LOGIC LOOP (STATE MACHINE)
    useFrame((state) => {
        const time = state.clock.elapsedTime;
        const CYCLE_DURATION = 4.0;
        const BURST_DURATION = 0.5; // Last 0.5s is burst
        const CHARGE_DURATION = CYCLE_DURATION - BURST_DURATION;

        const cycleTime = time % CYCLE_DURATION;
        const C = conductor.current;
        const finalIndex = inputs.length;

        // Safety resize
        if (C.targets.length !== finalIndex + 1) {
            C.targets = inputs.map(() => 0).concat([0]);
        }

        // PHASE 1: ACCUMULATION (Inputs Charge, Output Wait)
        if (cycleTime < CHARGE_DURATION) {
            C.state = 'ACCUMULATION';

            // Progress 0 -> 1
            const progress = cycleTime / CHARGE_DURATION;
            // Exponential ramp for "charging" feel (starts slow, gets energetic)
            const baseIntensity = Math.pow(progress, 3);

            // Left Cables: Ramp UP with noise
            for (let i = 0; i < finalIndex; i++) {
                // Unique jitter per cable so they aren't robotic
                const jitter = Math.random() * 0.3 * progress;
                C.targets[i] = baseIntensity + jitter;
            }

            // Right Cable: OFF
            C.targets[finalIndex] = 0.0;
        }
        // PHASE 2: DISCHARGE (Inputs Cut, Output Fires)
        else {
            C.state = 'DISCHARGE';

            // Left Cables: CUT
            for (let i = 0; i < finalIndex; i++) {
                C.targets[i] = 0.0;
            }

            // Right Cable: BURST
            const burstTime = cycleTime - CHARGE_DURATION;
            const burstProgress = burstTime / BURST_DURATION;

            // Spike to 3.0 instantly, then rapid decay
            // Using pow for sharp fallback
            const dischargeIntensity = Math.pow(1.0 - burstProgress, 2) * 4.0;
            C.targets[finalIndex] = dischargeIntensity;
        }
    });

    // Safety: Render nothing if dimensions are not yet available to avoid divide-by-zero/NaN
    if (size.width === 0 || size.height === 0) return null;

    // Map screen pixel (top-left) to Three.js world unit (center)
    const toWorld = (pos: { x: number, y: number }) => {
        // Ensure size is valid to avoid NaN
        if (size.width === 0 || size.height === 0) return [0, 0, 0] as [number, number, number];

        // X: 0 -> -W/2, W -> +W/2
        const x = (pos.x / size.width) * viewport.width - (viewport.width / 2);
        // Y: 0 -> +H/2, H -> -H/2 (Inverted coords for DOM->3D)
        const y = -((pos.y / size.height) * viewport.height - (viewport.height / 2));
        return [x, y, 0] as [number, number, number];
    };

    // Helper to convert pixels to world units
    const toUnits = (pixels: number) => (pixels / size.width) * viewport.width;

    return (
        <group>
            <ambientLight intensity={0.5} />

            {inputs.map((pos, i) => (
                <Cable
                    key={i}
                    index={i}
                    startPos={toWorld(pos) as [number, number, number]}
                    endPos={toWorld(output) as [number, number, number]}
                    activeIndex={activeIndex}
                    conductor={conductor}
                    // Inputs: size-16 (64px) -> Radius 32. Use 28 for overlap.
                    // Center: size-20 (80px) -> Radius 40. Use 36 for overlap.
                    startOffset={toUnits(28)}
                    endOffset={toUnits(36)}
                />
            ))}

            {/* FINAL OUTPUT CABLE: Center -> Right */}
            {finalOutput && (
                <Cable
                    key="final"
                    index={inputs.length} // Last index in conductor
                    startPos={toWorld(output) as [number, number, number]}
                    endPos={toWorld(finalOutput) as [number, number, number]}
                    activeIndex={null} // Independent
                    conductor={conductor}
                    // Center: size-20 (80px) -> Radius 40. Use 36 for overlap.
                    // Right: size-20 (80px) -> Radius 40. Use 36 for overlap.
                    startOffset={toUnits(36)}
                    endOffset={toUnits(36)}
                />
            )}

            {/* VISUALS: Energy Nodes */}
            <EnergyNode pos={toWorld(output) as [number, number, number]} type="CENTER" conductor={conductor} />
            {finalOutput && (
                <EnergyNode pos={toWorld(finalOutput) as [number, number, number]} type="RIGHT" conductor={conductor} />
            )}

        </group>
    );
};

export const ElectricCables = ({ activeIndex, inputs, output, finalOutput }: { activeIndex: number | null, inputs: { x: number, y: number }[], output: { x: number, y: number }, finalOutput?: { x: number, y: number } }) => {
    return (
        <Canvas className="absolute inset-0 z-0 pointer-events-none" camera={{ position: [0, 0, 10], fov: 45 }}>
            <ElectricCablesContent inputs={inputs} output={output} activeIndex={activeIndex} finalOutput={finalOutput} />
        </Canvas>
    );
};
