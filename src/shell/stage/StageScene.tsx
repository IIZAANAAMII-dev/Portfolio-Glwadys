'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { registerStageRenderer, stageAnchor, stageState } from '@/lib/stage';

import { PLANES, PLANE_RANGE, sourcesForTier, type Key, type Plane } from './film';

/**
 * L'unique scène 3D du site.
 *
 * Aucune caméra n'est animée : elle regarde toujours −Z depuis l'origine.
 * Le mouvement de « traversée » est porté par la distance `d` de chaque plan,
 * ce qui rend la partition entièrement déterministe et donc réversible au pixel
 * dans les deux sens de scroll — un travelling de caméra combiné à des plans
 * ancrés à l'écran serait, lui, impossible à recaler exactement sur le DOM.
 */

const FOV = 52;
const NEAR = 0.4;

/** Hauteur visible à la distance `d`, en unités monde. */
function visibleHeight(d: number) {
  return 2 * d * Math.tan((FOV * Math.PI) / 360);
}

function smoothstep(x: number) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* ── Matériau ─────────────────────────────────────────────────────────────
   `uCover` réalise le recadrage type `object-fit: cover` avec point focal,
   `uHaze` la perte atmosphérique en profondeur. Un seul programme GLSL pour
   tous les plans : le compilateur ne travaille qu'une fois.                */

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uCover;
  uniform vec2 uFocus;
  uniform float uAlpha;
  uniform float uHaze;
  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv - 0.5) * uCover + uFocus;
    vec3 color = texture2D(uMap, uv).rgb;

    // Vignette interne : donne au plan un bord de tirage, pas un bord de div.
    vec2 edge = abs(vUv - 0.5) * 2.0;
    float frame = 1.0 - smoothstep(0.9, 1.0, max(edge.x, edge.y)) * 0.16;

    // Profondeur : la matière s'enfonce dans le brun de la scène.
    vec3 air = vec3(0.106, 0.086, 0.070);
    color = mix(color * frame, air, uHaze);

    gl_FragColor = vec4(color, uAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/* ── Textures ─────────────────────────────────────────────────────────── */

type TextureMap = Map<string, THREE.Texture>;

function useProgressiveTextures(mobile: boolean, anisotropy: number) {
  const [textures, setTextures] = useState<TextureMap>(() => new Map());
  const tierRef = useRef(-1);

  useEffect(() => {
    let alive = true;
    const owned: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();
    const store: TextureMap = new Map();

    const loadTier = async (tier: 0 | 1 | 2) => {
      const entries = await Promise.all(
        sourcesForTier(tier, mobile).map(async (src) => {
          try {
            const texture = await loader.loadAsync(src);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = Math.min(4, anisotropy);
            owned.push(texture);
            return [src, texture] as const;
          } catch {
            /* Un asset manquant ne doit jamais faire tomber la scène : le plan
               concerné reste simplement absent, la narration DOM subsiste. */
            return null;
          }
        }),
      );
      if (!alive) return;
      entries.forEach((entry) => entry && store.set(entry[0], entry[1]));
      setTextures(new Map(store));
    };

    /* Trois paliers séquentiels : le raccord du téléphone n'attend jamais les
       textures des projets, mais elles sont prêtes bien avant leur chapitre. */
    void (async () => {
      await loadTier(0);
      if (!alive) return;
      await loadTier(1);
      if (!alive) return;
      await loadTier(2);
    })();

    return () => {
      alive = false;
      owned.forEach((texture) => texture.dispose());
    };
  }, [anisotropy, mobile]);

  return { textures, tierRef };
}

/* ── Échantillonnage de la partition ─────────────────────────────────────
   Une seule structure mutable réutilisée à chaque frame : aucune allocation
   dans la boucle de rendu.                                                */

interface Sample {
  u: number;
  v: number;
  w: number;
  h: number;
  d: number;
  rx: number;
  ry: number;
  rz: number;
  a: number;
  fx: number;
  fy: number;
}

const scratch: Sample = { u: 0.5, v: 0.5, w: 0, h: 0, d: 10, rx: 0, ry: 0, rz: 0, a: 0, fx: 0.5, fy: 0.5 };

function readKey(key: Key, out: Sample) {
  const anchored = key.anchor ? stageAnchor(key.anchor) : undefined;
  out.u = anchored ? anchored.u : key.u;
  out.v = anchored ? anchored.v : key.v;
  out.w = anchored ? anchored.w : key.w;
  out.h = anchored ? anchored.h : key.h;
  out.d = key.d;
  out.rx = key.rx ?? 0;
  out.ry = key.ry ?? 0;
  out.rz = key.rz ?? 0;
  out.a = key.a ?? 1;
  out.fx = key.fx ?? 0.5;
  out.fy = key.fy ?? 0.5;
}

const a: Sample = { ...scratch };
const b: Sample = { ...scratch };

function sample(plane: Plane, t: number, out: Sample): boolean {
  const keys = plane.keys;
  const first = keys[0]!;
  const last = keys[keys.length - 1]!;
  if (t < first.t || t > last.t) return false;

  let index = 0;
  while (index < keys.length - 1 && keys[index + 1]!.t < t) index += 1;

  const from = keys[index]!;
  const to = keys[Math.min(index + 1, keys.length - 1)]!;
  readKey(from, a);
  if (from === to) {
    Object.assign(out, a);
    return true;
  }
  readKey(to, b);

  const span = to.t - from.t;
  const raw = span > 0 ? (t - from.t) / span : 1;
  const k = to.linear ? Math.min(1, Math.max(0, raw)) : smoothstep(raw);

  out.u = lerp(a.u, b.u, k);
  out.v = lerp(a.v, b.v, k);
  out.w = lerp(a.w, b.w, k);
  out.h = lerp(a.h, b.h, k);
  out.d = lerp(a.d, b.d, k);
  out.rx = lerp(a.rx, b.rx, k);
  out.ry = lerp(a.ry, b.ry, k);
  out.rz = lerp(a.rz, b.rz, k);
  out.a = lerp(a.a, b.a, k);
  out.fx = lerp(a.fx, b.fx, k);
  out.fy = lerp(a.fy, b.fy, k);
  return true;
}

/* ── Plan ─────────────────────────────────────────────────────────────── */

const DEG = Math.PI / 180;

function StagePlane({
  plane,
  texture,
  geometry,
}: {
  plane: Plane;
  texture: THREE.Texture;
  geometry: THREE.PlaneGeometry;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const aspect = useThree((s) => s.viewport.aspect);

  const imageAspect = useMemo(() => {
    const image = texture.image as { width?: number; height?: number } | undefined;
    return image?.width && image?.height ? image.width / image.height : 1;
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uCover: { value: new THREE.Vector2(1, 1) },
      uFocus: { value: new THREE.Vector2(0.5, 0.5) },
      uAlpha: { value: 0 },
      uHaze: { value: 0 },
    }),
    [texture],
  );

  const range = PLANE_RANGE.get(plane.id)!;

  useFrame(() => {
    const el = mesh.current;
    if (!el) return;

    const { t } = stageState();
    if (t < range.from - 0.001 || t > range.to + 0.001 || !sample(plane, t, scratch)) {
      el.visible = false;
      return;
    }
    if (scratch.a <= 0.002 || scratch.w <= 0) {
      el.visible = false;
      return;
    }

    const vh = visibleHeight(scratch.d);
    const vw = vh * aspect;

    const worldW = vw * scratch.w;
    const worldH = vh * scratch.h;

    el.position.set(
      (scratch.u - 0.5) * vw,
      (0.5 - scratch.v) * vh,
      -scratch.d,
    );
    el.rotation.set(scratch.rx * DEG, scratch.ry * DEG, scratch.rz * DEG);
    el.scale.set(worldW, worldH, 1);
    el.visible = true;

    // cover : la texture remplit le rectangle sans jamais se déformer.
    const planeAspect = worldH > 0 ? worldW / worldH : 1;
    const cover = uniforms.uCover.value;
    if (planeAspect > imageAspect) {
      cover.set(1, imageAspect / planeAspect);
    } else {
      cover.set(planeAspect / imageAspect, 1);
    }
    uniforms.uFocus.value.set(scratch.fx, scratch.fy);
    uniforms.uAlpha.value = scratch.a;
    // 0 à 12 unités : net. Au-delà, la matière s'enfonce dans l'air du décor.
    uniforms.uHaze.value = Math.min(0.42, Math.max(0, (scratch.d - 13) / 130));
  });

  return (
    <mesh ref={mesh} geometry={geometry} visible={false} frustumCulled={false} renderOrder={1}>
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ── Scène ────────────────────────────────────────────────────────────── */

export function StageScene() {
  const { gl, invalidate, size, camera } = useThree();
  const mobile = size.width < 1024;
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const { textures } = useProgressiveTextures(mobile, gl.capabilities.getMaxAnisotropy());

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    registerStageRenderer(invalidate);
    return () => registerStageRenderer(null);
  }, [invalidate]);

  // Le layout est en fractions d'écran : un resize doit redessiner.
  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    perspective.fov = FOV;
    perspective.near = NEAR;
    /* La caméra est à l'origine et regarde −Z. Il faut l'écrire explicitement :
       R3F appelle `lookAt(0,0,0)` sur la caméra par défaut, ce qui est dégénéré
       quand elle est elle-même à l'origine — THREE retombe alors sur un regard
       vers +Z et la scène entière se retrouve derrière l'objectif. */
    perspective.position.set(0, 0, 0);
    perspective.rotation.set(0, 0, 0);
    perspective.quaternion.identity();
    perspective.updateProjectionMatrix();
    perspective.updateMatrixWorld();
    invalidate();
  }, [camera, invalidate, size.height, size.width]);

  useEffect(() => invalidate(), [invalidate, textures]);

  const visible = useMemo(
    () => PLANES.filter((plane) => !(mobile && plane.desktopOnly)),
    [mobile],
  );

  return (
    <>
      {visible.map((plane) => {
        const texture = textures.get(plane.src);
        return texture ? (
          <StagePlane key={plane.id} plane={plane} texture={texture} geometry={geometry} />
        ) : null;
      })}
    </>
  );
}
