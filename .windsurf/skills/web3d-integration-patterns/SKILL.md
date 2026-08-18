# Web 3D Integration Patterns Skill

## Overview
Defines how DOM typography, GSAP ScrollTrigger, Lenis smooth scrolling, and 3D WebGL scenes synchronize in a single seamless narrative environment.

## Integration Architecture
1. **The Director (GSAP ScrollTrigger)**:
   - Watches native or Lenis scroll progress.
   - Updates reactive motion proxies and timeline parameters.
2. **The Coordinate Stage (Three.js / R3F)**:
   - Synchronizes camera position (X, Y, Z, FOV, lookAt) and 3D media planes based on GSAP scroll progress.
   - Lerps spatial coordinates smoothly in the render loop.
3. **The Semantic Surface (DOM)**:
   - Renders typography, readable paragraphs, navigation, screen-reader text, glass overlays, and interactive buttons.
   - Synchronizes CSS transforms (`translate3d`, `opacity`, `clip-path`) with the 3D planes.

## Shared Transition Pattern (DOM to 3D)
- On trigger, the DOM element fades out as the 3D plane scales from matching screen bounding box into full 3D space (`getBoundingClientRect()` mapped to WebGL viewport units).
- Reverse transition collapses the 3D plane back to the exact DOM bounding rect coordinates.

## Quality Fallback Contract
- **HIGH**: Full WebGL camera movements, 3D smartphone dive, custom GLSL distortion shaders, postprocessing noise/vignette.
- **MEDIUM**: Simplified shaders, clamped DPR = 1.0-1.2, reduced plane counts, no heavy postprocessing.
- **SAFE**: Canvas completely disabled. All motion executed purely with CSS transforms and lightweight GSAP, ensuring zero WebGL crashes on constrained mobile browsers.
