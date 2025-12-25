
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- SHADERS (Ported from ElectricCables.tsx & DNAHelix.tsx) ---
const SCANNER_VERTEX = `
    varying vec2 vUv;
    varying vec3 vPos;
    uniform float uTime;
    uniform float uInstability; 

    void main() {
        vUv = uv;
        vPos = position;
        vec3 pos = position;
        
        if (uInstability > 0.0) {
            float shake = sin(uv.x * 20.0 + uTime * 30.0) * 0.05 * uInstability;
            float jitter = sin(uv.x * 100.0 + uTime * 100.0) * 0.02 * uInstability;
            pos.y += shake + jitter;
            pos.z += shake; 
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const SCANNER_FRAGMENT = `
    #define ARC_WIDTH 0.15 
    #define GLOW_FALLOFF 4.0
    #define BOLT_SPEED 4.0

    uniform float uTime;
    uniform float uIntensity; 
    uniform float uInstability; 
    uniform vec3 uColor;
    uniform float uLength;
    uniform float uFadeEdges; // 1.0 = Fade, 0.0 = No Fade
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
        f += 0.1250 * noise(p); 
        return f;
    }

    void main() {
        float t = uTime * BOLT_SPEED;
        
        float speed = 1.2;
        if (uInstability > 0.5) speed = 20.0; 
        
        float tNoise = t * speed;
        // Blast Mode: very thick
        float amp = 0.8 + (uInstability * 2.0);
        float jaggedness = 15.0; 
        if (uIntensity > 0.5) jaggedness = 30.0; 

        // Scale X noise by length to keep density consistent
        float density = uLength > 0.0 ? uLength : 10.0;
        float distortion = fbm(vec2(vUv.x * jaggedness * (density / 10.0) - tNoise, tNoise * 0.5)); 
        float path = (distortion - 0.5) * amp; 

        if (uInstability > 0.0) {
            // Consistent sine wave frequency
            path += sin(vUv.x * (density * 2.0) + uTime * 50.0) * 0.1 * uInstability;
        } 
        
        float dist = abs(vUv.y - 0.5 - path);
        float bolt = ARC_WIDTH / max(dist, 0.01);
        float glow = exp(-abs(vUv.y - 0.5) * GLOW_FALLOFF);
        
        float interaction = (bolt + glow) * uIntensity;
        vec3 finalColor = mix(uColor, vec3(1.0), clamp(interaction * 0.4, 0.0, 0.3));
        
        float alpha = interaction;
        
        // Conditional Fade
        if (uFadeEdges > 0.5) {
             float fade = smoothstep(0.0, 0.05, vUv.x) * (1.0 - smoothstep(0.95, 1.0, vUv.x));
             alpha *= fade;
        }
        
        gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
    }
`;

export const ElectricLine = ({
    start,
    end,
    mode = 'stable',
    trigger = false,
    color = "#00A3FF",
    tension = 0,
    cornerPoint,
    fadeEdges = true // Default to true to keep existing behavior for blasts
}: {
    start: [number, number, number],
    end: [number, number, number],
    mode?: 'stable' | 'blast',
    trigger?: boolean,
    color?: string,
    tension?: number,
    cornerPoint?: [number, number, number],
    fadeEdges?: boolean
}) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const blastLife = useRef(0.0);
    const lastTrigger = useRef(trigger);

    const dist = new THREE.Vector3(...start).distanceTo(new THREE.Vector3(...end));
    const isValid = dist > 0.1;

    const curve = useMemo(() => {
        if (!isValid) return null;
        const s = new THREE.Vector3(...start);
        const e = new THREE.Vector3(...end);

        // Bezier curve for rounded corners
        if (cornerPoint) {
            const c = new THREE.Vector3(...cornerPoint);
            return new THREE.QuadraticBezierCurve3(s, c, e);
        }

        if (mode === 'blast') {
            return new THREE.LineCurve3(s, e);
        }
        // Stable mode: Slight curve for organic feel
        const mid = s.clone().lerp(e, 0.5);
        return new THREE.CatmullRomCurve3([s, mid, e]);
    }, [start, end, isValid, mode, cornerPoint]);

    useFrame((state, delta) => {
        if (!materialRef.current) return;

        const time = state.clock.elapsedTime;
        materialRef.current.uniforms.uTime.value = time;
        materialRef.current.uniforms.uColor.value.set(color);
        materialRef.current.uniforms.uFadeEdges.value = fadeEdges ? 1.0 : 0.0;

        // Update Length Uniform from Geometry
        if (meshRef.current?.geometry) {
            const geo = meshRef.current.geometry as THREE.TubeGeometry;
            // Ensure parameters and path exist (safety check)
            if (geo.parameters?.path && materialRef.current.uniforms.uLength) {
                materialRef.current.uniforms.uLength.value = geo.parameters.path.getLength();
            }
        }

        let targetInstability = 0.0;
        let targetIntensity = 0.0;

        if (mode === 'blast') {
            if (trigger && !lastTrigger.current) {
                blastLife.current = 1.0;
            }
            lastTrigger.current = trigger;

            if (blastLife.current > 0.0) {
                blastLife.current -= delta * 2.0;
                if (blastLife.current < 0.0) blastLife.current = 0.0;
            }

            const life = blastLife.current;
            targetIntensity = Math.pow(life, 2.0) * 4.0;
            targetInstability = life > 0.1 ? 1.0 : 0.0;

        } else {
            // Stable Mode with optional Tension
            targetInstability = 0.3 + (tension * 2.0);
            targetIntensity = 0.5 + (tension * 2.0);
        }

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
                    uInstability: { value: 0 },
                    uColor: { value: new THREE.Color(color) },
                    uLength: { value: 1.0 },
                    uFadeEdges: { value: 1.0 }
                }}
            />
        </mesh>
    );
};
