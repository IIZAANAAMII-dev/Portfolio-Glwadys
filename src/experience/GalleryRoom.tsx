'use client';

import * as THREE from 'three';
import { MediaPlane } from './MediaPlane';

export function GalleryRoom() {
  return (
    <group position={[0, 0, 0]}>
      {/* Back wall */}
      <mesh position={[0, 1.2, -6]}>
        <boxGeometry args={[18, 10, 0.5]} />
        <meshStandardMaterial
          color="#0b0c0e"
          roughness={0.65}
          metalness={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -3.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial
          color="#121418"
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>

      {/* Left wall */}
      <mesh position={[-9, 1.2, -6]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial
          color="#0b0c0e"
          roughness={0.65}
          metalness={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Right wall */}
      <mesh position={[9, 1.2, -6]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial
          color="#0b0c0e"
          roughness={0.65}
          metalness={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Editorial frames */}
      <group position={[0, 0.8, -5.6]}>
        <MediaPlane
          position={[-4.4, 0, 0]}
          scale={[3.6, 4.8, 1]}
          textureUrl="/assets/projects/yuna-story.svg"
        />
        <MediaPlane
          position={[0, 0, 0]}
          scale={[3.9, 4.4, 1]}
          textureUrl="/assets/projects/mgc-scrapbook.svg"
        />
        <MediaPlane
          position={[4.4, 0, 0]}
          scale={[3.6, 4.8, 1]}
          textureUrl="/assets/projects/comptoir-macro.svg"
        />
      </group>
    </group>
  );
}
