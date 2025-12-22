"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import Asterisk from "./Asterisk";

// --- CONFIGURATION ---
// --- CONFIGURATION ---
const STRUCTURE_COLOR = "#306EE8";
const BLUE_ELECTRIC = "#60a5fa";
const BLUE_DEEP = "#306EE8";

// --- UNSTABLE CABLE SHADER (Ported & Tweaked) ---
const CABLE_VERTEX = `
    varying vec2 vUv;
    varying vec3 vPos;
    uniform float uTime;
    
    void main() {
        vUv = uv;
        vPos = position;
        vec3 pos = position;
        
        // Violent Shake (Instability)
        // MASKED at ends so it doesn't detach from DNA
        float mask = smoothstep(0.0, 0.2, uv.x) * (1.0 - smoothstep(0.8, 1.0, uv.x));
        
        float shake = sin(uv.x * 20.0 + uTime * 40.0) * 0.1;
        float jitter = sin(uv.x * 100.0 + uTime * 100.0) * 0.03;
        
        // Apply mask to displacement
        pos.y += (shake + jitter) * mask;
        pos.z += (shake * 0.5) * mask;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

// --- NEW GLOW SHADER ---
const DNA_GLOW_VERTEX = `
    varying vec2 vUv;
    varying vec3 vNormal;
    uniform float uTime;
    uniform float uInstability; // 0.0 = Idle (Breathing), 1.0 = Struggle (Chaos)

    void main() {
        vUv = uv;
        vNormal = normal;
        vec3 pos = position;
        
        // 1. BREATHING EXPANSION (Idle)
        // Gentle puffing out along normals
        float breath = sin(uTime * 1.5) * 0.5 + 0.5; // 0..1
        float expansion = 0.05 + (breath * 0.03); // Base offset + breath
        
        // 2. UNSTABILITY (Active)
        // Jagged noise when electrocuted
        if (uInstability > 0.0) {
            float electricalNoise = sin(pos.y * 50.0 + uTime * 50.0) * 0.1;
            expansion += electricalNoise * uInstability;
        }
        
        pos += normal * expansion;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const DNA_GLOW_FRAGMENT = `
    varying vec2 vUv;
    varying vec3 vNormal;
    uniform float uTime;
    uniform float uInstability; 
    uniform vec3 uColor;
    uniform float uOpacity;

    void main() {
        // Fresnel-like intensity (edges are brighter)
        // But for a tube, we want the core to be transparent and edges glowing?
        // Or just a general volume glow.
        
        float alpha = 0.4;
        
        // 1. BREATHING GLOW (Idle)
        float breath = sin(uTime * 1.5) * 0.5 + 0.5; // 0..1
        vec3 color = uColor;
        
        if (uInstability < 0.5) {
             alpha = 0.3 + (breath * 0.2); // Pulse opacity
        } 
        
        // 2. UNSTABLE GLOW (Active)
        else {
             // Strobe / Flicker
             float flicker = step(0.5, sin(uTime * 60.0)); // On/Off chaotic
             alpha = 0.5 + (flicker * 0.3);
             
             // Whitish tint when electrocuted
             color = mix(uColor, vec3(1.0), 0.5 * flicker);
        }
        
        // Soft edges
        // float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0); // Simple view-align
        // Let's stick to flat additive for now, it's safer for performance than calculating viewDir
        
        // Apply Global Opacity (Reveal Fade)
        alpha *= uOpacity;
        
        gl_FragColor = vec4(color, alpha);
    }
`;

const CABLE_FRAGMENT = `
    #define ARC_WIDTH 0.2
    uniform float uTime;
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
        float t = uTime * 5.0;
        
        // Jagged Bolt Path
        float noiseVal = noise(vec2(vUv.x * 20.0 - t, t));
        float path = (noiseVal - 0.5) * 0.5; // Amplitude
        
        float dist = abs(vUv.y - 0.5 - path);
        
        float bolt = ARC_WIDTH / max(dist, 0.01);
        float glow = exp(-dist * 4.0);
        
        vec3 color = mix(uColor, vec3(1.0), bolt * 0.5);
        float alpha = (bolt + glow);
        
        // Ends Fade
        alpha *= smoothstep(0.0, 0.1, vUv.x) * (1.0 - smoothstep(0.9, 1.0, vUv.x));
        
        gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
    }
`;

const UnstableCable = ({ start, dnaRadius, dnaHeight, rotationRef }: { start: THREE.Vector3, dnaRadius: number, dnaHeight: number, rotationRef: React.MutableRefObject<number> }) => {
    // Refs for mutable state (no re-renders)
    const anchorRef = useRef<{ y: number, offset: number, initialized: boolean }>({ y: 0, offset: 0, initialized: false });
    const meshRef = useRef<THREE.Mesh>(null);
    const matRef = useRef<THREE.ShaderMaterial>(null);

    // Helper: Parametric -> 3D
    const getAnchorWorldPos = (y: number, offset: number, rotation: number) => {
        const normalizedY = (y + dnaHeight / 2) / dnaHeight;
        const t = normalizedY * Math.PI * 2 * 2.0; // Turns
        const angle = t + offset + rotation;
        return new THREE.Vector3(Math.cos(angle) * dnaRadius, y, Math.sin(angle) * dnaRadius);
    }

    // Constant
    const startAngle = useMemo(() => Math.atan2(start.z, start.x), [start]);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        const currentRot = rotationRef.current;

        if (matRef.current) matRef.current.uniforms.uTime.value = time;

        const TURNS_RAD = 2.0 * Math.PI * 2.0;

        // Use math to find rough best spot
        const solveForAnchorY = (offset: number) => {
            let bestY = 0;
            let minDist3D = 999999;

            // FIX DRIFT: Center search around current rotation
            // We want (startAngle - currentRot - offset + k*2PI) ≈ 0
            // So k*2PI ≈ (currentRot + offset - startAngle)
            // k ≈ (currentRot + offset - startAngle) / 2PI
            const estimatedK = Math.round((currentRot + offset - startAngle) / (Math.PI * 2));

            // Wide search range: -2 to +4 turns covers the whole cylinder plus buffer
            for (let k = estimatedK - 2; k <= estimatedK + 4; k++) {
                const numerator = startAngle - currentRot - offset + (k * Math.PI * 2);
                const normY01 = numerator / TURNS_RAD;
                const rawWorldY = normY01 * dnaHeight - (dnaHeight / 2);

                // CLAMP LOGIC:
                // If a strand solution is at Y=12.0 (above DNA), we clamp it to Y=5.0 (Top).
                // The cable will attach to the very tip of the strand until it rotates back into view.
                const clampedY = Math.max(-dnaHeight / 2, Math.min(dnaHeight / 2, rawWorldY));

                const pos = getAnchorWorldPos(clampedY, offset, currentRot);
                const d = pos.distanceTo(start);

                if (d < minDist3D) {
                    minDist3D = d;
                    bestY = clampedY;
                }
            }
            return { y: bestY, dist: minDist3D };
        };

        const solA = solveForAnchorY(0);
        const solB = solveForAnchorY(Math.PI);

        let chosenY = 0;
        let chosenOffset = 0;

        if (solA.dist < solB.dist) {
            chosenY = solA.y; chosenOffset = 0;
        } else {
            chosenY = solB.y; chosenOffset = Math.PI;
        }

        anchorRef.current = { y: chosenY, offset: chosenOffset, initialized: true };

        // 2. GENERATE GEOMETRY (Every Frame)
        if (meshRef.current) {
            // A. Calculate Math Target (Pure Math, No Raycast)
            // This is robust because getAnchorWorldPos generates a point ON the parametric cylinder.
            const finalTarget = getAnchorWorldPos(anchorRef.current.y, anchorRef.current.offset, currentRot);

            // B. Build Curve
            const mid = start.clone().lerp(finalTarget, 0.5);
            // Add noise to mid point for electric look
            const noiseX = Math.sin(time * 10.0 + start.y) * 0.5;
            const noiseY = Math.cos(time * 15.0 + start.x) * 0.5;
            mid.add(new THREE.Vector3(noiseX, noiseY, 0));

            const curve = new THREE.CatmullRomCurve3([start, mid, finalTarget]);

            // C. Update Geometry
            if (meshRef.current.geometry) meshRef.current.geometry.dispose();
            meshRef.current.geometry = new THREE.TubeGeometry(curve, 20, 0.03, 8, false);
        }
    });

    return (
        <mesh ref={meshRef}>
            {/* Initial Geometry placeholder - quickly replaced */}
            <tubeGeometry args={[new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)]), 20, 0.03, 8, false]} />
            <shaderMaterial
                ref={matRef}
                vertexShader={CABLE_VERTEX}
                fragmentShader={CABLE_FRAGMENT}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={{
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color(BLUE_ELECTRIC) }
                }}
            />
        </mesh>
    );
};

