'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { MediaPlane } from './MediaPlane';
import { appStore } from '../lib/store';

export function ProjectConstellation() {
  const groupRef = useRef<THREE.Group>(null);
  const [activeProject, setActiveProject] = useState<'yuna' | 'mgc' | 'comptoir' | null>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    // Gentle orbit drift
    groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.08;
    groupRef.current.position.y = Math.cos(time * 0.4) * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, -18, -2]}>
      {/* Node 1: YUNA BIJOUX (Left / Near) */}
      <group position={[-3.2, 1.2, 1.5]}>
        <MediaPlane
          scale={[2.2, 2.8, 1]}
          textureUrl="/assets/projects/yuna-story.svg"
          label="YUNA BIJOUX"
          onClick={() => {
            appStore.setState({ activeProject: 'yuna' });
            setActiveProject('yuna');
          }}
        />
      </group>

      {/* Node 2: MARSEILLE GIRLS CLUB (Center-Right / High) */}
      <group position={[2.8, 2.0, 0.2]}>
        <MediaPlane
          scale={[2.6, 2.6, 1]}
          textureUrl="/assets/projects/mgc-scrapbook.svg"
          label="MARSEILLE GIRLS CLUB"
          onClick={() => {
            appStore.setState({ activeProject: 'mgc' });
            setActiveProject('mgc');
          }}
        />
      </group>

      {/* Node 3: LE COMPTOIR DE MATHILDE (Right-Far / Warm) */}
      <group position={[3.6, -1.8, -1.8]}>
        <MediaPlane
          scale={[2.5, 2.5, 1]}
          textureUrl="/assets/projects/comptoir-macro.svg"
          label="LE COMPTOIR DE MATHILDE"
          onClick={() => {
            appStore.setState({ activeProject: 'comptoir' });
            setActiveProject('comptoir');
          }}
        />
      </group>
    </group>
  );
}
