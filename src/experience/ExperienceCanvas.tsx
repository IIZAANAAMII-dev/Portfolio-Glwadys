'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { MediaPlane } from './MediaPlane';
import { Phone } from './Phone';
import { ProjectConstellation } from './ProjectConstellation';
import { appStore } from '../lib/store';
import type { Chapter } from '../lib/store';

function ChapterGroup({ chapters, children }: { chapters: Chapter[]; children: React.ReactNode }) {
  const [chapter, setChapter] = useState(() => appStore.getState().currentChapter);
  useEffect(() => {
    const unsubscribe = appStore.subscribe((state) => setChapter(state.currentChapter));
    return () => unsubscribe();
  }, []);
  return <group visible={chapters.includes(chapter)}>{children}</group>;
}

export function ExperienceCanvas() {
  const [quality, setQuality] = useState(() => appStore.getState().quality);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsub = appStore.subscribe((state) => {
      setQuality(state.quality);
    });
    return () => {
      unsub();
    };
  }, []);

  if (!mounted || !quality.enableWebGL) {
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
          <CameraRig />

          {/* Luxury Ambient & Directional Lighting */}
          <ambientLight intensity={0.65} />
          <directionalLight position={[5, 8, 10]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-6, -4, 4]} intensity={0.8} color="#d8c29d" />

          {/* Chapter 0/1: Intro & Hero Spatial Planes */}
          <ChapterGroup chapters={['intro', 'hero', 'identity']}>
          <group position={[0, 0, 0]}>
            {/* Portrait Plane (Center) */}
            <MediaPlane
              position={[0, 0.2, 0.0]}
              scale={[3.2, 4.2, 1]}
              textureUrl="/assets/editorial/portrait-glwadys.svg"
              label="GLWADYS DALLEAU"
            />
            {/* Story Card (Right / Mid) */}
            <MediaPlane
              position={[3.8, 1.4, 1.2]}
              scale={[1.8, 3.0, 1]}
              textureUrl="/assets/projects/yuna-story.svg"
              label="STORY / ORGANIQUE"
            />
            {/* Behind The Scenes Moodboard Card (Left / Back) */}
            <MediaPlane
              position={[-3.6, -1.0, -2.0]}
              scale={[2.2, 2.2, 1]}
              textureUrl="/assets/projects/mgc-scrapbook.svg"
              isBehindLayer
              label="BEHIND / MOODBOARD"
            />
          </group>
          </ChapterGroup>

          {/* Chapter 2: Phone Sequence & Signature Dive */}
          <ChapterGroup chapters={['social']}>
          <group position={[0, -6.5, 0]}>
            <Phone
              position={[0, 0, 0.5]}
              scale={1.05}
              screenTextureUrl="/assets/projects/yuna-story.svg"
            />
          </group>
          </ChapterGroup>

          {/* Chapter 3: 3D Content Gallery Floating Nodes */}
          <ChapterGroup chapters={['gallery']}>
          <group position={[0, -12, 0]}>
            <MediaPlane
              position={[-4.5, 2.0, 1.0]}
              scale={[2.6, 3.4, 1]}
              textureUrl="/assets/projects/yuna-story.svg"
              label="VERTICAL REELS"
            />
            <MediaPlane
              position={[4.2, -1.2, -1.2]}
              scale={[3.2, 2.4, 1]}
              textureUrl="/assets/projects/comptoir-macro.svg"
              label="PRODUCT EDITORIAL"
            />
            <MediaPlane
              position={[0, 3.2, -3.0]}
              scale={[3.8, 2.6, 1]}
              textureUrl="/assets/projects/mgc-scrapbook.svg"
              label="COMMUNITY ESSENCE"
            />
          </group>
          </ChapterGroup>

          {/* Chapter 8: Work Constellation */}
          <ProjectConstellation />
        </Suspense>
      </Canvas>
    </div>
  );
}