// ... Existing Code ...

// --- SCHEMA DATA ---
// Zigzag descending: TL -> R -> L -> BR
// Zigzag descending: TL -> R -> L -> BR
const SCHEMA_DEFS = [
    { id: 0, title: "Stratégie", description: "Vision & Plan", side: "left", position: [-3.5, 2.0, 0] },
    { id: 1, title: "Marketing", description: "Croissance & ROI", side: "right", position: [3.8, 2.8, 0] },
    { id: 2, title: "Contenu", description: "Story & Brand", side: "left", position: [-3.8, -1.8, 0] },
    { id: 3, title: "Design", description: "UI & UX", side: "right", position: [3.5, -1.0, 0] },
];

// --- SHADER (Electric DNA Rung) ---
const SCANNER_VERTEX = `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uInstability;
    void main() {
        vUv = uv;
        vec3 pos = position;
        if (uInstability > 0.0) {
            float shake = sin(uv.x * 20.0 + uTime * 30.0) * 0.05 * uInstability;
            pos.y += shake;
            pos.z += shake;
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const SCANNER_FRAGMENT = `
    #define ARC_WIDTH 0.15
    #define GLOW_FALLOFF 4.0
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    varying vec2 vUv;
    void main() {
        float dist = abs(vUv.y - 0.5);
        float bolt = ARC_WIDTH / max(dist, 0.01);
        float glow = exp(-dist * GLOW_FALLOFF);
        float interaction = (bolt + glow) * uIntensity;
        vec3 baseColor = mix(uColorStart, uColorEnd, smoothstep(0.40, 0.60, vUv.x));
        vec3 finalColor = mix(baseColor, vec3(1.0), clamp(interaction * 0.4, 0.0, 0.5));
        float alpha = interaction;
        float fade = smoothstep(0.0, 0.05, vUv.x) * (1.0 - smoothstep(0.95, 1.0, vUv.x));
        alpha *= fade;
        gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
    }
