# Three.js & WebGL Skill

## Overview
Three.js provides low-level, high-performance rendering for 3D coordinate spaces, custom GLSL shaders, camera rigs, dynamic render targets, instanced geometry, and perspective media planes.

## Key Rules & Performance Invariants
1. **Never allocate objects in the render loop**: Pre-allocate `Vector3`, `Quaternion`, `Matrix4`, `Euler`, and color objects outside the tick loop (`useFrame` or `requestAnimationFrame`).
2. **Resource Lifecycle & Disposal**: Dispose of geometries (`geometry.dispose()`), materials (`material.dispose()`), textures (`texture.dispose()`), and WebGLRenderTargets when unmounted.
3. **PixelRatio Clamping**: Always clamp device pixel ratio between `1.0` and `2.0` (`Math.min(window.devicePixelRatio, 1.75)` or `[1, 1.5]` on mobile) to protect GPUs from 4K/Retina thermal throttling.
4. **Color Management**: Use `THREE.SRGBColorSpace` (modern Three.js default) with tone mapping (`THREE.ACESFilmicToneMapping` or `THREE.AgXToneMapping`) for cinematic color reproduction.
5. **Instancing for Multi-Elements**: Use `THREE.InstancedMesh` for repeated cards, particles, or grid cells to reduce draw calls from 100+ to 1.
6. **Frustum Culling**: Ensure bounding spheres and boxes are correct so off-screen 3D media planes are immediately culled.

## Core Patterns
### 1. MediaPlane with Aspect Ratio Preservation
```glsl
// Custom Shader vertex / fragment preserving cover sizing
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform sampler2D uTexture;
varying vec2 vUv;

vec2 getCoverUv(vec2 uv, vec2 planeRes, vec2 texRes) {
  vec2 s = planeRes;
  vec2 i = texRes;
  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
  vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
  return uv * s / new + offset;
}
```

### 2. Camera Rig Spatial Lerping
```typescript
class CameraRigController {
  public targetPos = new THREE.Vector3(0, 0, 10);
  public currentPos = new THREE.Vector3(0, 0, 10);
  public targetLookAt = new THREE.Vector3(0, 0, 0);
  public currentLookAt = new THREE.Vector3(0, 0, 0);

  update(delta: number) {
    const factor = 1.0 - Math.exp(-delta * 4.5);
    this.currentPos.lerp(this.targetPos, factor);
    this.currentLookAt.lerp(this.targetLookAt, factor);
  }
}
```
