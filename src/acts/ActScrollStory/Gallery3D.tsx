'use client';

import { useRef, useMemo, useCallback, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';

import {
  socialPortal,
  depthMedia,
  phoneFeed,
  behindMedia,
  openingMedia,
  heroVertical,
  heroFrame,
  phoneStory,
  type MediaItem,
} from '@/content/media';
import type { Content } from '@/content';
import type { Locale } from '@/content/locales';

interface Gallery3DProps {
  content: Content;
  locale: Locale;
  progress: React.MutableRefObject<number>;
}

const BASE_WIDTH = 2.6;

const LAYOUT = [
  { x: 0, y: 0, z: 0, rx: 0, ry: 0, s: 1.2 },
  { x: -7, y: 3.5, z: -18, rx: 4, ry: -12, s: 0.9 },
  { x: 8, y: -3, z: -24, rx: 2, ry: 9, s: 0.85 },
  { x: 4.5, y: 5, z: -12, rx: -3, ry: -11, s: 0.95 },
  { x: -6, y: -5.5, z: -22, rx: -5, ry: 14, s: 0.92 },
  { x: 1.5, y: 6.5, z: -30, rx: 6, ry: -6, s: 0.78 },
  { x: -10, y: 2, z: -8, rx: -2, ry: 6, s: 0.88 },
  { x: 11, y: 1.5, z: -16, rx: 3, ry: -8, s: 1.0 },
  { x: -4, y: -7.5, z: -28, rx: -4, ry: 12, s: 0.82 },
  { x: 9.5, y: -2, z: -36, rx: 5, ry: -4, s: 0.76 },
  { x: -9.5, y: -4, z: -32, rx: -3, ry: 14, s: 0.84 },
  { x: 12.5, y: 5.5, z: -20, rx: 2, ry: -6, s: 0.9 },
  { x: -3, y: 7.5, z: -10, rx: -6, ry: 8, s: 1.05 },
  { x: 5.5, y: -6.5, z: -14, rx: 4, ry: 10, s: 0.88 },
  { x: -12, y: -1.5, z: -26, rx: -2, ry: -10, s: 0.8 },
  { x: 14, y: 3.5, z: -30, rx: 3, ry: -8, s: 0.85 },
  { x: -1.5, y: -3, z: -6, rx: 0, ry: 0, s: 1.0 },
  { x: -13, y: 6, z: -38, rx: -6, ry: 14, s: 0.72 },
];

function isDesktop() {
  return typeof window !== 'undefined' && window.innerWidth > 1023;
}

function useGalleryMedia() {
  return useMemo(() => {
    const list: MediaItem[] = [
      socialPortal,
      ...depthMedia,
      ...phoneFeed,
      ...behindMedia,
      ...openingMedia,
      heroVertical,
      heroFrame,
      phoneStory,
    ].filter((m) => Boolean(m.src));
    const map = new Map<string, MediaItem>();
    list.forEach((m) => {
      if (!map.has(m.id)) map.set(m.id, m);
    });
    return Array.from(map.values());
  }, []);
}

function PlaneImage({
  item,
  index,
  texture,
  progress,
}: {
  item: MediaItem;
  index: number;
  texture: THREE.Texture;
  progress: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0, -2));
  const targetScale = useRef(new THREE.Vector3(1, 1, 1));
  const targetOpacity = useRef(1);
  const isDragging = useRef(false);
  const dragOffset = useRef(new THREE.Vector3(0, 0, 0));
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  const { viewport, raycaster, pointer, camera } = useThree();
  const desktop = isDesktop();

  const img = texture.image as HTMLImageElement | undefined;
  const aspect = img && img.height ? img.width / img.height : 1;

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (!meshRef.current) return;
      isDragging.current = true;
      raycaster.setFromCamera(pointer, camera);
      dragPlane.current.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), meshRef.current.position);
      const hit = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(dragPlane.current, hit)) {
        dragOffset.current.subVectors(meshRef.current.position, hit);
      }
    },
    [camera, pointer, raycaster],
  );

  const onPointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isDragging.current || !meshRef.current) return;
      e.stopPropagation();
      raycaster.setFromCamera(pointer, camera);
      const hit = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(dragPlane.current, hit)) {
        targetPos.current.copy(hit).add(dragOffset.current);
        targetPos.current.z = meshRef.current.position.z;
      }
    },
    [camera, pointer, raycaster],
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const initial = useMemo(() => new THREE.Vector3(0, 0, -2), []);
  const layout = LAYOUT[index % LAYOUT.length]!;
  const final = useMemo(
    () => new THREE.Vector3(layout.x, layout.y, layout.z),
    [layout.x, layout.y, layout.z],
  );

  useFrame(() => {
    if (!meshRef.current) return;

    const p = progress.current;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    const spread = THREE.MathUtils.clamp((p - 0.08) / 0.92, 0, 1);

    if (!isDragging.current) {
      targetPos.current.lerpVectors(initial, final, spread);
      const base = BASE_WIDTH * (desktop ? 1 : 0.75);
      const finalW = base * (layout.s ?? 1);
      const w = THREE.MathUtils.lerp(finalW * 0.15, finalW, spread);
      const h = w / aspect;
      targetScale.current.set(w, h, 1);
      targetOpacity.current = THREE.MathUtils.clamp(p * 1.4, 0, 1);
    }

    meshRef.current.position.lerp(targetPos.current, 0.08);
    meshRef.current.scale.lerp(targetScale.current, 0.08);

    const rotX = THREE.MathUtils.degToRad(layout.rx) * spread;
    const rotY = THREE.MathUtils.degToRad(layout.ry) * spread;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, rotX, 0.08);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotY, 0.08);

    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity.current, 0.1);
    material.transparent = true;
    material.depthWrite = false;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
        roughness={0.6}
        metalness={0.05}
        toneMapped={false}
      />
    </mesh>
  );
}

