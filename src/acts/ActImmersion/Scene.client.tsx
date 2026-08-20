'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, useTexture } from '@react-three/drei';
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
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += sin(uv.x * 3.14159265) * sin(uv.y * 3.14159265) * uBend;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAGMENT = `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec2 vUv;

  float grain(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec4 texel = texture2D(uMap, vUv);
    float edgeDistance = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float edgeLight = smoothstep(0.0, 0.075, edgeDistance);
    float softKey = mix(0.88, 1.06, 1.0 - vUv.y);
    float fiber = (grain(vUv * 620.0) - 0.5) * 0.018;
    vec3 warm = vec3(0.028, 0.014, 0.004);
    vec3 color = texel.rgb * softKey + warm + fiber;
    color *= mix(0.72, 1.0, edgeLight);
    gl_FragColor = vec4(color, texel.a * uOpacity);
  }
`;

const ASPECTS = [9 / 16, 9 / 16, 1, 16 / 9, 4 / 5, 9 / 16] as const;

const DEPTH_TEXTURE_PATHS = depthMedia.map(({ id, src }) => {
  if (!src) throw new Error(`Missing generated source for immersion media "${id}".`);
  return src;
});

interface PlaneProps {
  index: number;
  progress: MutableRefObject<number>;
  mobile: boolean;
  texture: THREE.Texture;
}

function DepthPlane({ index, progress, mobile, texture }: PlaneProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: texture },
          uOpacity: { value: index === 0 ? 1 : 0 },
          uBend: { value: 0 },
        },
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: true,
      }),
    [index, texture],
  );

  useEffect(
    () => () => {
      material.dispose();
    },
    [material],
  );

  const { size } = useThree();
  const layouts = useMemo<readonly (readonly [number, number, number, number])[]>(
    () => [
      [-0.29, 0.08, 0.32, -12],
      [0.02, 0.18, 0.2, -28],
      [0.3, 0.12, 0.24, -42],
      [-0.16, -0.25, 0.2, 18],
      [0.16, -0.23, 0.28, 4],
      [0.38, -0.2, 0.13, -20],
    ],
    [],
  );

  useFrame(() => {
    const node = mesh.current;
    const layout = layouts[index];
    if (!node || !layout) return;

    const p = progress.current;
    const reveal = THREE.MathUtils.smoothstep(p, 0.04, 0.3);
    const flatten = THREE.MathUtils.smoothstep(p, 0.76, 1);
    const travel = THREE.MathUtils.smoothstep(p, 0.3, 0.74);
    const [nx, ny, nw, depth] = layout;
    const countVisible = mobile ? 4 : 6;

    const targetW = size.width * nw;
    const targetH = targetW / (ASPECTS[index] ?? 4 / 5);
    const startW = size.width * 1.08;
    const startH = startW / ASPECTS[0];

    node.visible = index < countVisible;
    node.position.x = THREE.MathUtils.lerp(index === 0 ? 0 : nx * size.width, nx * size.width, reveal);
    node.position.y = THREE.MathUtils.lerp(index === 0 ? 0 : ny * size.height, ny * size.height, reveal);
    const spreadZ = depth + travel * (index % 2 === 0 ? 20 : 8);
    node.position.z = THREE.MathUtils.lerp(spreadZ, 0, flatten);
    node.rotation.z = THREE.MathUtils.lerp((index - 2.5) * 0.018, 0, flatten);
    node.rotation.x = THREE.MathUtils.lerp((index % 2 === 0 ? 1 : -1) * 0.018, 0, flatten);
    node.rotation.y = THREE.MathUtils.lerp((index - 2.5) * -0.012, 0, flatten);

    const width = index === 0 ? THREE.MathUtils.lerp(startW, targetW, reveal) : targetW;
    const height = index === 0 ? THREE.MathUtils.lerp(startH, targetH, reveal) : targetH;
    node.scale.set(width, height, 1);

    const liveMaterial = materialRef.current;
    if (!liveMaterial) return;
    liveMaterial.uniforms.uOpacity!.value = index === 0 ? 1 : reveal;
    const wave = Math.sin(Math.PI * THREE.MathUtils.clamp((p - 0.34) / 0.48, 0, 1));
    liveMaterial.uniforms.uBend!.value = mobile ? 0 : wave * 9;
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1, 1, 24, 24]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
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
    const paperReveal = THREE.MathUtils.smoothstep(progress.current, 0.8, 1);
    backdrop.lerpColors(wood, ivory, paperReveal);
    gl.setClearColor(backdrop, 1);
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
    setDpr(mobile ? 1 : Math.min(window.devicePixelRatio, 2));
  }, [mobile, setDpr]);

  useLayoutEffect(() => {
    const perspective = cameraRef.current;
    if (!perspective) return;
    const distance = 100;
    perspective.position.set(0, 0, distance);
    perspective.fov = 2 * Math.atan(size.height / 2 / distance) * (180 / Math.PI);
    perspective.aspect = size.width / size.height;
    perspective.near = 0.1;
    perspective.far = 300;
    perspective.updateProjectionMatrix();
    invalidate();
  }, [invalidate, size.height, size.width]);

  useEffect(() => {
    const render = () => invalidate();
    window.addEventListener(IMMERSION_PROGRESS_EVENT, render);
    return () => window.removeEventListener(IMMERSION_PROGRESS_EVENT, render);
  }, [invalidate]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 100]} near={0.1} far={300} />
      <group>
        {Array.from({ length: 6 }, (_, index) => (
          <DepthPlane
            key={DEPTH_TEXTURE_PATHS[index]}
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
      camera={{ position: [0, 0, 100], near: 0.1, far: 300 }}
      gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color('#2b1d17'), 1);
      }}
    >
      <Rig progress={progress} />
    </Canvas>
  );
}
