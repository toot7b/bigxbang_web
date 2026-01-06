"use client";

import React, { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ElectricLine } from './ElectricLine';

/**
 * ManifestoBlastLine
 * A WebGL Canvas that renders an ElectricLine blast from the asterisk position to the CTA.
 * 
 * Props:
 * - triggered: boolean - When true, fires the blast
 */

const BlastLineScene = ({ triggered }: { triggered: boolean }) => {
    const { viewport } = useThree();
    const hasFiredRef = useRef(false);

    // Track if we've fired (to prevent re-trigger on scroll up)
    if (triggered && !hasFiredRef.current) {
        hasFiredRef.current = true;
    }

    // Start: From edge of circle (below center, where circle ends)
    const start: [number, number, number] = [0, viewport.height / 2 - 0.5, 0];
    // End: Bottom of the canvas (near CTA)
    const end: [number, number, number] = [0, -viewport.height / 2 + 0.2, 0];

    return (
        <ElectricLine
            start={start}
            end={end}
            mode="blast"
            trigger={hasFiredRef.current}
            color="#306EE8"
            fadeEdges={true}
        />
    );
};

export const ManifestoBlastLine = ({ triggered }: { triggered: boolean }) => {
    return (
        <div className="absolute inset-0 z-30 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ width: '100%', height: '100%' }}
                gl={{ alpha: true, antialias: true }}
            >
                <BlastLineScene triggered={triggered} />
            </Canvas>
        </div>
    );
};

export default ManifestoBlastLine;