function CameraRig({ progress }: { progress: React.MutableRefObject<number> }) {
  const { pointer, camera } = useThree();

  useFrame(() => {
    const p = progress.current;
    const targetZ = THREE.MathUtils.lerp(8, 26, p);
    const tx = THREE.MathUtils.lerp(pointer.x * 3.5, 0, 0.1);
    const ty = THREE.MathUtils.lerp(pointer.y * 2.2, 0, 0.1);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.lookAt(0, 0, -8);
  });

  return null;
}

function FloatingText({
  position,
  children,
  fontSize = '1.2rem',
  maxWidth,
}: {
  position: [number, number, number];
  children: React.ReactNode;
  fontSize?: string;
  maxWidth?: string;
}) {
  return (
    <Html
      transform
      sprite
      distanceFactor={10}
      position={position}
      style={{
        pointerEvents: 'none',
        color: 'var(--ivory)',
        fontSize,
        maxWidth,
        lineHeight: 1.25,
        textShadow: '0 0 0.6rem rgba(0,0,0,0.45)',
        fontFamily: 'var(--font-display), Georgia, serif',
        whiteSpace: 'pre-wrap',
      }}
    >
      <div>{children}</div>
    </Html>
  );
}

function GalleryScene({ progress, content }: { progress: React.MutableRefObject<number>; content: Content }) {
  const items = useGalleryMedia();
  const srcs = useMemo(() => items.map((m) => m.src as string), [items]);
  const textures = useTexture(srcs);

  return (
    <>
      <color attach="background" args={['#0a0908']} />
      <fog attach="fog" args={['#0a0908', 12, 70]} />
      <ambientLight intensity={0.35} color="#fff5e6" />
      <directionalLight position={[8, 12, 6]} intensity={1.2} color="#fff5e6" />
      <CameraRig progress={progress} />

      <FloatingText position={[-8, 5, -4]} fontSize="0.9rem" maxWidth="30ch">
        04 / {content.immersion.heading}
      </FloatingText>
      <FloatingText position={[-7, 2, 0]} fontSize="1.8rem" maxWidth="12ch">
        {content.immersion.heading}
      </FloatingText>
      <FloatingText position={[5, -2, -6]} fontSize="1rem" maxWidth="26ch">
        {content.immersion.statement}
      </FloatingText>
      <FloatingText position={[6, -5, -2]} fontSize="0.8rem" maxWidth="40ch">
        Paper / Archive / Depth
      </FloatingText>

      {items.map((item, i) => (
        <PlaneImage key={item.id} item={item} index={i} texture={textures[i]!} progress={progress} />
      ))}
    </>
  );
}

export function Gallery3D({ content, locale, progress }: Gallery3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <Suspense fallback={null}>
        <GalleryScene progress={progress} content={content} />
      </Suspense>
    </Canvas>
  );
}
