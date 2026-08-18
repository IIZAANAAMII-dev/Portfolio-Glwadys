import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { appStore } from '../lib/store';
import { CAMERA_PRESETS } from '../config/spatial';

export class MasterTimelineManager {
  private static registered = false;

  public static init() {
    if (typeof window === 'undefined') return;
    if (!this.registered) {
      gsap.registerPlugin(ScrollTrigger);
      this.registered = true;
    }
  }

  public static updateCamera(
    props: Partial<{
      x: number;
      y: number;
      z: number;
      lookAtX: number;
      lookAtY: number;
      lookAtZ: number;
      fov: number;
      rotX: number;
      rotY: number;
      rotZ: number;
    }>
  ) {
    const current = appStore.getState().camera;
    appStore.setState({
      camera: {
        ...current,
        ...props,
      },
    });
  }

  public static setChapter(chapter: import('../lib/store').Chapter) {
    if (appStore.getState().currentChapter !== chapter) {
      appStore.setState({ currentChapter: chapter });
    }
  }
}
