import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { appStore } from '../lib/store';

export class MasterTimelineManager {
  private static registered = false;

  public static init() {
    if (typeof window === 'undefined') return;
    if (!this.registered) {
      gsap.registerPlugin(ScrollTrigger);
      this.registered = true;
    }
  }

  public static setChapter(chapter: import('../lib/store').Chapter) {
    if (appStore.getState().currentChapter !== chapter) {
      appStore.setState({ currentChapter: chapter });
    }
  }
}
