import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --- VISUAL CONSTANTS ---
// Visual size of the Central Node in Automation (size-20 = 80px)
const RING_PIXEL_SIZE = 80;

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
    uniform float uInstability; 
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
        float shakeSpeed = mix(5.0, 30.0, uInstability);
        float shakeAmp = mix(0.02, 0.15, uInstability); 
        
        float wobble = sin(angle * 3.0 + uTime * shakeSpeed) * shakeAmp;
        float grit = noise(vec2(angle * 10.0, uTime * 10.0)) * 0.05 * uInstability;

        float ringRadius = 0.46 + wobble + grit;
        float ringDist = abs(dist - ringRadius);
        
        float thickness = 0.005 + (uInstability * 0.02); 
        float ring = thickness / max(ringDist, 0.01); 
        
        float alpha = 0.0;
        vec3 finalColor = uColor;

        // --- CENTER: CHARGING ARCS ---
        float p = 1.0 - (abs(angle) / PI); 
        
        // Always show faint ring foundation
        alpha = ring * 0.2; // Dim foundation

        if (p < uProgress) {
            alpha += ring; // Add bright ring segments
            
            // Sparks trail
            float sparks = fbm(vUv * 10.0 - vec2(uTime * 2.0, 0.0));
            alpha += sparks * 0.2 * step(0.4, dist) * step(dist, 0.5);
        }

        // Global Mask
        alpha *= smoothstep(0.5, 0.48, dist); 
        
        // Final Intensity Scale
        alpha *= uIntensity;

        gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
    }
`;

export const AutomationEnergyRing = ({
    isActive = false,
    revealed = true,
    scaleOverride = 1.0,
}: {
    isActive?: boolean,
    revealed?: boolean,
    scaleOverride?: number,
}) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const scaleRef = useRef(0.0);
    const { viewport, size } = useThree();

    // 1. Calculate Size
    const hasDimensions = size.width > 0 && viewport.width > 0;
    const toUnits = (pixels: number) => hasDimensions ? (pixels / size.width) * viewport.width : 1;
    // We want the ring to be slightly larger than the 80px container to surround it
    // 80px is container. Ring should be maybe 90px visual?
    const ringSize = toUnits(90);

    useFrame((state) => {
        if (materialRef.current) {
            const time = state.clock.elapsedTime;
            materialRef.current.uniforms.uTime.value = time;

            // ANIMATION LOOP: STABLE RING (No Charging Cycle)
            materialRef.current.uniforms.uProgress.value = 1.0;

            // Instability / Intensity
            const targetInstability = isActive ? 1.0 : 0.0;
            const targetIntensity = isActive ? 1.8 : 1.0;

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
            targetScale = (isActive ? 1.1 : 1.0) * scaleOverride;
        }

        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.1);

        if (meshRef.current) {
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
        <mesh ref={meshRef}>
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
                    uIntensity: { value: 1.0 },
                    uInstability: { value: 0 },
                    uColor: { value: new THREE.Color("#306EE8") }
                }}
            />
        </mesh>
    );
};
