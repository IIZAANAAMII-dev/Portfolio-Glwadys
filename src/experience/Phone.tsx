'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { appStore } from '../lib/store';

interface PhoneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  screenTextureUrl?: string;
  onScreenClick?: () => void;
}

export function Phone({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  screenTextureUrl = '/assets/projects/yuna-story.svg',
  onScreenClick,
}: PhoneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => {
    if (!screenTextureUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(screenTextureUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [screenTextureUrl]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const chapter = appStore.getState().currentChapter;

    // Idle subtle floating
    const floatY = Math.sin(time * 1.5) * 0.05;
    const floatRotY = Math.cos(time * 1.2) * 0.04;

    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      position[1] + floatY,
      4,
      delta
    );
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      position[0],
      4,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      position[2],
      4,
      delta
    );

    // Dynamic rotation tilt
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      rotation[1] + floatRotY + (hovered ? 0.15 : 0),
      4,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      rotation[0] + (hovered ? -0.1 : 0),
      4,
      delta
    );
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        appStore.setState({ cursorMode: 'open', cursorText: 'DIVE IN' });
      }}
      onPointerOut={() => {
        setHovered(false);
        appStore.setState({ cursorMode: 'default', cursorText: undefined });
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onScreenClick) onScreenClick();
      }}
    >
      {/* Phone Outer Chassis / Bezel */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 4.4, 0.18]} />
        <meshStandardMaterial
          color="#151619"
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* Screen Display Plane */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[2.0, 4.2]} />
        {texture ? (
          <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
          <meshStandardMaterial color="#0b0c0e" roughness={0.1} />
        )}
      </mesh>

      {/* Dynamic Island / Top Camera Bezel */}
      <mesh position={[0, 1.85, 0.105]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}
