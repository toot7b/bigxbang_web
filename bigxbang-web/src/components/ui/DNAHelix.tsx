"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment } from "@react-three/drei";
import * as THREE from "three";

// --- CONFIGURATION ---
const STRUCTURE_COLOR = "#0055FF";
const BLUE_ELECTRIC = "#00A3FF";
const BLUE_DEEP = "#0044AA";

// --- EXACT COPY FROM ElectricCables.tsx (Lines 18-141) ---
// Note: We use the ORIGINAL Tube-compatible shader because we are now generating TUBES.
// No extra axes hacks needed.

const SCANNER_VERTEX = `
    varying vec2 vUv;
    varying vec3 vPos;
    uniform float uTime;
    uniform float uInstability; // Need this here for vertex displacement

    void main() {
        vUv = uv;
        vPos = position;
        
        vec3 pos = position;
        
        // VERTEX DISPLACEMENT (Physical Wobble)
        if (uInstability > 0.0) {
            // Large snake-like movement
            float shake = sin(uv.x * 20.0 + uTime * 30.0) * 0.05 * uInstability;
            // High freq jitter
            float jitter = sin(uv.x * 100.0 + uTime * 100.0) * 0.02 * uInstability;
            
            // Displace along Normal (expanding/contracting) or just Y/Z?
            // Since it's a tube, simple Y/Z offset works best to look like "whipping"
            pos.y += shake + jitter;
            pos.z += shake; 
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
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
    uniform float uInstability; // 0.0 -> 1.0 (Chaotic Shake)
    
    // MODIFIED: Dual Color Support
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    
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

        // Apply Instability:
        // FIX: High frequency (80.0) looked like bad texture.
        // We want VIBRATION (Low freq, high speed).
        // Keep jaggedness low (10-20), but make it move crazy fast.
        
        // Speed: 
        float speed = 1.2;
        if (uInstability > 0.5) speed = 20.0; // Violent shaking speed
        
        float tNoise = t * speed;

        // Amplitude:
        // Normal: 0.8 width. Unstable: 2.5 width (filling the tube)
        float amp = 0.8 + (uInstability * 2.0);
        
        float distortion = fbm(vec2(vUv.x * jaggedness - tNoise, tNoise * 0.5)); 
        float path = (distortion - 0.5) * amp; 
        
        // Add a second layer of "Large Wave" (Sine) for physical wobble if unstable
        if (uInstability > 0.0) {
            path += sin(vUv.x * 10.0 + uTime * 50.0) * 0.1 * uInstability;
        } 
        
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
        
        // Color: Mix Two Colors based on Length (Split Effect)
        vec3 baseColor = mix(uColorStart, uColorEnd, smoothstep(0.40, 0.60, vUv.x));
        
        // CAP WHITE to 30% max as requested.
        vec3 finalColor = mix(baseColor, vec3(1.0), clamp(interaction * 0.4, 0.0, 0.3));
        
        // Alpha (Visual intensity)
        float alpha = interaction;
        
        // Fade Ends (Soft start/end)
        float fade = smoothstep(0.0, 0.05, vUv.x) * (1.0 - smoothstep(0.95, 1.0, vUv.x));
        alpha *= fade;
        
        // Clamp alpha to avoid glitch
        gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
    }
`;

// --- PROCEDURAL GENERATION ---

// Reduced dimensions to fit in view
const HEIGHT = 10;
const RADIUS = 1.2;
const TURNS = 2.0;
const RUNG_COUNT = 16;
const POINTS_PER_TURN = 40;

const ProceduralDNA = () => {
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // 1. Generate Geometry Paths
    const { strandA, strandB, rungs } = useMemo(() => {
        const strandPointsA: THREE.Vector3[] = [];
        const strandPointsB: THREE.Vector3[] = [];
        const rungLines: { start: THREE.Vector3, end: THREE.Vector3 }[] = [];

        const totalPoints = TURNS * POINTS_PER_TURN;
        const yStep = HEIGHT / totalPoints;

        // Generate Strands
        for (let i = 0; i <= totalPoints; i++) {
            const t = (i / totalPoints) * Math.PI * 2 * TURNS;
            const y = i * yStep - (HEIGHT / 2); // Center Y around 0

            const x = Math.cos(t) * RADIUS;
            const z = Math.sin(t) * RADIUS;

            strandPointsA.push(new THREE.Vector3(x, y, z));
            strandPointsB.push(new THREE.Vector3(-x, y, -z)); // 180 deg offset
        }

        // Generate Rungs
        const rungStep = totalPoints / RUNG_COUNT;
        for (let i = 0; i < RUNG_COUNT; i++) {
            const index = Math.floor(i * rungStep);
            if (index < strandPointsA.length) {
                rungLines.push({
                    start: strandPointsA[index],
                    end: strandPointsB[index]
                });
            }
        }

        const curveA = new THREE.CatmullRomCurve3(strandPointsA);
        const curveB = new THREE.CatmullRomCurve3(strandPointsB);

        return { strandA: curveA, strandB: curveB, rungs: rungLines };
    }, []);


    // 2. Animation Loop
    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
        }

        // Update Shader Time for ALL rungs (they share the material ref if we use instances, 
        // or we need to update per material if separate. Here we'll use one shared material for performance)
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    // Shared Materials
    const strandMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: STRUCTURE_COLOR,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide
    }), []);

    // 3. Render
    return (
        <group ref={groupRef}>
            {/* STRAND A - BLUE */}
            <mesh
                geometry={new THREE.TubeGeometry(strandA, 128, 0.15, 8, false)}
                material={strandMaterial}
            />

            {/* STRAND B - BLUE */}
            <mesh
                geometry={new THREE.TubeGeometry(strandB, 128, 0.15, 8, false)}
                material={strandMaterial}
            />

            {/* RUNGS (CABLES) */}
            {rungs.map((rung, i) => {
                // Alternating Pattern: Start vs End
                // Rung 0: Electric -> Deep
                // Rung 1: Deep -> Electric
                const isEven = i % 2 === 0;
                return (
                    <ElectricRung
                        key={i}
                        start={rung.start}
                        end={rung.end}
                        colorStart={isEven ? BLUE_ELECTRIC : BLUE_DEEP}
                        colorEnd={isEven ? BLUE_DEEP : BLUE_ELECTRIC}
                    />
                );
            })}
        </group>
    );
};

// Helper Component for Rungs to allow instancing logic if needed, 
// though for <30 items separate meshes is fine.
const ElectricRung = ({ start, end, colorStart, colorEnd }: { start: THREE.Vector3, end: THREE.Vector3, colorStart: string, colorEnd: string }) => {
    // Each rung needs its own curve geometry
    const curve = useMemo(() => new THREE.CatmullRomCurve3([start, end]), [start, end]);

    // We use a clone of the material to avoid shared uniform state if we wanted to offset time,
    // but here we want them synced. However, React Three Fiber handles material disposal better with unique instances per mesh
    // or by updating an external ref. To keep it simple and ROBUST EXACTLY LIKE ElectricCables:

    const matRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    });

    return (
        <mesh>
            {/* Radius 0.02 (THINNER as requested) */}
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


export function DNAHelix() {
    return (
        <div className="w-full h-[400px] relative">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={1.0} />
                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} color="white" />
                <pointLight position={[-10, 0, -5]} intensity={1} color="#0055FF" />
                <spotLight position={[0, -10, 5]} angle={0.5} intensity={1} color="#cyan" />

                <Center>
                    <ProceduralDNA />
                </Center>

                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
