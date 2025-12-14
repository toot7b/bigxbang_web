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
    #define GLOW_FALLOFF 3.0
    #define BOLT_SPEED 2.0

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
        float jaggedness = 5.0; 
        if (uIntensity > 0.5) jaggedness = 10.0; 

        // Distortion using FBM
        // We scroll noise along X
        float distortion = fbm(vec2(vUv.x * jaggedness - t * 1.5, t)); 
        
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
        
        // Color: Mix User Color with White Core based on brightness
        vec3 finalColor = mix(uColor, vec3(1.0), clamp(interaction * 0.3, 0.0, 1.0));
        
        // Alpha
        float alpha = interaction;
        
        // Fade Ends (Soft start/end)
        float fade = smoothstep(0.0, 0.05, vUv.x) * (1.0 - smoothstep(0.95, 1.0, vUv.x));
        alpha *= fade;
        
        // Clamp alpha to avoid glitch
        gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
    }
`;

const Cable = ({ startPos, endPos, index, activeIndex }: { startPos: [number, number, number], endPos: [number, number, number], index: number, activeIndex: number | null }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // GEOMETRY (Curve)
    const curve = useMemo(() => {
        const start = new THREE.Vector3(...startPos);
        const end = new THREE.Vector3(...endPos);
        // "Funnel" Logic
        const rangeX = end.x - start.x;
        const cp1 = new THREE.Vector3(start.x + rangeX * 0.3, start.y, 0);
        const funnelX = start.x + rangeX * 0.7;
        const funnelY = end.y + (start.y - end.y) * 0.1;
        const cp2 = new THREE.Vector3(funnelX, funnelY, 0);
        return new THREE.CatmullRomCurve3([start, cp1, cp2, end]);
    }, [startPos, endPos]);

    // ANIMATION LOOP
    const [simActive, setSimActive] = useState(false);
    const lastPulse = useRef(0);
    const pulseDelay = useRef(Math.random() * 5 + 3);

    useFrame((state) => {
        if (!materialRef.current) return;
        const time = state.clock.elapsedTime;
        materialRef.current.uniforms.uTime.value = time;

        const isHovered = activeIndex === index;
        const isSourceHovered = activeIndex !== null;
        let targetIntensity = 0.0; // Invisible by default

        if (isHovered) {
            targetIntensity = 2.0; // High Power
        } else if (!isSourceHovered) {
            // Idle flicker
            if (time - lastPulse.current > pulseDelay.current) {
                lastPulse.current = time;
                pulseDelay.current = Math.random() * 2 + 2;
                setSimActive(true);
                setTimeout(() => setSimActive(false), 300);
            }
            if (simActive) targetIntensity = 0.8;
            else targetIntensity = 0.2; // Low hum
        }

        materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
            materialRef.current.uniforms.uIntensity.value,
            targetIntensity,
            0.1
        );
    });

    return (
        <mesh ref={meshRef}>
            {/* TUBE GEOMETRY */}
            {/* Radius 0.04 (Thicker canvas for shader to paint on) */}
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
                    uColor: { value: new THREE.Color("#0099FF") }
                }}
            />
        </mesh>
    );
};

// --- SCENE CONTENT (Access to Viewport) ---
const ElectricCablesContent = ({ inputs, output, activeIndex }: {
    inputs: { x: number, y: number }[],
    output: { x: number, y: number },
    activeIndex: number | null
}) => {
    const { viewport, size } = useThree();

    // Safety: Render nothing if dimensions are not yet available to avoid divide-by-zero/NaN
    if (size.width === 0 || size.height === 0) return null;

    // Map screen pixel (top-left) to Three.js world unit (center)
    const mapPos = (pos: { x: number, y: number }) => {
        // X: 0 -> -W/2, W -> +W/2
        const x = (pos.x / size.width) * viewport.width - (viewport.width / 2);
        // Y: 0 -> +H/2, H -> -H/2 (Inverted coords for DOM->3D)
        const y = -((pos.y / size.height) * viewport.height - (viewport.height / 2));
        return [x, y, 0] as [number, number, number];
    };

    const inputPoints = useMemo(() => inputs.map(mapPos), [inputs, viewport, size]);
    const outputPoint = useMemo(() => mapPos(output), [output, viewport, size]);

    return (
        <>
            <ambientLight intensity={0.5} />

            {inputPoints.map((start, i) => (
                <Cable
                    key={i}
                    index={i}
                    startPos={start}
                    endPos={outputPoint}
                    activeIndex={activeIndex}
                />
            ))}
        </>
    );
};

export const ElectricCables = ({ activeIndex, inputs, output }: { activeIndex: number | null, inputs: { x: number, y: number }[], output: { x: number, y: number } }) => {
    return (
        <Canvas className="absolute inset-0 z-0 pointer-events-none" camera={{ position: [0, 0, 10], fov: 45 }}>
            <ElectricCablesContent inputs={inputs} output={output} activeIndex={activeIndex} />
        </Canvas>
    );
};
