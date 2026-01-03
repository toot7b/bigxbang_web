"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// --- SHADERS (Copied from ElectricCables.tsx / DNAHelix.tsx) ---

const NODE_VERTEX = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

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

        // Limit radius to 0.45 (90% of plane) to prevent square clipping at edges
        float radius = uLife * 0.45; 
        float ringWidth = 0.05 * (1.0 - uLife); 
        float ring = 1.0 - smoothstep(0.0, ringWidth, abs(dist - radius));
        
        float distort = noise(vec2(angle * 4.0, uTime * 3.0)) * 0.1 * (1.0 - uLife);
        ring *= 1.0 + distort;
        
        ring *= smoothstep(0.05, 0.08, dist);
        
        float opacity = (1.0 - uLife); 
        opacity = pow(opacity, 2.0); // Faster fade out
        
        vec3 color = vec3(1.0); 
        color = mix(color, uColor, 0.5);

        gl_FragColor = vec4(color, ring * opacity * 2.0); 
    }
`;

const ShockwaveMesh = ({ active }: { active: boolean }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const waveLife = useRef(-1);
    // Track if we have already triggered for the current activation to prevent infinite looping if active stays true
    // Logic: If active changes to TRUE, we fire ONCE.
    const wasActive = useRef(false);

    useFrame((state, delta) => {
        if (!materialRef.current) return;
        const time = state.clock.elapsedTime;
        materialRef.current.uniforms.uTime.value = time;

        // Trigger Logic: Edge detection (Rising Edge)
        if (active && !wasActive.current) {
            // Fire!
            waveLife.current = 0.0;
        }
        wasActive.current = active;

        // Animate
        if (waveLife.current >= 0) {
            waveLife.current += delta * 1.5; // Speed similar to DNA (1.5)
            if (waveLife.current >= 1.0) {
                waveLife.current = -1; // Reset to dead
            }
        }

        const uLife = waveLife.current < 0 ? 1.0 : waveLife.current; // 1.0 makes ring huge/invisible in shader logic usually? 
        // Shader: radius = uLife * 0.5. If uLife=1.0, radius=0.5 (edge). Opacity = 0.
        // So uLife=1.0 is safe "hidden" state.

        materialRef.current.uniforms.uLife.value = uLife;
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[10, 10]} /> {/* Size large enough to cover the tools center */}
            <shaderMaterial
                ref={materialRef}
                vertexShader={NODE_VERTEX}
                fragmentShader={SHOCKWAVE_FRAGMENT}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={{
                    uTime: { value: 0 },
                    uLife: { value: 1.0 }, // Start hidden
                    uColor: { value: new THREE.Color("#306EE8") }
                }}
            />
        </mesh>
    );
};

export default function ToolsOrbitShockwave({ active }: { active: boolean }) {
    return (
        <div className="w-full h-full" style={{ pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ alpha: true }} transparent>
                <ShockwaveMesh active={active} />
            </Canvas>
        </div>
    );
}