`;

const HEIGHT = 10;
const RADIUS = 1.2;
const TURNS = 2.0;



const ProceduralDNA = ({ onHoverChange, rotationRef, isInteracting, opacity = 1.0 }: { onHoverChange: (id: number | null) => void, rotationRef: React.MutableRefObject<number>, isInteracting: boolean, opacity?: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const rotationSpeed = useRef(0.2);
    const accumulatedRot = useRef(0); // Track true rotation separately from visual jitter

    // DNA Geometry
    const { strandA, strandB } = useMemo(() => {
        const pA: THREE.Vector3[] = [];
        const pB: THREE.Vector3[] = [];
        const total = 80;

        for (let i = 0; i <= total; i++) {
            const t = (i / total) * Math.PI * 2 * TURNS;
            const y = (i / total) * HEIGHT - (HEIGHT / 2);
            const x = Math.cos(t) * RADIUS;
            const z = Math.sin(t) * RADIUS;
            pA.push(new THREE.Vector3(x, y, z));
            pB.push(new THREE.Vector3(-x, y, -z));
        }

        return {
            strandA: new THREE.CatmullRomCurve3(pA),
            strandB: new THREE.CatmullRomCurve3(pB)
        };
    }, []);

    // Rung generation moved to Memo above to ensure consistency if lines were meant to be there
    // But simplified for replace_content context:
    const rungIndices = useMemo(() => {
        const indices = [];
        const count = 16;
        for (let i = 0; i < count; i++) indices.push(Math.floor(i * (80 / count)));
        return indices;
    }, []);

    const glowMatRef = useRef<THREE.ShaderMaterial>(null);

    // Create the glow material once and assign it to the ref
    const glowMaterial = useMemo(() => {
        const material = new THREE.ShaderMaterial({
            vertexShader: DNA_GLOW_VERTEX,
            fragmentShader: DNA_GLOW_FRAGMENT,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.BackSide,
            uniforms: {
                uTime: { value: 0 },
                uInstability: { value: 0 },
                uColor: { value: new THREE.Color(BLUE_ELECTRIC) },
                uOpacity: { value: 0 }
            }
        });
        glowMatRef.current = material; // Assign to ref here
        return material;
    }, []);

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        // STRUGGLE PHYSICS:
        // Normal state: Smooth, fast rotation (0.2).
        // Interacting: "Struggling". The motor creates torque, the cable resists.
        // Result: Slow rotation + High Tension Vibration.

        const targetSpeed = isInteracting ? 0.05 : 0.2; // Slow but still moving (struggling to climb)

        // Physical Inertia on Speed
        rotationSpeed.current = THREE.MathUtils.lerp(rotationSpeed.current, targetSpeed, delta * 2.0);

        // Integrate Physics Rotation
        accumulatedRot.current += rotationSpeed.current * delta;

        // Calculate Visual Rotation (Physics + Vibration)
        let visualRotation = accumulatedRot.current;

        if (isInteracting) {
            // Apply TENSION JITTER
            // High frequency (50.0), small amplitude (0.02)
            // This makes it look like it's vibrating under stress
            const tension = Math.sin(time * 60.0) * 0.01 + Math.sin(time * 120.0) * 0.005;
            visualRotation += tension;
        }

        // BREATHING (Idle State)
        // When free, it breathes (organic scale).
        // When struggling, it's tense/rigid (scale 1.0).
        const targetScale = isInteracting ? 1.0 : 1.0 + Math.sin(time * 1.0) * 0.02; // Slow breath

        if (groupRef.current) {
            // Apply Rotation
            groupRef.current.rotation.y = visualRotation;

            // Apply Breathing (Smoothed)
            const currentScale = groupRef.current.scale.x;
            const smoothScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 2.0);
            groupRef.current.scale.set(smoothScale, smoothScale, smoothScale);

            // SYNC ROTATION for Cables
            rotationRef.current = groupRef.current.rotation.y;
        }

        // UPDATE GLOW UNIFORMS
        glowMaterial.uniforms.uTime.value = time;
        glowMaterial.uniforms.uInstability.value = isInteracting ? 1.0 : 0.0;

        // Opacity Logic
        const currentOp = glowMaterial.uniforms.uOpacity.value;
        const nextOp = THREE.MathUtils.lerp(currentOp, opacity, 0.05);
        glowMaterial.uniforms.uOpacity.value = nextOp;

        if (groupRef.current) {
            groupRef.current.visible = nextOp > 0.01;
        }
    });

    const strandMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: STRUCTURE_COLOR,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 0.8,
        side: THREE.DoubleSide
    }), []);

    // Re-generating rungs geometry on fly or reuse from above?
    // Let's stick to the previous implementation pattern roughly, ensuring rungs array exists
    // We need to access points from the curves we just made.
    const getPoint = (curve: THREE.Curve<THREE.Vector3>, t: number) => curve.getPoint(t);

    return (
        <group ref={groupRef} name="dna-structure">
            {/* Physical Strands */}
            <mesh geometry={new THREE.TubeGeometry(strandA, 128, 0.15, 8, false)} material={strandMaterial} />
            <mesh geometry={new THREE.TubeGeometry(strandB, 128, 0.15, 8, false)} material={strandMaterial} />

            {/* GLOW SHELL */}
            <mesh geometry={new THREE.TubeGeometry(strandA, 128, 0.15, 8, false)} material={glowMaterial} />
            <mesh geometry={new THREE.TubeGeometry(strandB, 128, 0.15, 8, false)} material={glowMaterial} />

            {rungIndices.map((idx, i) => (
                <ElectricRung
                    key={i}
                    start={strandA.getPoint(idx / 80)}
                    end={strandB.getPoint(idx / 80)}
                    colorStart={i % 2 === 0 ? BLUE_ELECTRIC : BLUE_DEEP}
                    colorEnd={i % 2 === 0 ? BLUE_DEEP : BLUE_ELECTRIC}
                />
            ))}
        </group>
    );
};

const ElectricRung = ({ start, end, colorStart, colorEnd }: any) => {
    const curve = useMemo(() => new THREE.CatmullRomCurve3([start, end]), [start, end]);
    const matRef = useRef<THREE.ShaderMaterial>(null!);
    useFrame((state) => {
        if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    });
    return (
        <mesh>
            <tubeGeometry args={[curve, 20, 0.02, 8, false]} />
            <shaderMaterial
                ref={matRef}
                vertexShader={SCANNER_VERTEX}
                fragmentShader={SCANNER_FRAGMENT}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                uniforms={{
                    uTime: { value: 0 },
                    uIntensity: { value: 0.5 },
                    uInstability: { value: 0.3 },
                    uColorStart: { value: new THREE.Color(colorStart) },
                    uColorEnd: { value: new THREE.Color(colorEnd) }
                }}
            />
        </mesh>
    );
};

// --- ENERGY NODE SHADER (From User Code) ---
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
    uniform float uInstability; // NEW
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
        f += 0.2500 * noise(p);
        return f;
    }

    void main() {
        vec2 center = vec2(0.5);
        vec2 toCenter = vUv - center;
        float dist = length(toCenter);
        float angle = atan(toCenter.y, toCenter.x); // -PI..PI
        
        // --- RING BASE ---
        float shakeSpeed = mix(5.0, 30.0, uInstability);
        float shakeAmp = mix(0.02, 0.15, uInstability); // Large oval distortion
        
        float wobble = sin(angle * 3.0 + uTime * shakeSpeed) * shakeAmp;
        // REMOVED: grit (noise dots) based on feedback

        float ringRadius = 0.46 + wobble;
        float ringDist = abs(dist - ringRadius);
        
        float thickness = 0.005 + (uInstability * 0.02); 
        float ring = thickness / max(ringDist, 0.01); 
        
        float alpha = 0.0;
        vec3 finalColor = uColor;

        // --- CENTER: CHARGING ARCS ---
        float p = 1.0 - (abs(angle) / PI); 
        
        // Always show ring foundation
        alpha = ring;

        // Charging Arc Effect
        if (p < uProgress) {
            // REMOVED: isTip (white dot)
            // Just the arc color
        }

        // Global Mask
        alpha *= smoothstep(0.5, 0.48, dist); 
        
        // Intensity scaling
        alpha *= uIntensity;

        gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
    }
`;

