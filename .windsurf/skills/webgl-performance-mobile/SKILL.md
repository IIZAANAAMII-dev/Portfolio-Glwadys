# WebGL Performance & Mobile Optimization Skill

## Overview
High-performance rendering patterns for mobile devices and battery-constrained laptops to maintain steady 60 FPS.

## Rules
1. **Dynamic Tiering**: Detect GPU tier, battery status, memory constraints, and window width. Automatically fallback to SAFE mode when WebGL is unavailable or on low-end devices.
2. **Texture Optimization**: Use WebP/AVIF images with max resolution capped at 1920x1080 for desktop and 1080x1080 for cards. Avoid loading full 4K textures into WebGL memory.
3. **Geometry Pruning**: Use simple plane geometries (`PlaneGeometry(1, 1, 16, 16)` instead of high-density subdivisions) unless distortion requires vertex mesh deformation.
4. **Visibility Observers**: Pause WebGL render loop (`invalidate()` or `setAnimationLoop(null)`) when tab is inactive or WebGL Canvas is scrolled out of view.
5. **Memory Cleanup**: Explicitly call `.dispose()` on unused textures, geometries, and materials.
