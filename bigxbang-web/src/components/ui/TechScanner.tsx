"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export enum ScannerState {
    IDLE = 'IDLE',
    SCANNING = 'SCANNING',
    COMPLETE = 'COMPLETE',
    GLITCH = 'GLITCH'
}

interface TechScannerProps {
    color: string;
    className?: string;
    state?: ScannerState;
}

// --- MACROS ---
// Improves readability and tweakability
const SHADER_CONSTANTS = `
    #define ARC_WIDTH 0.004
    #define GLOW_FALLOFF 8.0
    #define BOLT_1_SPEED 2.0
    #define BOLT_2_SPEED 3.0
`;

// --- SHADERS ---

const BEAM_VERTEX = `
    varying vec2 vUv;
    varying vec3 vPos;
    uniform float uTime;
    
    // Simple noise for vertex displacement
    float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
        vUv = uv;
        vPos = position;
        
        vec3 pos = position;
        
        // DISTORTION FIELD (The "Space Warping")
        // Only distort near the center Y (where the beam is)
        // Since it's a plane filling the container, Y coords are roughly -H/2 to H/2.
        
        float distStrength = 5.0; // Amplitude
        float wave = sin(uv.x * 10.0 - uTime * 5.0);
        
        // Mask: Only near center vertical
        float centerMask = 1.0 - smoothstep(0.0, 0.5, abs(uv.y - 0.5));
        
        pos.z += wave * centerMask * distStrength;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const BEAM_FRAGMENT = `
    ${SHADER_CONSTANTS}

    uniform float uTime;
    uniform float uIntensity; // State-driven intensity
    uniform float uScanComplete; // 0.0 -> 1.0 burst trigger
    uniform vec3 uColor;
    varying vec2 vUv;

    // --- NOISE FUNCTIONS ---
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0;
        return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                   mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
    }
    
    // FBM (Fractal Brownian Motion) for jagged lightning shape
    float fbm(vec2 p) {
        float f = 0.0;
        f += 0.5000 * noise(p); p *= 2.02;
        f += 0.2500 * noise(p); p *= 2.03;
        f += 0.1250 * noise(p); p *= 2.01;
        f += 0.0625 * noise(p);
        return f;
    }

    float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }

    void main() {
        // --- 1. LIGHTNING ARCS ---
        // Bolt 1 (Main Arc - Crawling)
        float t = uTime * BOLT_1_SPEED;
        
        // More aggressive jitter if high intensity (GLITCH state or BURST)
        float jaggedness = 8.0; 
        if (uIntensity < 0.5) jaggedness = 20.0; // Glitch fragmenting

        // Distortion based on Noise
        float distortion1 = fbm(vec2(vUv.x * jaggedness + t, t * 0.5)); 
        float path1 = (distortion1 - 0.5) * 0.2; // Wiggle amplitude
        
        float dist1 = abs(vUv.y - 0.5 - path1);
        // Electric glow function 1/x for "sticking" feel
        float bolt1 = ARC_WIDTH / max(dist1, 0.001);
        
        // Bolt 2 (Fast flicker arc)
        float distortion2 = fbm(vec2(vUv.x * 12.0 - t * 2.0, t));
        float path2 = (distortion2 - 0.5) * 0.1;
        float dist2 = abs(vUv.y - 0.5 - path2);
        float bolt2 = (ARC_WIDTH * 0.5) / max(dist2, 0.001);
        
        // Intermittent bolt 2
        bolt2 *= smoothstep(0.4, 0.6, noise(vec2(t * 8.0, 0.0)));

        // --- 2. AMBIENT GLOW ---
        float glow = exp(-abs(vUv.y - 0.5) * GLOW_FALLOFF) * 0.3; // Tighter glow near center

        // --- 3. DATA RAIN ---
        float rainX = floor(vUv.x * 100.0);
        float rainY = fract(vUv.y * 3.0 + uTime * (random(vec2(rainX)) * 5.0 + 5.0));
        float rain = step(0.95, random(vec2(rainX, 0.0))) * (1.0 - rainY) * 0.15;
        rain *= smoothstep(0.1, 0.4, abs(vUv.y - 0.5));

        // --- COMPOSITE ---
        vec3 col = uColor;
        
        // Combine bolts (Scaled by state intensity)
        float intensity = (bolt1 + bolt2) * uIntensity;
        
        // White core for high intensity arcs
        vec3 finalCol = mix(uColor, vec3(1.0), clamp(intensity * 0.6, 0.0, 1.0));
        
        // Add rain and glow
        finalCol += uColor * (glow + rain) * uIntensity;
        
        // Alpha calculated from intensity
        float alpha = intensity + glow * 0.5 + rain;
        
        // --- BURST EFFECT (Micro-interaction) ---
        if(uScanComplete > 0.0) {
            float burst = uScanComplete * (1.0 - uScanComplete) * 4.0; // Parabola peaking at 0.5
            
            // Radial Wave from center
            float dist = length(vUv - vec2(0.5, 0.5));
            float wave = sin(dist * 20.0 - uScanComplete * 10.0);
            
            // Add burst to color and alpha
            finalCol += uColor * wave * burst * 2.0;
            alpha += burst * 0.5 * smoothstep(0.5, 0.0, dist); // Fade out at edges
        }
        
        // Fade edges
        alpha *= smoothstep(0.0, 0.1, vUv.x) * (1.0 - smoothstep(0.9, 1.0, vUv.x));

        gl_FragColor = vec4(finalCol, clamp(alpha, 0.0, 1.0));
    }
