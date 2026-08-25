'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';

import { galleryFlatSlots, galleryPlanes, type GalleryPlane } from './galleryLayout';

interface Gallery3DProps {
  /** 0 -> 1 across the authored camera track. Written by GSAP, read by R3F. */
  progress: MutableRefObject<number>;
  /** Scroll-driven separation of the campaign into depth planes. */
  burst: MutableRefObject<number>;
  /** Lets the scroll timeline request a frame from a demand-loop canvas. */
  requestRenderRef: MutableRefObject<(() => void) | null>;
}

const FOV = 55;
const FLAT_DISTANCE = 16;
const FLATTEN_AT = 0.58;

const CAMERA_TRACK: Array<{ p: number; z: number; x: number; y: number }> = [
  { p: 0, z: 8, x: 0, y: 0 },
  { p: 0.14, z: -8, x: 0.1, y: 0.08 },
  { p: 0.31, z: -29, x: -0.42, y: -0.18 },
  { p: 0.48, z: -51, x: 0.78, y: 0.26 },
  { p: 0.65, z: -72, x: -0.7, y: -0.25 },
  { p: 0.82, z: -91, x: 0.24, y: 0.16 },
  { p: 1, z: -108, x: 0, y: 0 },
];

function smoothstep(value: number) {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function sampleTrack(progress: number) {
  if (progress <= CAMERA_TRACK[0]!.p) return CAMERA_TRACK[0]!;

  for (let index = 1; index < CAMERA_TRACK.length; index += 1) {
    const next = CAMERA_TRACK[index]!;
    if (progress <= next.p) {
      const previous = CAMERA_TRACK[index - 1]!;
      const local = smoothstep((progress - previous.p) / (next.p - previous.p));
      return {
        p: progress,
        z: THREE.MathUtils.lerp(previous.z, next.z, local),
        x: THREE.MathUtils.lerp(previous.x, next.x, local),
        y: THREE.MathUtils.lerp(previous.y, next.y, local),
      };
    }
  }

  return CAMERA_TRACK[CAMERA_TRACK.length - 1]!;
}

const VERTEX = /* glsl */ `
  uniform float uBend;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += sin(uv.x * 3.14159265) * sin(uv.y * 2.6) * uBend;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uPlaneAspect;
  uniform float uImageAspect;
  uniform float uAlpha;
  uniform float uDepth;
  uniform vec2 uFocus;
  varying vec2 vUv;

  vec2 uvCover(vec2 uv, float planeAspect, float imageAspect, vec2 focus) {
    vec2 scale = planeAspect > imageAspect
      ? vec2(1.0, imageAspect / planeAspect)
      : vec2(planeAspect / imageAspect, 1.0);
    return (uv - 0.5) * scale + focus;
  }

  void main() {
    vec2 uv = uvCover(vUv, uPlaneAspect, uImageAspect, uFocus);
    vec3 color = texture2D(uMap, uv).rgb;
    vec2 edgeDistance = abs(vUv - 0.5) * 2.0;
    float edge = 1.0 - smoothstep(0.87, 1.0, max(edgeDistance.x, edgeDistance.y)) * 0.13;
    float sun = 1.0 - smoothstep(0.0, 0.82, distance(vUv, vec2(0.66, 0.7)));
    float vignette = 1.0 - smoothstep(0.36, 0.92, distance(vUv, vec2(0.5)));
    color *= mix(0.88, 1.04, vignette);
    color += vec3(0.075, 0.038, 0.014) * sun * uDepth;

    gl_FragColor = vec4(color * edge, uAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

interface TextureState {
  key: string;
  textures: Map<string, THREE.Texture>;
}

function useGalleryTextures(
  sources: string[],
  invalidate: () => void,
  maxAnisotropy: number,
) {
  const key = sources.join('|');
  const [state, setState] = useState<TextureState | null>(null);

  useEffect(() => {
    let active = true;
    const owned: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();

    void Promise.all(
      sources.map(async (src) => {
        const texture = await loader.loadAsync(src);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = Math.min(4, maxAnisotropy);
        owned.push(texture);
        return [src, texture] as const;
      }),
    )
      .then((entries) => {
        if (!active) {
          entries.forEach(([, texture]) => texture.dispose());
          return;
        }
        setState({ key, textures: new Map(entries) });
        invalidate();
      })
      .catch(() => {
        // Keep the gallery optional: a missing asset must not reject globally
        // or compromise the DOM handoff that follows it.
        if (active) {
          setState({ key, textures: new Map() });
          invalidate();
        }
      });

    return () => {
      active = false;
      owned.forEach((texture) => texture.dispose());
    };
  }, [invalidate, key, maxAnisotropy, sources]);

  return state?.key === key ? state.textures : null;
}

function Plane({
  plane,
  texture,
  progress,
  burst,
  mobile,
}: {
  plane: GalleryPlane;
  texture: THREE.Texture;
  progress: MutableRefObject<number>;
  burst: MutableRefObject<number>;
  mobile: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera, viewport } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  const imageAspect = useMemo(() => {
    const image = texture.image as { width?: number; height?: number } | undefined;
    return image?.width && image?.height ? image.width / image.height : 1;
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uPlaneAspect: { value: 1 },
      uImageAspect: { value: imageAspect },
      uAlpha: { value: 0 },
      uBend: { value: 0 },
      uDepth: { value: 0 },
      uFocus: { value: new THREE.Vector2(...(plane.focus ?? [0.5, 0.5])) },
    }),
    [imageAspect, plane.focus, texture],
  );

  useFrame(() => {
    const element = mesh.current;
    if (!element) return;

    const p = progress.current;
    const cameraPoint = sampleTrack(p);
    const flatten = smoothstep((p - FLATTEN_AT) / (1 - FLATTEN_AT));
    const rawBurst = THREE.MathUtils.clamp(burst.current, 0, 1);
    const spatialProgress = plane.depthLayer
      ? smoothstep((rawBurst + 0.08) / 0.7)
      : smoothstep((p - 0.06) / 0.32);
    const revealProgress = plane.portal
      ? 1
      : plane.depthLayer
        ? smoothstep((rawBurst + 0.05) / 0.5)
        : smoothstep((p - 0.1) / 0.22);

    target.set(cameraPoint.x, cameraPoint.y, cameraPoint.z - FLAT_DISTANCE);
    const resolvedViewport = viewport.getCurrentViewport(camera, target);

    const stagedX = mobile && plane.mobileX !== undefined ? plane.mobileX : plane.x;
    const stagedY = mobile && plane.mobileY !== undefined ? plane.mobileY : plane.y;
    let authoredX = stagedX;
    let authoredY = stagedY;
    let authoredZ = plane.z;
    let authoredW = plane.w;
    let authoredH = plane.h;

    if (plane.portal) {
      target.set(cameraPoint.x, cameraPoint.y, plane.z);
      const portalViewport = viewport.getCurrentViewport(camera, target);
      authoredW = portalViewport.width;
      authoredH = portalViewport.height;
    }

    if (plane.flatSlot >= 0) {
      const slot = galleryFlatSlots[plane.flatSlot]![mobile ? 'mobile' : 'desktop'];
      const flatW = resolvedViewport.width * slot.width;
      const flatH = flatW / slot.aspect;
      const flatX =
        cameraPoint.x + (slot.left + slot.width / 2 - 0.5) * resolvedViewport.width;
      const flatY =
        cameraPoint.y + resolvedViewport.height / 2 - slot.top * resolvedViewport.height - flatH / 2;

      authoredX = THREE.MathUtils.lerp(authoredX, flatX, flatten);
      authoredY = THREE.MathUtils.lerp(authoredY, flatY, flatten);
      authoredZ = THREE.MathUtils.lerp(authoredZ, cameraPoint.z - FLAT_DISTANCE, flatten);
      authoredW = THREE.MathUtils.lerp(authoredW, flatW, flatten);
      authoredH = THREE.MathUtils.lerp(authoredH, flatH, flatten);
    }

    // Compression -> anticipation -> burst: all sheets begin in a shallow stack,
    // then regain their authored X/Y/Z positions as the autonomous burst runs.
    const atmosphere =
      Math.sin(p * Math.PI * 5 + Math.abs(plane.z) * 0.08) *
      0.045 *
      (1 - flatten) *
      spatialProgress;
    const x = plane.portal
      ? authoredX
      : THREE.MathUtils.lerp(stagedX * 0.055, authoredX, spatialProgress);
    const y = plane.portal
      ? authoredY
      : THREE.MathUtils.lerp(stagedY * 0.055, authoredY, spatialProgress) + atmosphere;
    const z = plane.portal
      ? authoredZ
      : THREE.MathUtils.lerp(-1.5 + plane.z * 0.025, authoredZ, spatialProgress);

    element.position.set(x, y, z);
    element.rotation.set(
      THREE.MathUtils.degToRad(plane.rx) * (1 - flatten) * spatialProgress,
      THREE.MathUtils.degToRad(plane.ry) * (1 - flatten) * spatialProgress,
      0,
    );

    const burstScale = plane.portal ? 1 : THREE.MathUtils.lerp(0.82, 1, spatialProgress);
    element.scale.set(authoredW * burstScale, authoredH * burstScale, 1);

    const distance = cameraPoint.z - z;
    let alpha = smoothstep((distance - 0.75) / 2.3) * (1 - smoothstep((distance - 92) / 24));
    if (plane.portal) alpha *= 1 - smoothstep((p - 0.018) / 0.08);
    if (plane.flatSlot < 0) alpha *= 1 - flatten;

    const material = element.material as THREE.ShaderMaterial;
    material.uniforms.uAlpha!.value = alpha * revealProgress;
    material.uniforms.uPlaneAspect!.value = authoredH > 0 ? authoredW / authoredH : 1;
    material.uniforms.uDepth!.value = plane.portal ? 0.18 : 0.45 + spatialProgress * 0.55;
    material.uniforms.uBend!.value = plane.portal
      ? 0
      : (smoothstep((p - 0.47) / 0.3) - smoothstep((p - 0.82) / 0.18)) * 0.085;

    element.visible = alpha * revealProgress > 0.002;
  });

  return (
    <mesh ref={mesh} frustumCulled={false}>
      <planeGeometry args={[1, 1, 20, 20]} />
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function Rig({ progress, requestRenderRef }: Pick<Gallery3DProps, 'progress' | 'requestRenderRef'>) {
  const { camera, invalidate, size } = useThree();

  useEffect(() => {
    const syncVisibility = () => {
      requestRenderRef.current = document.hidden ? null : invalidate;
      if (!document.hidden) invalidate();
    };

    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      document.removeEventListener('visibilitychange', syncVisibility);
      requestRenderRef.current = null;
    };
  }, [invalidate, requestRenderRef]);

  useEffect(() => invalidate(), [invalidate, size.height, size.width]);

  useFrame(() => {
    const point = sampleTrack(progress.current);
    camera.position.set(point.x, point.y, point.z);
    camera.lookAt(point.x, point.y, point.z - 12);
  });

  return null;
}

function Scene({ progress, burst, requestRenderRef }: Gallery3DProps) {
  const { gl, invalidate, size } = useThree();
  const mobile = size.width < 1024;
  const planes = useMemo(
    () => (mobile ? galleryPlanes.filter((plane) => plane.mobile) : galleryPlanes),
    [mobile],
  );
  const sources = useMemo(
    () => Array.from(new Set(planes.map((plane) => plane.src))),
    [planes],
  );
  const textures = useGalleryTextures(sources, invalidate, gl.capabilities.getMaxAnisotropy());

  return (
    <>
      <Rig progress={progress} requestRenderRef={requestRenderRef} />
      {textures &&
        planes.map((plane) => {
          const texture = textures.get(plane.src);
          return texture ? (
            <Plane
              key={plane.id}
              plane={plane}
              texture={texture}
              progress={progress}
              burst={burst}
              mobile={mobile}
            />
          ) : null;
        })}
    </>
  );
}

export function Gallery3D({ progress, burst, requestRenderRef }: Gallery3DProps) {
  const [mobile, setMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia('(max-width: 1023px)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px)');
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <Canvas
      flat
      camera={{ position: [0, 0, 8], fov: FOV, near: 0.5, far: 220 }}
      dpr={mobile ? 1 : [1, 1.75]}
      frameloop="demand"
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
      }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <Scene progress={progress} burst={burst} requestRenderRef={requestRenderRef} />
    </Canvas>
  );
}
