import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const StarField = () => {
    const ref = useRef<THREE.Points>(null!);

    // Generate 10,000 points
    const [positions] = useMemo(() => {
        const pos = new Float32Array(10000 * 3);
        for (let i = 0; i < 10000; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
        return [pos];
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * 0.02;
            ref.current.rotation.y += delta * 0.01;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#E0E0E0"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
};

const CelestialBackground: React.FC = () => {
    return (
        <div id="canvas-container">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <color attach="background" args={['#050505']} />
                <StarField />
            </Canvas>
        </div>
    );
};

export default CelestialBackground;
