'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { Phone } from './Phone';
import { ProjectConstellation } from './ProjectConstellation';
import { GalleryRoom } from './GalleryRoom';
import { appStore } from '../lib/store';
import { SceneDirector, SceneLayer } from './SceneDirector';
import { SPATIAL_LANES } from '../config/spatial';

export function ExperienceCanvas() {
  const [quality, setQuality] = useState(() => appStore.getState().quality);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const unsub = appStore.subscribe((state) => {
      setQuality(state.quality);
    });
    return () => {
      window.removeEventListener('resize', checkMobile);
      unsub();
    };
  }, []);

  if (!mounted || !quality.enableWebGL || isMobile) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 48, near: 0.1, far: 80 }}
        dpr={quality.dpr}
        gl={{
          antialias: quality.tier === 'HIGH',
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <Suspense fallback={null}>
          <SceneDirector>
          <CameraRig />

          {/* Luxury Ambient & Directional Lighting */}
          <ambientLight intensity={0.65} />
          <directionalLight position={[5, 8, 10]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-6, -4, 4]} intensity={0.8} color="#d8c29d" />

          {/* Chapter 2: Phone Sequence & Signature Dive */}
          <SceneLayer scene="social">
          <group position={[0, -6.5, 0]}>
            <Phone
              position={[0, 0, SPATIAL_LANES.primary.z + 0.5]}
              scale={1.05}
              screenTextureUrl="/assets/projects/yuna-story.svg"
            />
          </group>
          </SceneLayer>

          {/* Chapter 3: 3D Editorial Gallery Room */}
          <SceneLayer scene="gallery">
            <group position={[0, -12, 0]}>
              <GalleryRoom />
            </group>
          </SceneLayer>

          {/* Chapter 8: Work Constellation */}
          <SceneLayer scene="work"><ProjectConstellation /></SceneLayer>
          </SceneDirector>
        </Suspense>
      </Canvas>
    </div>
  );
}
