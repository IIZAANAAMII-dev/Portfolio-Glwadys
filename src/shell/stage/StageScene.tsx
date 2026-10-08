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

  useEffect(() => {
    let alive = true;
    const owned: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();
    const store: TextureMap = new Map();

    const loadTier = async (tier: 0 | 1 | 2) => {
      const sources = sourcesForTier(tier, mobile);
      // Charge en parallèle, mais pousse chaque texture dès qu'elle arrive :
      // l'écran du téléphone s'affiche immédiatement, les cadres de la galerie
      // arrivent au fur et à mesure.
      await Promise.all(
        sources.map(async (src) => {
          if (store.has(src)) return;
          try {
            const width = src.endsWith('social-portal-v2.jpg') ? 1920 : 1080;
            const texture = await loader.loadAsync(`/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`);
            if (!alive) {
              texture.dispose();
              return;
            }
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = Math.min(4, anisotropy);
            owned.push(texture);
            if (alive) {
              store.set(src, texture);
              setTextures(new Map(store));
            }
          } catch (e) {
            /* Un asset manquant ne doit jamais faire tomber la scène : le plan
               concerné reste simplement absent, la narration DOM subsiste. */
            console.error('[stage texture missing]', src, (e as Error).message);
          }
        }),
      );
    };

    /* Deux paliers du raccord local. Les textures des projets ne sont pas
       chargées dans cette scène : leurs actes restent propriétaires du DOM. */
    void (async () => {
      await loadTier(0);
      if (!alive) return;
      await loadTier(1);
    })();

    return () => {
      alive = false;
      owned.forEach((texture) => texture.dispose());
    };
  }, [anisotropy, mobile]);

  return { textures };
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

  useEffect(() => {
    const el = mesh.current;
    if (!el) return;
    const mat = el.material as THREE.ShaderMaterial;
    if (mat) mat.uniforms.uMap!.value = texture;
  }, [texture]);

  useFrame(() => {
    const el = mesh.current;
    if (!el) return;
    const mat = el.material as THREE.ShaderMaterial;
    if (!mat) return;

    const { t, live, owner } = stageState();
    if (!live || owner !== 'story' || t > 3 || t < range.from - 0.001 || t > range.to + 0.001 || !sample(plane, t, scratch)) {
      el.visible = false;
      el.position.set(0, 0, -400);
      el.scale.set(0, 0, 0);
      mat.uniforms.uAlpha!.value = 0;
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
    const cover = mat.uniforms.uCover!.value as THREE.Vector2;
    if (planeAspect > imageAspect) {
      cover.set(1, imageAspect / planeAspect);
    } else {
      cover.set(planeAspect / imageAspect, 1);
    }
    (mat.uniforms.uFocus!.value as THREE.Vector2).set(
      cover.x / 2 + (1 - cover.x) * scratch.fx,
      cover.y / 2 + (1 - cover.y) * (1 - scratch.fy),
    );
    mat.uniforms.uAlpha!.value = scratch.a;
    // 0 à 12 unités : net. Au-delà, la matière s'enfonce dans l'air du décor.
    mat.uniforms.uHaze!.value = Math.min(0.42, Math.max(0, (scratch.d - 13) / 130));
  });

  return (
    <mesh ref={mesh} name={plane.id} geometry={geometry} visible={false} frustumCulled={false} renderOrder={1}>
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

export function StageScene({ onReady }: { onReady: () => void }) {
  const { gl, invalidate, size, scene } = useThree();
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
    // La rotation explicite du Canvas empêche son lookAt par défaut. R3F
    // conserve la responsabilité du redimensionnement de la caméra.
    invalidate();
  }, [invalidate, size.height, size.width]);

  useEffect(() => invalidate(), [invalidate, textures]);
  useEffect(() => {
    if ([...sourcesForTier(0, mobile), ...sourcesForTier(1, mobile)].every((source) => textures.has(source))) onReady();
  }, [mobile, onReady, textures]);

  // Télémétrie uniquement dans les preuves QA ; aucun compteur dans l'UI.
  const qa = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('qa');
  useFrame(() => {
    if (!qa) return;
    const { owner, t, live } = stageState();
    Object.assign(gl.domElement.dataset, {
      owner: owner ?? '', time: String(t), live: String(live),
      textures: String(gl.info.memory.textures), geometries: String(gl.info.memory.geometries),
      planes: scene.children.filter((child) => child.visible && child.type === 'Mesh').map((child) => child.name).join(','),
    });
  });

  const visible = useMemo(
    () => PLANES.filter((plane) => plane.tier < 2 && !/^raw-[45]$/.test(plane.id) && !(mobile && plane.desktopOnly)),
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