// 3D ELECTRIC RING COMPONENT (Accurate Sizing)
const ElectricRing = ({ position, isActive, isFirst = false, revealed = false }: { position: [number, number, number], isActive: boolean, isFirst?: boolean, revealed?: boolean }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    // ALWAYS start at 0.0 to allow for "Grow" animation on mount
    const scaleRef = useRef(0.0);
    const { viewport, size } = useThree();

    // Calculate dynamic size in 3D units to match Pixel visuals
    // Target: TIGHT fit. Asterisk is 48px.
    // Visual Ring Diameter = 52 * 0.92 ≈ 48px.
    const toUnits = (pixels: number) => (pixels / size.width) * viewport.width;
    const ringSize = toUnits(52);

    useFrame((state) => {
        if (materialRef.current) {
            const time = state.clock.elapsedTime;
            materialRef.current.uniforms.uTime.value = time;

            // NO OSCILLATION: Full static ring
            materialRef.current.uniforms.uProgress.value = 1.0;

            // Instability / Intensity
            const targetInstability = isActive ? 1.0 : 0.0;
            // Base intensity 0.8 / 1.5 (Active). Plus "Flash" on appear?
            // Since we mount fresh, we can just start scale at 0.
            const targetIntensity = isActive ? 1.5 : 0.8;

            materialRef.current.uniforms.uInstability.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uInstability.value,
                targetInstability,
                0.1
            );

            // INTENSITY LERP
            materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uIntensity.value,
                targetIntensity,
                0.1
            );
        }

        // VISIBILITY LOGIC:
        // If !revealed -> Target Scale is 0.0.
        // If revealed -> Target Scale is 1.0 (or 1.1 if Active).
        let targetScale = 0.0;
        if (revealed) {
            targetScale = isActive ? 1.1 : 1.0;
        }

        // LERP SPEED:
        // isFirst -> Slow smooth entry (0.02)
        // Others -> Fast Pop (0.15)
        const lerpSpeed = isFirst ? 0.02 : 0.15;

        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, lerpSpeed);
        if (meshRef.current) {
            meshRef.current.scale.setScalar(scaleRef.current);
            // HARD HIDE if !revealed to prevent any single-frame artifacts at scale 0?
            // Actually scale 0 is invisible. But let's be safe.
            meshRef.current.visible = revealed || scaleRef.current > 0.01;
        }
    });

    // Check for valid size to avoid NaN errors
    if (!size.width || !viewport.width) return null;

    return (
        <mesh ref={meshRef} position={position}>
            <planeGeometry args={[ringSize, ringSize]} />
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
                    uIntensity: { value: 0.8 },
                    uInstability: { value: 0 },
                    uType: { value: 0 }, // CENTER type
                    uColor: { value: new THREE.Color("#00A3FF") } // Cyan/Blue
                }}
            />
        </mesh>
    );
};

