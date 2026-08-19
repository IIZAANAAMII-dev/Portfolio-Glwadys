'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { appStore, SpatialCameraState } from '../lib/store';

export function CameraRig() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 14));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));
  const targetFov = useRef(48);

  useEffect(() => {
    const unsub = appStore.subscribe((state) => {
      const cam = state.camera;
      targetPos.current.set(cam.x, cam.y, cam.z);
      targetLook.current.set(cam.lookAtX, cam.lookAtY, cam.lookAtZ);
      targetFov.current = cam.fov;
    });
    return () => {
      unsub();
    };
  }, []);

  useFrame((_, delta) => {
    const quality = appStore.getState().quality;
    // Camera must follow the scroll story, not trail behind it.
    const lerpFactor = quality.tier === 'MEDIUM' ? 0.2 : 0.16;
    const factor = 1.0 - Math.exp(-delta * (lerpFactor * 60));

    camera.position.lerp(targetPos.current, factor);
    currentLook.current.lerp(targetLook.current, factor);
    camera.lookAt(currentLook.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      if (Math.abs(camera.fov - targetFov.current) > 0.1) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov.current, factor);
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
