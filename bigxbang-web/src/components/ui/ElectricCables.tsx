"use client";

import React, { useRef, useMemo, useState } from "react";
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
type ConductorState = 'IGNITION' | 'ORGANIC';

interface CableParams {
    speed: number;
    offset: number;
    base: number;
}

interface Conductor {
    state: ConductorState;
    targets: number[];
    lastActionTime: number;
    params: CableParams[];
}

const Cable = ({
    startPos,
    endPos,
    index,
    activeIndex,
    conductor
}: {
    startPos: [number, number, number],
    endPos: [number, number, number],
    index: number,
    activeIndex: number | null,
    conductor: React.MutableRefObject<Conductor>
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // GEOMETRY (Curve)
    const curve = useMemo(() => {
        const start = new THREE.Vector3(...startPos);
        const end = new THREE.Vector3(...endPos);
        const rangeX = end.x - start.x;
        const cp1 = new THREE.Vector3(start.x + rangeX * 0.3, start.y, 0);
        const funnelX = start.x + rangeX * 0.7;
        const funnelY = end.y + (start.y - end.y) * 0.1;
        const cp2 = new THREE.Vector3(funnelX, funnelY, 0);
        return new THREE.CatmullRomCurve3([start, cp1, cp2, end]);
    }, [startPos, endPos]);

    useFrame((state) => {
        if (!materialRef.current) return;
        const time = state.clock.elapsedTime;
        materialRef.current.uniforms.uTime.value = time;

        const isHovered = activeIndex === index;
        const isSourceHovered = activeIndex !== null;

        // READ TARGET FROM CONDUCTOR
        let target = conductor.current.targets[index] || 0;

        // Hover overrides everything
        if (isHovered) {
            target = 2.0; // Boost
        } else if (isSourceHovered) {
            // If another is hovered, dim this one
            target *= 0.3;
        }

        // SMOOTH LERP
        const current = materialRef.current.uniforms.uIntensity.value;
        // Snappy lerp (0.5) for glitch reaction (nearly instant)
        materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(current, target, 0.5);
    });

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
const ElectricCablesContent = ({ inputs, output, finalOutput, activeIndex }: {
    inputs: { x: number, y: number }[],
    output: { x: number, y: number },
    finalOutput?: { x: number, y: number },
    activeIndex: number | null
}) => {
    const { viewport, size } = useThree();

    // ORCHESTRATOR STATE
    const conductor = useRef<Conductor>({
        state: 'IGNITION',
        targets: inputs.map(() => 0),
        lastActionTime: 0,
        params: inputs.map(() => ({
            speed: 1.0 + Math.random() * 2.0, // Faster chaotic speed
            offset: Math.random() * 100,
            base: 0.2 + Math.random() * 0.1   // Very gentle (0.2 - 0.3)
        }))
    });

    // CONDUCTOR LOGIC LOOP
    useFrame((state) => {
        const now = state.clock.elapsedTime;
        const C = conductor.current;

        // Safety resize
        if (C.targets.length !== inputs.length) {
            C.targets = inputs.map(() => 0);
            C.params = inputs.map(() => ({ speed: 1.5 + Math.random() * 2, offset: Math.random() * 100, base: 0.25 }));
        }

        if (C.state === 'IGNITION') {
            // Ignition: Light up one by one randomly
            if (now - C.lastActionTime > 0.1) {
                const unlit = C.targets.map((t, i) => t < 0.1 ? i : -1).filter(i => i !== -1);

                if (unlit.length > 0) {
                    const pick = unlit[Math.floor(Math.random() * unlit.length)];
                    C.targets[pick] = 1.0;
                    C.lastActionTime = now;
                } else {
                    // All lit -> Switch to Organic
                    C.state = 'ORGANIC';
                }
            }
        }
        else if (C.state === 'ORGANIC') {
            // Chaotic Interference (Math-based Glitch - AGGRESSIVE)
            C.targets.forEach((t, i) => {
                const p = C.params[i];

                // Construct a chaotic signal using interference of 3 sine waves
                const time = now * p.speed + p.offset;
                const s1 = Math.sin(time);
                const s2 = Math.sin(time * 3.14); // Irrational
                const s3 = Math.sin(time * 7.1);  // High freq

                const signal = s1 + s2 + s3; // Range approx [-3, 3]

                // High Threshold Logic:
                // LOWERED THRESHOLD: > 0.5 means it's visible more often (approx 40% ON time)
                if (signal > 0.5) {
                    // ON: Breathe intensity based on signal strength
                    C.targets[i] = p.base + (signal - 0.5) * 0.15;
                } else {
                    // OFF: Glitch out
                    C.targets[i] = 0.0;
                }
            });
        }
    });

    // Safety: Render nothing if dimensions are not yet available to avoid divide-by-zero/NaN
    if (size.width === 0 || size.height === 0) return null;

    // Map screen pixel (top-left) to Three.js world unit (center)
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
    return (
        <>
            <ambientLight intensity={0.5} />

            {inputs.map((pos, i) => (
                <Cable
                    key={i}
                    index={i}
                    startPos={toWorld(pos) as [number, number, number]}
                    endPos={toWorld(output) as [number, number, number]}
                    activeIndex={activeIndex}
                    conductor={conductor}
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
                />
            )}
        </>
    );
};

export const ElectricCables = ({ activeIndex, inputs, output, finalOutput }: { activeIndex: number | null, inputs: { x: number, y: number }[], output: { x: number, y: number }, finalOutput?: { x: number, y: number } }) => {
    return (
        <Canvas className="absolute inset-0 z-0 pointer-events-none" camera={{ position: [0, 0, 10], fov: 45 }}>
            <ElectricCablesContent inputs={inputs} output={output} activeIndex={activeIndex} finalOutput={finalOutput} />
        </Canvas>
    );
};
