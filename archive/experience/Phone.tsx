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
  const phaseRefs = useRef<Array<THREE.Mesh | null>>([]);
  const [hovered, setHovered] = useState(false);

  const screenTextures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const urls = [
      screenTextureUrl,
      '/assets/projects/mgc-scrapbook.svg',
      '/assets/projects/comptoir-macro.svg',
    ];
    return urls.map((url) => {
      const tex = loader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });
  }, [screenTextureUrl]);

  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const progress = appStore.getState().chapterProgress;

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
    // Three short beats: feed, story, campaign. The phone remains anchored while its
    // content rhythm changes with the pinned Social chapter.
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      Math.sin(progress * Math.PI) * 0.035,
      4,
      delta
    );
    // Switch screen texture in three beats based on social scroll progress
    if (screenRef.current) {
      const screenIndex = Math.min(2, Math.floor(progress * 3));
      const screenMaterial = screenRef.current.material as THREE.MeshBasicMaterial;
      screenMaterial.map = screenTextures[screenIndex];
    }

    phaseRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const active = progress >= index / 3 && progress < (index + 1) / 3 + 0.12;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.damp(material.opacity, active ? 0.95 : 0.22, 8, delta);
    });
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        appStore.setState({ cursorMode: 'open' });
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
      <mesh ref={screenRef} position={[0, 0, 0.1]}>
        <planeGeometry args={[2.0, 4.2]} />
        <meshBasicMaterial map={screenTextures[0]} toneMapped={false} />
      </mesh>

      {/* Dynamic Island / Top Camera Bezel */}
      <mesh position={[0, 1.85, 0.105]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <group position={[-0.72, 1.7, 0.115]}>
        {[0, 1, 2].map((index) => (
          <mesh key={index} ref={(mesh) => { phaseRefs.current[index] = mesh; }} position={[index * 0.36, 0, 0]}>
            <planeGeometry args={[0.28, 0.035]} />
            <meshBasicMaterial color={index === 1 ? '#d8c29d' : '#f5f3ef'} transparent opacity={0.22} />
          </mesh>
        ))}
      </group>

      <mesh position={[0, -1.72, 0.115]}>
        <planeGeometry args={[1.22, 0.05]} />
        <meshBasicMaterial color="#f5f3ef" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}