`;

// --- CONSTANTS ---
const PARTICLE_COUNT = 60; // Kept at 60 as requested

export const TechScanner = ({ color, className, state = ScannerState.IDLE }: TechScannerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const particlesRef = useRef<THREE.Points | null>(null);
    const particleDataRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; }[]>([]);

    // State Refs for animation lerping
    const intensityTargetRef = useRef(1.0);
    const intensityCurrentRef = useRef(1.0);
    const scanCompleteRef = useRef(0.0);

    // Timing with Clock for Delta Time
    const clockRef = useRef(new THREE.Clock());
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        // Update targets based on prop state
        switch (state) {
            case ScannerState.IDLE:
                intensityTargetRef.current = 1.0;
                scanCompleteRef.current = 0.0;
                break;
            case ScannerState.SCANNING:
                intensityTargetRef.current = 1.8; // More intense
                scanCompleteRef.current = 0.0;
                break;
            case ScannerState.COMPLETE:
                intensityTargetRef.current = 2.5; // Flash peak
                // Trigger burst animation
                scanCompleteRef.current = 0.01;
                break;
            case ScannerState.GLITCH:
                // Timid no more: Glitch will jitter aggressively in shader
                intensityTargetRef.current = 0.4; // Low base intensity but high flicker
                scanCompleteRef.current = 0.0;
                break;
        }
    }, [state]);

    useEffect(() => {
        if (!containerRef.current) return;

        // CLEANUP PREVIOUS CANVAS
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        // 1. SETUP
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        const scene = new THREE.Scene();

        const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 100);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 2. BEAM PLANE
        // Consistency Fix: Using 40 segments and KEEPING logic on resize
        const geometry = new THREE.PlaneGeometry(w, h, 40, 1);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uIntensity: { value: 1.0 },
                uScanComplete: { value: 0.0 },
                uColor: { value: new THREE.Color(color) }
            },
            vertexShader: BEAM_VERTEX,
            fragmentShader: BEAM_FRAGMENT,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        materialRef.current = material;
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // 3. PARTICLES
        const pGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const sizes = new Float32Array(PARTICLE_COUNT);

        const pData = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            pData.push({
                x: (Math.random() - 0.5) * w,
                y: (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 0 // Start dead
            });
            positions[i * 3] = 0; positions[i * 3 + 1] = 0; positions[i * 3 + 2] = 0;
            sizes[i] = 0;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        particleDataRef.current = pData;

        const pMat = new THREE.PointsMaterial({
            color: new THREE.Color(color),
            size: 1.2,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const points = new THREE.Points(pGeo, pMat);
        scene.add(points);
        particlesRef.current = points;

        // 4. ANIMATION LOOP
        const animate = () => {
            // DELTA TIME FIX
            const delta = clockRef.current.getDelta();
            const time = clockRef.current.getElapsedTime();

            // Update Beam
            if (materialRef.current) {
                materialRef.current.uniforms.uTime.value = time;

                // --- LERP INTENSITY ---
                intensityCurrentRef.current = THREE.MathUtils.lerp(
                    intensityCurrentRef.current,
                    intensityTargetRef.current,
                    delta * 5.0 // Frame-rate independent lerp
                );

                // GLITCH JITTER logic inside animate loop (CPU side for ease)
                let finalIntensity = intensityCurrentRef.current;
                if (state === ScannerState.GLITCH) {
                    // Random dropout
                    if (Math.random() > 0.8) finalIntensity = 0.0;
                    if (Math.random() > 0.9) finalIntensity = 1.0;
                }

                materialRef.current.uniforms.uIntensity.value = finalIntensity;

                // --- HANDLE BURST ANIMATION ---
                if (scanCompleteRef.current > 0.0) {
                    scanCompleteRef.current += delta * 1.5; // Fast burst (Original Snappy Feel)
                    if (scanCompleteRef.current >= 1.0) {
                        scanCompleteRef.current = 0.0; // Reset
                        intensityTargetRef.current = 1.0; // Back to normal
                    }
                    materialRef.current.uniforms.uScanComplete.value = scanCompleteRef.current;
                } else {
                    materialRef.current.uniforms.uScanComplete.value = 0.0;
                }
            }

            // Update Particles
            if (particlesRef.current) {
                const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
                const data = particleDataRef.current;

                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    const p = data[i];

                    if (p.life <= 0) {
                        // PARTICLE LOGIC UPGRADE:
                        // Spawn chance linked to Intensity (More intensity = More particles)
                        // Burst state spawns aggressively
                        let spawnChance = 0.1 * intensityCurrentRef.current;
                        if (scanCompleteRef.current > 0.0) spawnChance = 0.8; // Shower on burst

                        if (Math.random() < spawnChance) {
                            p.life = 1.0;
                            // Reset position
                            p.x = (Math.random() - 0.5) * w;
                            p.y = (Math.random() - 0.5) * 5.0;

                            // Physics vary by state
                            // Burst = Explosive outward
                            if (scanCompleteRef.current > 0.0) {
                                p.vx = (Math.random() - 0.5) * 20.0;
                                p.vy = (Math.random() - 0.5) * 20.0;
                            } else {
                                // Normal = Crackling vertical
                                p.vx = (Math.random() - 0.5) * 2.0;
                                p.vy = (Math.random() - 0.5) * 10.0;
                            }
                        } else {
                            positions[i * 3] = 99999;
                            continue;
                        }
                    }

                    // Physics: CRACKLE EFFECT
                    p.x += p.vx * delta * 60; // Scale to 60fps base
                    p.y += p.vy * delta * 60;

                    p.vx *= 0.9;
                    p.vy *= 0.9;

                    p.life -= delta * 3.0; // Life decay

                    positions[i * 3] = p.x;
                    positions[i * 3 + 1] = p.y;
                    positions[i * 3 + 2] = 0;
                }
                posAttr.needsUpdate = true;
            }

            renderer.render(scene, camera);
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        // 5. RESIZE
        const handleResize = () => {
            if (!containerRef.current) return;
            const newW = containerRef.current.clientWidth;
            const newH = containerRef.current.clientHeight;
            renderer.setSize(newW, newH);
            camera.left = -newW / 2;
            camera.right = newW / 2;
            camera.top = newH / 2;
            camera.bottom = -newH / 2;
            camera.updateProjectionMatrix();

            // GEOMETRY LEAK FIX & CONSISTENCY
            plane.geometry.dispose();
            // Re-create with SAME segment density (40)
            plane.geometry = new THREE.PlaneGeometry(newW, newH, 40, 1);
        };
        window.addEventListener('resize', handleResize);

        // CLEANUP
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', handleResize);
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
            // Dispose scene objects
            geometry.dispose();
            material.dispose();
            pGeo.dispose();
            pMat.dispose();
            if (containerRef.current && rendererRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
        };

    }, [color]); // Dependency on color triggers rebuild

    return (
        <div ref={containerRef} className={`w-full h-full ${className} pointer-events-none`} />
    );
};