// --- REUSED FROM AUTOMATION NETWORK (ElectricCables.tsx) ---
const SHOCKWAVE_FRAGMENT = `
    uniform float uTime;
    uniform float uLife; // 0 (start) -> 1 (end)
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

const ReusedShockwave = ({ position, isFirst }: { position: [number, number, number], isFirst: boolean }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const { camera } = useThree();
    const [dead, setDead] = useState(false);

    // AutomationNetwork uses "waveLife" from -1 to 1.
    // Here we just fire 0 -> 1 on mount.
    const waveLife = useRef(0.0);

    useFrame((state, delta) => {
        if (dead || !materialRef.current) return;

        // BILLBOARD
        if (meshRef.current) {
            meshRef.current.quaternion.copy(camera.quaternion);
        }

        const time = state.clock.elapsedTime;
        materialRef.current.uniforms.uTime.value = time;

        // ANIMATION
        // Slower speed for elegance (was 3.0 in Automation)
        // User asked for "light" on appear? Or just "wait"
        // Let's use 1.5 speed.
        waveLife.current += delta * 1.5;

        if (waveLife.current >= 1.0) {
            setDead(true);
        }

        const uLife = waveLife.current;
        materialRef.current.uniforms.uLife.value = uLife;
    });

    if (dead) return null;

    // SKIP FIRST: User said "la première doit pas apparaitre comme ça"
    // "juste pour elle" -> lighter or nothing. Let's make it very subtle or invisible.
    if (isFirst) return null;

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
                    uColor: { value: new THREE.Color("#60a5fa") }
                }}
            />
        </mesh>
    );
};



// 3D HTML Marker Component
const SchemaMarker = ({ node, activeId, setActiveId, guideStep, setGuideStep, revealed = false }: {
    node: typeof SCHEMA_DEFS[0],
    activeId: number | null,
    setActiveId: (id: number | null) => void,
    guideStep: number,
    setGuideStep: React.Dispatch<React.SetStateAction<number>>,
    revealed?: boolean
}) => {
    const isRight = node.side === "right";
    const isFirst = node.id === 0;

    return (
        <Html position={[node.position[0], node.position[1], 0]} center className="pointer-events-auto">
            {/* Direct wrapper without offset */}
            {/* 
                ROBUST PRELOAD STATE:
                - Always in DOM (No 'invisible').
                - Base State: opacity-0 scale-50.
                - Revealed State: opacity-100 scale-100.
                - Transition: Handles the tween. 100% smooth, no pop.
            */}
            <div
                className={`flex flex-col items-center justify-center cursor-pointer group transition-all ease-out
                    ${revealed
                        ? (isFirst
                            ? 'opacity-100 scale-100 duration-[2000ms]' // Slow entry for first
                            : 'opacity-100 scale-100 duration-500')     // Fast for others
                        : 'opacity-0 scale-50 pointer-events-none'        // Preload State
                    }
                `}
                onMouseEnter={() => {
                    setActiveId(node.id);
                    // Advance guide if this is the target step
                    if (guideStep === node.id) {
                        setGuideStep(prev => prev + 1);
                    }
                }}
                onMouseLeave={() => setActiveId(null)}
            >
                {/* Circle container */}
                <div className={`
                    relative size-12 flex items-center justify-center rounded-full 
                    border-2 border-blue-500/50 bg-white/5 backdrop-blur-md
                    shadow-[0_0_15px_rgba(48,110,232,0.3)] 
                    transition-all duration-300
                    ${activeId === node.id ? 'scale-110 border-[#306EE8] shadow-[0_0_25px_rgba(48,110,232,0.6)]' : 'hover:scale-105 hover:border-blue-400'}
                    ${/* Guide Glow Animation - BLUE now */ guideStep === node.id ? 'animate-guide-glow-v2 border-[#306EE8] shadow-[0_0_30px_rgba(48,110,232,0.8)]' : ''}
                `}>
                    <Asterisk className={`w-6 h-6 text-white`} />
                </div>

                {/* TEXT LABEL - Absolute relative to the center marker to avoid layout shift */}
                <div className={`
                    absolute top-full mt-4 w-48 flex flex-col ${isRight ? 'items-start text-left left-0' : 'items-end text-right right-0'}
                    transition-all duration-300 transform
                    ${activeId === node.id ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
                    z-20
                 `}>
                    <h3 className="text-white font-clash font-bold text-lg tracking-wide drop-shadow-md whitespace-nowrap">
                        {node.title}
                    </h3>
                    <p className="text-gray-300 font-jakarta text-xs leading-relaxed mt-1">
                        {node.description}
                    </p>
                </div>
            </div>
        </Html>
    );
};
export function DNAHelix({ isActive = false }: { isActive?: boolean }) {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [guideStep, setGuideStep] = useState<number>(-1); // Start hidden (Wait for Scroll)
    const [isDnaRevealed, setIsDnaRevealed] = useState(false);
    const rotationRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // TRIGGER LOGIC: 
    // Wait for parent to say "isActive" (User scrolled to this card).
    // When active, we trigger the first step (0).
    useEffect(() => {
        if (isActive && guideStep === -1) {
            // Slight micro-delay to ensure CSS opacity transition has started? 
            // Not needed with the "Final Smooth Reveal" transition we built.
            // Just Fire.
            setGuideStep(0);
        }
    }, [isActive, guideStep]);

    // Reveal on first interaction (activeId === 0)
    useEffect(() => {
        if (activeId === 0 && !isDnaRevealed) {
            setIsDnaRevealed(true);
        }
    }, [activeId, isDnaRevealed]);

    return (
        <div ref={containerRef} className="w-full h-[400px] relative dna-container bg-black/0">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={1.0} />
                <spotLight position={[10, 10, 10]} intensity={2} color="white" />
                <pointLight position={[-10, 0, -5]} intensity={1} color="#306EE8" />
                {/* REMOVED: Center component. ProceduralDNA is mathematically centered at (0,0,0). Use pure coordinates. */}
                <ProceduralDNA
                    onHoverChange={setActiveId}
                    rotationRef={rotationRef}
                    isInteracting={activeId !== null}
                    opacity={isDnaRevealed ? 1.0 : 0.0}
                />

                {activeId !== null && (
                    <UnstableCable
                        start={new THREE.Vector3(...SCHEMA_DEFS[activeId].position)}
                        dnaRadius={1.2}
                        dnaHeight={10}
                        rotationRef={rotationRef}
                    />
                )}

                {/* Combined Rendering: WebGL Ring + HTML Marker at exact same 3D position */}
                {SCHEMA_DEFS.map((node) => {
                    // "REAL PRELOAD": Render EVERYTHING, but manage visibility via props.
                    // This ensures shaders and DOM are ready before the "Reveal" trigger.
                    const isRevealed = guideStep >= node.id && guideStep !== -1;

                    return (
                        <group key={node.id}>
                            {/* 1. WebGL Electric Ring (Mounted but Scale 0 if not revealed) */}
                            <ElectricRing
                                position={[node.position[0], node.position[1], 0]}
                                isActive={activeId === node.id}
                                isFirst={node.id === 0}
                                revealed={isRevealed}
                            />
                            {/* NEW: Reused Shockwave (Still One-Shot, so we only mount when revealed to fire effect) */}
                            {isRevealed && (
                                <ReusedShockwave position={[node.position[0], node.position[1], 0]} isFirst={node.id === 0} />
                            )}

                            {/* 2. HTML Marker (Mounted but Opacity 0 if not revealed) */}
                            <SchemaMarker
                                node={node}
                                activeId={activeId}
                                setActiveId={setActiveId}
                                guideStep={guideStep}
                                setGuideStep={setGuideStep}
                                revealed={isRevealed}
                            />
                        </group>
                    );
                })}

                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
