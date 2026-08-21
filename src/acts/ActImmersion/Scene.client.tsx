'use client';

import { PerspectiveCamera, useTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';

import { depthMedia } from '@/content/media';

import { IMMERSION_PROGRESS_EVENT } from './index';

interface Props {
  progress: MutableRefObject<number>;
}

const VERTEX = `
  uniform float uBend;
  varying vec2 vUv;
  varying float vLift;

  void main() {
    vUv = uv;
    vec3 p = position;
    float page = sin(uv.x * 3.14159265) * sin(uv.y * 3.14159265);
    float edgeCurl = pow(abs(uv.x - 0.5) * 2.0, 3.0) * (uv.x < 0.5 ? -1.0 : 1.0);
    p.z += page * uBend + edgeCurl * uBend * 0.16;
    vLift = page;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAGMENT = `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uSheen;
  varying vec2 vUv;
  varying float vLift;

  float grain(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec4 texel = texture2D(uMap, vUv);
    float edgeDistance = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float border = 1.0 - smoothstep(0.0, 0.009, edgeDistance);
    float edgeLight = smoothstep(0.0, 0.08, edgeDistance);
    float movingLight = smoothstep(0.0, 0.42, 1.0 - abs(vUv.x - uSheen) * 2.4);
    float fiber = (grain(vUv * 720.0) - 0.5) * 0.014;

    vec3 color = texel.rgb * mix(0.78, 1.02, edgeLight);
    color += vec3(0.035, 0.018, 0.006) + fiber;
    color += movingLight * vLift * vec3(0.055, 0.038, 0.022);
    color = mix(color, vec3(0.815, 0.678, 0.447), border * 0.44);

    gl_FragColor = vec4(color, texel.a * uOpacity);
  }
`;

const ASPECTS = [16 / 9, 9 / 16, 1, 16 / 9] as const;

const DEPTH_TEXTURE_PATHS = depthMedia.slice(0, 4).map(({ id, src }) => {
  if (!src) throw new Error(`Missing generated source for immersion media "${id}".`);
  return src;
});

interface PlaneLayout {
  x: number;
  y: number;
  width: number;
  depth: number;
  tiltY: number;
  tiltZ: number;
}

const LAYOUTS: readonly PlaneLayout[] = [
  { x: -0.27, y: 0.08, width: 0.34, depth: -8, tiltY: 0.12, tiltZ: -0.012 },
  { x: 0.02, y: 0.18, width: 0.17, depth: -24, tiltY: -0.1, tiltZ: -0.008 },
  { x: 0.29, y: 0.06, width: 0.22, depth: -39, tiltY: -0.16, tiltZ: 0.01 },
  { x: 0.12, y: -0.25, width: 0.28, depth: -19, tiltY: 0.1, tiltZ: 0.008 },
] as const;

interface PlaneProps {
  index: number;
  progress: MutableRefObject<number>;
  mobile: boolean;
  texture: THREE.Texture;
}

function coverSize(width: number, height: number, aspect: number) {
  const viewportAspect = width / height;
  if (viewportAspect > aspect) {
    const coverWidth = width * 1.012;
    return [coverWidth, coverWidth / aspect] as const;
  }
  const coverHeight = height * 1.012;
  return [coverHeight * aspect, coverHeight] as const;
}

function DepthPlane({ index, progress, mobile, texture }: PlaneProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: texture },
          uOpacity: { value: index === 0 ? 1 : 0 },
          uBend: { value: 0 },
          uSheen: { value: -0.4 },
        },
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: true,
        side: THREE.DoubleSide,
      }),
    [index, texture],
  );

  useEffect(
    () => () => {
      material.dispose();
    },
    [material],
  );

  useFrame(() => {
    const node = mesh.current;
    const liveMaterial = materialRef.current;
    const layout = LAYOUTS[index];
    if (!node || !liveMaterial || !layout) return;

    const p = progress.current;
    const open = THREE.MathUtils.smoothstep(p, 0.07, 0.37);
    const reveal = index === 0 ? 1 : THREE.MathUtils.smoothstep(p, 0.12 + index * 0.035, 0.38);
    const travel = THREE.MathUtils.smoothstep(p, 0.32, 0.76);
    const flatten = THREE.MathUtils.smoothstep(p, 0.7, 0.92);
    const exit = 1 - THREE.MathUtils.smoothstep(p, index === 0 ? 0.88 : 0.8, 1);
    const declutter = index === 0 ? 1 : 1 - THREE.MathUtils.smoothstep(p, 0.68, 0.84);
    const visibleCount = mobile ? 3 : 4;
    const aspect = ASPECTS[index] ?? 4 / 5;
    const [coverWidth, coverHeight] = coverSize(size.width, size.height, ASPECTS[0]);
    const targetWidth = size.width * layout.width;
    const targetHeight = targetWidth / aspect;

    node.visible = index < visibleCount && exit > 0.001;
    node.position.x = THREE.MathUtils.lerp(index === 0 ? 0 : layout.x * size.width, layout.x * size.width, open);
    node.position.y = THREE.MathUtils.lerp(index === 0 ? 0 : layout.y * size.height, layout.y * size.height, open);
    node.position.z = THREE.MathUtils.lerp(
      layout.depth + travel * (index % 2 === 0 ? 18 : 9),
      index * -0.45,
      flatten,
    );
    node.rotation.x = THREE.MathUtils.lerp((index % 2 === 0 ? -1 : 1) * 0.025, 0, flatten);
    node.rotation.y = THREE.MathUtils.lerp(layout.tiltY, 0, flatten);
    node.rotation.z = THREE.MathUtils.lerp(layout.tiltZ, 0, flatten);

    const width = index === 0 ? THREE.MathUtils.lerp(coverWidth, targetWidth, open) : targetWidth;
    const height = index === 0 ? THREE.MathUtils.lerp(coverHeight, targetHeight, open) : targetHeight;
    node.scale.set(width, height, 1);

    const curve = Math.sin(Math.PI * THREE.MathUtils.clamp((p - 0.3) / 0.5, 0, 1));
    liveMaterial.uniforms.uOpacity!.value = reveal * exit * declutter;
    liveMaterial.uniforms.uBend!.value = mobile ? 0 : curve * Math.min(7.5, targetWidth * 0.022);
    liveMaterial.uniforms.uSheen!.value = THREE.MathUtils.lerp(-0.25, 1.25, travel);
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1, 1, 32, 24]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  );
}

function ArchiveFrame({ index, progress }: { index: number; progress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const materials = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const { size } = useThree();

  useFrame(() => {
    const node = group.current;
    if (!node) return;
    const p = progress.current;
    const reveal = THREE.MathUtils.smoothstep(p, 0.14 + index * 0.05, 0.34 + index * 0.03);
    const travel = THREE.MathUtils.smoothstep(p, 0.32, 0.76);
    const exit = 1 - THREE.MathUtils.smoothstep(p, 0.78, 0.94);
    const opacity = reveal * exit * (0.16 - index * 0.028);

    node.visible = opacity > 0.001;
    node.position.set((index - 1) * size.width * 0.018, 0, -8 - index * 28 + travel * 12);
    node.rotation.y = (index - 1) * -0.018;
    node.scale.set(size.width * (0.88 - index * 0.12), size.height * (0.82 - index * 0.08), 1);
    materials.current.forEach((material) => {
      if (material) material.opacity = opacity;
    });
  });

  const edges = [
    { position: [0, 0.5, 0] as const, scale: [1, 0.0016, 1] as const },
    { position: [0, -0.5, 0] as const, scale: [1, 0.0016, 1] as const },
    { position: [-0.5, 0, 0] as const, scale: [0.0016, 1, 1] as const },
    { position: [0.5, 0, 0] as const, scale: [0.0016, 1, 1] as const },
  ];

  return (
    <group ref={group}>
      {edges.map((edge, edgeIndex) => (
        <mesh position={edge.position} scale={edge.scale} key={edgeIndex}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            ref={(node) => {
              materials.current[edgeIndex] = node;
            }}
            color="#d0ad72"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Rig({ progress }: Props) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const textures = useTexture(DEPTH_TEXTURE_PATHS);
  const { gl, invalidate, setDpr, size } = useThree();
  const mobile = size.width < 1024;
  const backdrop = useMemo(() => new THREE.Color('#2b1d17'), []);
  const wood = useMemo(() => new THREE.Color('#2b1d17'), []);
  const ivory = useMemo(() => new THREE.Color('#f3ede3'), []);

  useFrame(() => {
    const p = progress.current;
    const camera = cameraRef.current;
    const travel = THREE.MathUtils.smoothstep(p, 0.32, 0.76);
    const flatten = THREE.MathUtils.smoothstep(p, 0.7, 0.92);
    const paperReveal = THREE.MathUtils.smoothstep(p, 0.7, 0.94);

    backdrop.lerpColors(wood, ivory, paperReveal);
    gl.setClearColor(backdrop, 1);

    if (camera) {
      camera.position.z = 100 - travel * 22 + flatten * 22;
      camera.position.x = Math.sin(travel * Math.PI) * size.width * 0.012 * (mobile ? 0.35 : 1);
      camera.position.y = Math.sin(travel * Math.PI * 0.8) * size.height * 0.006;
    }
  });

  useLayoutEffect(() => {
    const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = anisotropy;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
    });
    invalidate();
  }, [gl, invalidate, textures]);

  useLayoutEffect(() => {
    setDpr(mobile ? 1 : Math.min(window.devicePixelRatio, 1.75));
  }, [mobile, setDpr]);

  useLayoutEffect(() => {
    const perspective = cameraRef.current;
    if (!perspective) return;
    const distance = 100;
    perspective.position.set(0, 0, distance);
    perspective.fov = 2 * Math.atan(size.height / 2 / distance) * (180 / Math.PI);
    perspective.aspect = size.width / size.height;
    perspective.near = 0.1;
    perspective.far = 320;
    perspective.updateProjectionMatrix();
    invalidate();
  }, [invalidate, size.height, size.width]);

  useEffect(() => {
    const render = () => invalidate();
    window.addEventListener(IMMERSION_PROGRESS_EVENT, render);
    return () => {
      window.removeEventListener(IMMERSION_PROGRESS_EVENT, render);
    };
  }, [invalidate]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 100]} near={0.1} far={320} />
      {Array.from({ length: 2 }, (_, index) => (
        <ArchiveFrame key={`archive-frame-${index}`} index={index} progress={progress} />
      ))}
      <group>
        {DEPTH_TEXTURE_PATHS.map((path, index) => (
          <DepthPlane
            key={path}
            index={index}
            progress={progress}
            mobile={mobile}
            texture={textures[index] ?? textures[0]!}
          />
        ))}
      </group>
    </>
  );
}

export default function ImmersionScene({ progress }: Props) {
  return (
    <Canvas
      frameloop="demand"
      dpr={1}
      camera={{ position: [0, 0, 100], near: 0.1, far: 320 }}
      gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color('#2b1d17'), 1);
      }}
    >
      <Rig progress={progress} />
    </Canvas>
  );
}
