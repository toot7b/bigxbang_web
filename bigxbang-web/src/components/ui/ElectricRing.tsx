import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --- VISUAL CONSTANTS ---
// Matches the visual size in DNAHelix
const RING_PIXEL_SIZE = 52;

const NODE_VERTEX = `
    varying vec2 vUv;
    varying vec3 vPos;
    uniform float uTime;
    void main() {
        vUv = uv;
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const NODE_FRAGMENT = `
    uniform float uTime;
    uniform float uProgress;
    uniform float uIntensity;
    uniform float uInstability; 
    uniform int uType;
    uniform vec3 uColor;
    varying vec2 vUv;

    // NOISE
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0;
        return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                   mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
    }

    #define PI 3.14159265359

    void main() {
        vec2 centeredUv = vUv - 0.5;
        float dist = length(centeredUv);
        float angle = atan(centeredUv.y, centeredUv.x);

        // RING SHAPE
        // To Match visual:
        // Use unstable noise to distort ring radius
        float shakeAmp = 0.0 + (uInstability * 0.05);
        float shakeSpeed = 5.0 + (uInstability * 20.0);
        
        float wobble = sin(angle * 3.0 + uTime * shakeSpeed) * shakeAmp;

        float ringRadius = 0.46 + wobble;
        // Sharper ring definition
        float ringDist = abs(dist - ringRadius);
        
        float thickness = 0.005 + (uInstability * 0.02); 
        float ring = thickness / max(ringDist, 0.01); 
        
        float alpha = 0.0;
        vec3 finalColor = uColor;

        // --- CHARGING ARCS Logic ---
        // Progress defines how much of the ring is lit (1.0 = full ring)
        float p = 1.0 - (abs(angle) / PI); 
        
        // Base Ring
        alpha = ring;

        // Global Mask - smooth edges
        alpha *= smoothstep(0.5, 0.48, dist); 
        
        // Intensity scaling
        alpha *= uIntensity;

        gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
    }
`;

export const ElectricRing = ({
    position = [0, 0, 0],
    isActive = false,
    isFirst = false,
    revealed = true,
    scaleOverride = undefined // Optional override for specific cases
}: {
    position?: [number, number, number],
    isActive?: boolean,
    isFirst?: boolean,
    revealed?: boolean,
    scaleOverride?: number
}) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const scaleRef = useRef(0.0);
    const { viewport, size } = useThree();

    // Calculate dynamic size in 3D units to match Pixel visuals
    // This logic ensures it's the SAME "Pixel Size" regardless of camera distance if using Orthographic,
    // but for Perspective it depends on depth.
    // DNAHelix uses Perspective.
    // NOTE: In DNAHelix this logic assumes a specific camera setup.
    // We safeguard against missing dimensions.
    const hasDimensions = size.width > 0 && viewport.width > 0;
    const toUnits = (pixels: number) => hasDimensions ? (pixels / size.width) * viewport.width : 1;
    const ringSize = toUnits(RING_PIXEL_SIZE);

    useFrame((state) => {
        if (materialRef.current) {
            const time = state.clock.elapsedTime;
            materialRef.current.uniforms.uTime.value = time;

            // NO OSCILLATION: Full static ring for standard assets
            materialRef.current.uniforms.uProgress.value = 1.0;

            // Instability / Intensity
            const targetInstability = isActive ? 1.0 : 0.0;
            const targetIntensity = isActive ? 1.5 : 0.8;

            materialRef.current.uniforms.uInstability.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uInstability.value,
                targetInstability,
                0.1
            );

            materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uIntensity.value,
                targetIntensity,
                0.1
            );
        }

        // VISIBILITY / SCALE LOGIC
        let targetScale = 0.0;
        if (revealed) {
            targetScale = isActive ? 1.1 : 1.0;
        }

        // Allow manual override
        if (scaleOverride !== undefined) {
            targetScale = scaleOverride;
        }

        const lerpSpeed = isFirst ? 0.02 : 0.15;
        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, lerpSpeed);

        if (meshRef.current) {
            // If dimensions aren't ready, don't show yet or it might flash big
            if (!hasDimensions) {
                meshRef.current.visible = false;
                return;
            }

            meshRef.current.scale.setScalar(scaleRef.current);
            meshRef.current.visible = revealed || scaleRef.current > 0.01;
        }
    });

    if (!hasDimensions) return null;

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
                    uProgress: { value: 1.0 },
                    uIntensity: { value: 0.8 },
                    uInstability: { value: 0 },
                    uType: { value: 0 },
                    uColor: { value: new THREE.Color("#00A3FF") }
                }}
            />
        </mesh>
    );
};
