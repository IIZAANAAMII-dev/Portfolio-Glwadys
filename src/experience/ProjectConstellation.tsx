'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { MediaPlane } from './MediaPlane';
import { appStore } from '../lib/store';
import { SPATIAL_LANES } from '../config/spatial';

export function ProjectConstellation() {
  const groupRef = useRef<THREE.Group>(null);
  const [activeProject, setActiveProject] = useState<'yuna' | 'mgc' | 'comptoir' | null>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    // Gentle orbit drift
    // The constellation is a quiet work anchor, not an orbiting demo.
    groupRef.current.rotation.y = Math.sin(time * 0.22) * 0.025;
    groupRef.current.position.y = Math.cos(time * 0.3) * 0.025;
  });

  return (
    <group ref={groupRef} position={[0, -18, SPATIAL_LANES.midground.z]}>
      <group position={[-3.2, 1.2, SPATIAL_LANES.primary.z]}>
        <MediaPlane
          scale={[2.2, 2.8, 1]}
          textureUrl="/assets/projects/yuna-story.svg"
          onClick={() => {
            appStore.setState({ activeProject: 'yuna' });
            setActiveProject('yuna');
          }}
        />
      </group>

      <group position={[2.8, 2.0, SPATIAL_LANES.midground.z + 1.2]}>
        <MediaPlane
          scale={[2.6, 2.6, 1]}
          textureUrl="/assets/projects/mgc-scrapbook.svg"
          onClick={() => {
            appStore.setState({ activeProject: 'mgc' });
            setActiveProject('mgc');
          }}
        />
      </group>

      <group position={[3.6, -1.8, SPATIAL_LANES.background.z + 1.8]}>
        <MediaPlane
          scale={[2.5, 2.5, 1]}
          textureUrl="/assets/projects/comptoir-macro.svg"
          onClick={() => {
            appStore.setState({ activeProject: 'comptoir' });
            setActiveProject('comptoir');
          }}
        />
      </group>
    </group>
  );
}
