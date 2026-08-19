import { QualityConfig, detectQuality } from './quality';

export type Chapter =
  | 'intro'
  | 'hero'
  | 'identity'
  | 'social'
  | 'gallery'
  | 'brand'
  | 'strategy'
  | 'about'
  | 'journey'
  | 'work'
  | 'services'
  | 'experience'
  | 'contact';

export interface AppState {
  currentChapter: Chapter;
  isLoaded: boolean;
  isIndexOpen: boolean;
  isBehindActive: boolean;
  quality: QualityConfig;
  cursorMode: 'default' | 'view' | 'open';
  cursorText?: string;
}

type Listener<T> = (state: T) => void;

class StateStore<T> {
  private state: T;
  private listeners: Set<Listener<T>> = new Set();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(partial: Partial<T> | ((prev: T) => Partial<T>)) {
    const next = typeof partial === 'function' ? partial(this.state) : partial;
    this.state = { ...this.state, ...next };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener<T>) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const appStore = new StateStore<AppState>({
  currentChapter: 'intro',
  isLoaded: false,
  isIndexOpen: false,
  isBehindActive: false,
  quality: detectQuality(),
  cursorMode: 'default',
  cursorText: undefined,
});
