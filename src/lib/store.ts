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
  scrollProgress: number;
  chapterProgress: number;
  isBehindActive: boolean;
  activeProject: 'yuna' | 'mgc' | 'comptoir' | null;
  isIndexOpen: boolean;
  isLoaded: boolean;
  cursorMode: 'default' | 'view' | 'open' | 'front' | 'behind' | 'scroll' | 'drag';
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
  scrollProgress: 0,
  chapterProgress: 0,
  isBehindActive: false,
  activeProject: null,
  isIndexOpen: false,
  isLoaded: false,
  cursorMode: 'default',
  cursorText: undefined,
});
