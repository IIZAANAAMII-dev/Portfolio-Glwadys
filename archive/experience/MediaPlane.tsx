'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { appStore } from '../lib/store';
import { SPATIAL_LANES } from '../config/spatial';

interface MediaPlaneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  textureUrl?: string;
  color?: string;
  isBehindLayer?: boolean;
  aspect?: number;
  label?: string;
  onClick?: () => void;
}

export function MediaPlane({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  textureUrl,
  color = '#181a1e',
  isBehindLayer = false,
  aspect = 1,
  label,
  onClick,
}: MediaPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetPos = useRef(new THREE.Vector3(...position));
  const targetScale = useRef(
    Array.isArray(scale)
      ? new THREE.Vector3(...scale)
      : new THREE.Vector3(scale * aspect, scale, 1)
  );

  // Load texture safely if provided
  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(textureUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const state = appStore.getState();
    const isBehind = state.isBehindActive;

    // Shift in Z if Front / Behind mode is active
    let zOffset = 0;
    if (isBehindLayer) {
      zOffset = isBehind
        ? SPATIAL_LANES.foreground.z - SPATIAL_LANES.background.z
        : SPATIAL_LANES.background.z - SPATIAL_LANES.primary.z;
    } else {
      zOffset = isBehind ? SPATIAL_LANES.background.z - SPATIAL_LANES.primary.z : 0;
    }

    const goalZ = position[2] + zOffset + (hovered ? 0.4 : 0);
    meshRef.current.position.x = THREE.MathUtils.damp(
      meshRef.current.position.x,
      position[0],
      4,
      delta
    );
    meshRef.current.position.y = THREE.MathUtils.damp(
      meshRef.current.position.y,
      position[1],
      4,
      delta
    );
    meshRef.current.position.z = THREE.MathUtils.damp(
      meshRef.current.position.z,
      goalZ,
      4,
      delta
    );

    // Subtle hover scale
    const hoverMult = hovered ? 1.05 : 1.0;
    meshRef.current.scale.x = THREE.MathUtils.damp(
      meshRef.current.scale.x,
      targetScale.current.x * hoverMult,
      5,
      delta
    );
    meshRef.current.scale.y = THREE.MathUtils.damp(
      meshRef.current.scale.y,
      targetScale.current.y * hoverMult,
      5,
      delta
    );
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        appStore.setState({ cursorMode: 'view', cursorText: label || 'EXPLORE' });
      }}
      onPointerOut={() => {
        setHovered(false);
        appStore.setState({ cursorMode: 'default', cursorText: undefined });
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <planeGeometry args={[1, 1, 16, 16]} />
      {texture ? (
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={isBehindLayer ? 0.9 : 1.0}
          side={THREE.DoubleSide}
        />
      ) : (
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      )}
    </mesh>
  );
}
