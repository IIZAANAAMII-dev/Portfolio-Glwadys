# React Three Fiber (R3F) Skill

## Overview
React Three Fiber (R3F) connects Three.js with React's declarative component model, state handling, Suspense boundary asset loading, and ecosystem helpers (Drei, Drei/Postprocessing).

## Rules & Best Practices
1. **Never trigger React state updates per frame**: Do NOT call `setState()` inside `useFrame()`. Use mutable refs (`meshRef.current.position.y += ...`) to update 3D properties directly on the Three.js scene graph.
2. **Persistent Canvas Architecture**: Keep one single `<Canvas>` mounted at root layout level. Route changes or chapter progression must NOT unmount/remount the WebGL context.
3. **Suspense & Preload**: Use `useTexture.preload()` and Suspense boundaries gracefully so media textures stream into the scene without hitching the main thread.
4. **Adaptive Performance**: Use `dpr={[1, 1.8]}` with performance monitors (`drei/PerformanceMonitor`) to scale resolution down if frame rate dips below 55 FPS.
5. **DOM / 3D Alignment**: Use `useThree()` viewport calculation to convert viewport pixels to Three.js units: `const { width, height } = useThree((state) => state.viewport)`.

## Core Implementation Pattern
```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function PersistentStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        {children}
      </Canvas>
    </div>
  );
}
```
