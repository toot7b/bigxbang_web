"use client";

import React from 'react';
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

    // Start: From edge of circle (below center, where circle ends)
    const start: [number, number, number] = [0, viewport.height / 2 - 0.5, 0];
    // End: Bottom of the canvas (near CTA)
    const end: [number, number, number] = [0, -viewport.height / 2 + 0.2, 0];

    return (
        <ElectricLine
            start={start}
            end={end}
            mode="blast"
            trigger={triggered}
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
