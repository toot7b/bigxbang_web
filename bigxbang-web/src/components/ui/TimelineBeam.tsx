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

        const getDimensions = () => {
            if (!containerRef.current) return { w: 100, h: 100 };
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            return { w: w === 0 ? 10 : w, h: h === 0 ? 10 : h }; // Avoid 0
        };

        const dims = getDimensions();
        width = dims.w;
        height = dims.h;

        // Debug
        console.log("TimelineBeam Mount Dimensions:", width, height);

        const aspect = width / height;

        // 3. Camera
        const camera = new THREE.OrthographicCamera(-1 * aspect, 1 * aspect, 1, -1, 0.1, 100);
        camera.position.z = 10;
        cameraRef.current = camera;

        // 4. Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Force CSS Styles to ensure visibility
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.pointerEvents = 'none'; // Ensure clicks pass through

        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 5. Geometry & Shader
        const geometry = new THREE.PlaneGeometry(2, 2); // Full screen quad

        // VERTEX SHADER
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        // FRAGMENT SHADER
        const fragmentShader = `
            uniform float uProgress;
            uniform float uTime;
            uniform float uAspect;
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
                // InvertedY logic: 0 at Top, 1 at Bottom.
                float invertedY = 1.0 - vUv.y;
                
                // --- ORTHOGONAL SHADER LOGIC (Gap-Free) ---
                
                // 1. COORDINATES
                float signedDist = invertedY - uProgress; // < 0: Active, > 0: Inactive
                
                // 2. HORIZONTAL SHAPE (The "Laser" Cross-section)
                // Center is 0.5.
                float distX = abs(vUv.x - 0.5);
                float core = smoothstep(0.04, 0.0, distX);        // Thin bright core
                float glow = smoothstep(0.4, 0.0, distX) * 0.4;   // Soft wide glow
                float baseShape = core + glow;                    // Total Light Shape
                
                // 3. VERTICAL INTENSITY (Active vs Inactive)
                // 1. FILL MASK (Where is the beam?)
                // Active when signedDist < 0.
                float beamMask = 1.0 - smoothstep(0.0, 0.015, signedDist);
                
                // 4. PRECISE TIP ANIMATION
                float tipIntensity = 1.0 - smoothstep(0.0, 0.03, abs(signedDist));
                tipIntensity = pow(tipIntensity, 4.0); // Sharpen the peak
                
                // 5. COLOR
                // Base: #306EE8 (Blue). Tip: #FFFFFF (White).
                vec3 baseBlue = vec3(0.18, 0.43, 0.91);
                // Add noise to blue
                float n = noise(vec2(vUv.x * 10.0, vUv.y * 20.0 - uTime * 3.0));
                baseBlue += n * 0.1;

                // Scanline Effect (Tech vibe)
                float scan = sin((vUv.y - uTime * 0.5) * 40.0) * 0.05;
                vec3 finalColor = mix(baseBlue, vec3(1.0), tipIntensity); // Blue -> White at tip
                finalColor += scan; // Add scanline brightness variation

                // Tip Flash
                finalColor += vec3(1.0) * tipIntensity * 0.5; 
                
                // 6. FINAL ALPHA
                // We want the rail (Inactive, beamMask ~ 0) to be faint but VISIBLE.
                // Boost visibility to 0.4/0.5 minimum to ensure it's seen against dark backgrounds
                
                float visibility = mix(0.4, 1.0, beamMask); 
                float finalAlpha = baseShape * visibility;
                
                // Boost alpha at tip
                finalAlpha += tipIntensity * core * 0.5;

                // 7. GLOBAL FADE IN AT TOP (Soft Start)
                float startFade = smoothstep(0.0, 0.1, invertedY);
                finalAlpha *= startFade;

                // 8. GLOBAL FADE OUT AT BOTTOM (Hard Stop)
                float endFade = 1.0 - smoothstep(0.833, 0.835, invertedY);
                finalAlpha *= endFade;

                gl_FragColor = vec4(finalColor, finalAlpha);
            }
        `;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uProgress: { value: 0 },
                uTime: { value: 0 },
                uAspect: { value: aspect }
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending, // Restore Additive Blending for Glow
            depthWrite: false,
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

        // Resize Handler (ROBUST)
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width: w, height: h } = entry.contentRect;
                if (w > 0 && h > 0 && rendererRef.current && cameraRef.current && materialRef.current) {
                    rendererRef.current.setSize(w, h);
                    const a = w / h;
                    // Update Camera
                    cameraRef.current.left = -1 * a;
                    cameraRef.current.right = 1 * a;
                    cameraRef.current.top = 1;
                    cameraRef.current.bottom = -1;
                    cameraRef.current.updateProjectionMatrix();

                    materialRef.current.uniforms.uAspect.value = a;
                }
            }
        });
        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
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
            materialRef.current.uniforms.uProgress.value = progress;
        }
    }, [progress]);

    return (
        <div
            ref={containerRef}
            className={`w-full h-full relative ${className}`}
        >
        </div>
    );
};
