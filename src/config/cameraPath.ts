import { CAMERA_PRESETS } from './spatial';
import type { Chapter } from '../lib/store';

/** One camera language for the whole experience. Sections may interpolate within a leg,
 * but they should never invent a new camera coordinate system. */
type CameraPreset = (typeof CAMERA_PRESETS)[keyof typeof CAMERA_PRESETS];

export const CAMERA_PATH: Record<Chapter, { start: CameraPreset; end: CameraPreset }> = {
  intro: { start: CAMERA_PRESETS.intro, end: CAMERA_PRESETS.hero },
  hero: { start: CAMERA_PRESETS.hero, end: CAMERA_PRESETS.identity },
  identity: { start: CAMERA_PRESETS.identity, end: CAMERA_PRESETS.social },
  social: { start: CAMERA_PRESETS.social, end: CAMERA_PRESETS.phoneDive },
  gallery: { start: CAMERA_PRESETS.gallery, end: CAMERA_PRESETS.brand },
  brand: { start: CAMERA_PRESETS.brand, end: CAMERA_PRESETS.strategy },
  strategy: { start: CAMERA_PRESETS.strategy, end: CAMERA_PRESETS.finalCallback },
  about: { start: CAMERA_PRESETS.finalCallback, end: CAMERA_PRESETS.finalCallback },
  journey: { start: CAMERA_PRESETS.constellation, end: CAMERA_PRESETS.constellation },
  work: { start: CAMERA_PRESETS.constellation, end: CAMERA_PRESETS.constellation },
  services: { start: CAMERA_PRESETS.finalCallback, end: CAMERA_PRESETS.finalCallback },
  experience: { start: CAMERA_PRESETS.finalCallback, end: CAMERA_PRESETS.finalCallback },
  contact: { start: CAMERA_PRESETS.finalCallback, end: CAMERA_PRESETS.finalCallback },
};
