'use client';

import { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const planePositions = [
  { id: 'far', z: -18, color: '#181A1E', size: [18, 10], x: 0, y: 0 },
  { id: 'mid', z: -10, color: '#23272D', size: [8, 12], x: -3, y: 1 },
  { id: 'primary', z: -3, color: '#1E1812', size: [5, 8], x: 1.5, y: -0.5 },
  { id: 'foreground', z: 3, color: '#F7F2EA', size: [4, 6], x: -1, y: 2 },
];

function MediaPlane({
  color,
  size,
  position,
}: {
  color: string;
  size: [number, number];
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color }), [color]);

  useEffect(() => {
    return () => {
      material.dispose();
      if (meshRef.current?.geometry) meshRef.current.geometry.dispose();
    };
  }, [material]);

  return (
    <mesh ref={meshRef} position={position} material={material}>
      <planeGeometry args={size} />
    </mesh>
  );
}

function Scene({
  progressRef,
  mouseRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const p = progressRef.current;
    const targetZ = p * 24 - 6;
    const targetX = mouseRef.current.x * 1.5;
    const targetY = mouseRef.current.y * 0.8;

    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.lookAt(0, 0, targetZ - 2);
  });

  return (
    <>
      {planePositions.map((plane) => (
        <MediaPlane
          key={plane.id}
          color={plane.color}
          size={plane.size as [number, number]}
          position={[plane.x, plane.y, plane.z]}
        />
      ))}
    </>
  );
}

export function SpatialExperience({
  progressRef,
  mouseRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, -6], fov: 60, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      frameloop="always"
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene progressRef={progressRef} mouseRef={mouseRef} />
      </Suspense>
    </Canvas>
  );
}
