"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface TimelineBeamProps {
    progress: number; // 0 to 1
    className?: string;
}

export const TimelineBeam = ({ progress, className }: TimelineBeamProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    // refs for points removed
    const rafRef = useRef<number | null>(null);

    // Initialize Three.js Scene
    useEffect(() => {
        if (!containerRef.current) return;

        // 1. Scene Setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // 2. Dimensions Safety Check
        let width = containerRef.current.clientWidth;
        let height = containerRef.current.clientHeight;

        // Debug
        console.log("TimelineBeam Mount Dimensions:", width, height);

        if (width === 0 || height === 0) {
            // Fallback or retry? 
            // If hidden usually 0. We can default to something to avoid NaN
            width = 100;
            height = 100;
        }

        const aspect = width / height;

        // 3. Camera
        const camera = new THREE.OrthographicCamera(-1 * aspect, 1 * aspect, 1, -1, 0.1, 100);
        camera.position.z = 10;
        cameraRef.current = camera;

        // 4. Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 5. Geometry & Shader
        const geometry = new THREE.PlaneGeometry(2 * aspect, 2); // Full screen quad for the div

        // VERTEX SHADER
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        // FRAGMENT SHADER
        const fragmentShader = `
            uniform float uProgress;
            uniform float uTime;
            varying vec2 vUv;

            // Simple pseudo-random noise
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            // gradient noise
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
                // vUv.y goes 0 (bottom) to 1 (top).
                // However, Three.js PlaneGeometry usually maps UV 0,0 to bottom-left? Yes.
                // We want the bar to fill from TOP (vUv.y = 1) to BOTTOM (vUv.y = 0)?
                // Standard progress bar usually fills from "Start".
                // In our design, the beam comes from TOP (Scroll 0) down to BOTTOM (Scroll 1).
                // So "Fill" means: Is current Y > (1.0 - uProgress)?
                // Let's invert Y for simpler logic: Y=0 at Top, Y=1 at Bottom.
                float invertedY = 1.0 - vUv.y;
                
                // --- ORTHOGONAL SHADER LOGIC (Gap-Free) ---
                
                // 1. COORDINATES
                float signedDist = invertedY - uProgress; // < 0: Active, > 0: Inactive
                
                // 2. HORIZONTAL SHAPE (The "Laser" Cross-section)
                // This is constant across the whole height.
                float distX = abs(vUv.x - 0.5);
                float core = smoothstep(0.04, 0.0, distX);        // Thin bright core
                float glow = smoothstep(0.4, 0.0, distX) * 0.4;   // Soft wide glow
                float baseShape = core + glow;                    // Total Light Shape
                
                // 3. VERTICAL INTENSITY (Active vs Inactive)
                // We want a smooth transition from Active (Full Brightness) to Inactive (Dim).
                // 1. FILL MASK (Where is the beam?)
                // We want it Active (1.0) when signedDist < 0.
                // And fade out quickly when signedDist > 0 (to transition to rail).
                // Refinment: Tighter transition (0.015) for "Laser" feel.
                float beamMask = 1.0 - smoothstep(0.0, 0.015, signedDist);
                
                // 4. PRECISE TIP ANIMATION
                // High when close to 0 (signedDist approx 0).
                float tipIntensity = 1.0 - smoothstep(0.0, 0.03, abs(signedDist));
                // Boost tip
                tipIntensity = pow(tipIntensity, 4.0); // Sharpen the peak even more
                
                // 5. COLOR
                // Base: #306EE8 (Blue). Tip: #FFFFFF (White).
                // Mix based on tipIntensity.
                vec3 baseBlue = vec3(0.18, 0.43, 0.91);
                // Add noise to blue
                float n = noise(vec2(vUv.x * 10.0, vUv.y * 20.0 - uTime * 3.0));
                baseBlue += n * 0.1;

                // Scanline Effect (Tech vibe)
                float scan = sin((vUv.y - uTime * 0.5) * 40.0) * 0.05;
                vec3 finalColor = mix(baseBlue, vec3(1.0), tipIntensity); // Blue -> White at tip
                finalColor += scan; // Add scanline brightness variation

                // Edge Glow on Progression
                // Highlights the exact point of the wavefront
                // float edge = smoothstep(uProgress - 0.01, uProgress + 0.01, invertedY);
                // finalColor += edge * 0.4; // (This adds brightness to the INACTIVE part? Let's use it subtly)
                // Actually, let's trust the "tech scanner" vibe: 
                // Maybe it highlights the "scanned" area?
                // If implied 'edge' is the transition line:
                // float transitionLine = 1.0 - smoothstep(0.0, 0.01, abs(signedDist));
                // Let's stick to the User's "Edge Glow" suggestion but be careful.
                // If they meant "Active Edge", it might be reversed. 
                // InvertedY 0(Top)..1(Bottom). uProgress.
                // If smoothstep(p-0.01, p+0.01, iY): iY < p -> 0. iY > p -> 1.
                // So this is 0 in Active, 1 in Inactive.
                // Adding this makes the RAIL brighter? Use with caution.
                // Let's assume they want a subtle highlight on the rail near the contact point?
                // Or maybe they mistakenly inverted strictness.
                // I will add a sharp flash at the contact point instead.
                finalColor += vec3(1.0) * tipIntensity * 0.5; 
                
                // 6. FINAL ALPHA
                // Alpha = Shape * Intensity.
                // We want the rail (Inactive, beamMask ~ 0) to be faint (0.15).
                // We want the beam (Active, beamMask ~ 1) to be full (1.0).
                
                float visibility = mix(0.15, 1.0, beamMask);
                float finalAlpha = baseShape * visibility;
                
                // Boost alpha at tip
                finalAlpha += tipIntensity * core * 0.5;

                // 7. GLOBAL FADE IN AT TOP (Soft Start)
                // Prevents hard cut appearance at the very top of the canvas
                float startFade = smoothstep(0.0, 0.1, invertedY);
                finalAlpha *= startFade;

                // 8. GLOBAL FADE OUT AT BOTTOM (Hard Stop)
                // Stops the beam exactly at the last point (Step 3 @ 0.833)
                // Very sharp fade (0.833 -> 0.835) to cut it off instantly at the node center
                float endFade = 1.0 - smoothstep(0.833, 0.835, invertedY);
                finalAlpha *= endFade;

                gl_FragColor = vec4(finalColor, finalAlpha);
            }
        `;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uProgress: { value: 0 },
                uTime: { value: 0 }
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false, // Important for transparency
        });
        materialRef.current = material;

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // 6. Animation Loop
        const animate = (time: number) => {
            const t = time * 0.001;

            // Update Beam
            if (materialRef.current) {
                materialRef.current.uniforms.uTime.value = t;
            }

            renderer.render(scene, camera);
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        // Resize Handler
        const handleResize = () => {
            if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            const a = w / h;

            rendererRef.current.setSize(w, h);

            // Fix Camera Frustum on Resize (Critical for responsive Beam width)
            cameraRef.current.left = -1 * a;
            cameraRef.current.right = 1 * a;
            cameraRef.current.top = 1;
            cameraRef.current.bottom = -1;
            cameraRef.current.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);
        // Force one resize call to be sure
        setTimeout(handleResize, 100);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (rendererRef.current && containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    // Sync Progress Prop to Shader Uniform
    useEffect(() => {
        if (materialRef.current) {
            // Smooth lerp could be done here or in the loop, but GSAP in parent is handling smoothness of 'scrollProgress'?
            // Actually 'scrollProgress' from parent is usually raw scroll.
            // But User Manual suggested GSAP.
            // Let's just set it directly for responsiveness, as lenis usually handles smooth scroll.
            materialRef.current.uniforms.uProgress.value = progress;
        }
    }, [progress]);

    return (
        <div
            ref={containerRef}
            className={`w-full h-full relative ${className}`}
        >
            {/* Debug Background - Temporarily visible to confirm DOM position. Will be removed. */}
            {/* <div className="absolute inset-0 bg-red-500/20 pointer-events-none border border-red-500"></div> */}
        </div>
    );
};
