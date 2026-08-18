'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { appStore, Chapter } from '../lib/store';

export type SceneId = 'opening' | 'social' | 'gallery' | 'work';

const SCENE_BY_CHAPTER: Record<Chapter, SceneId> = {
  intro: 'opening', hero: 'opening', identity: 'opening',
  social: 'social', gallery: 'gallery',
  brand: 'gallery', strategy: 'gallery', about: 'gallery',
  journey: 'work', work: 'work', services: 'work', experience: 'work', contact: 'work',
};

interface DirectorState {
  chapter: Chapter;
  scene: SceneId;
  progress: number;
}

const DirectorContext = createContext<DirectorState | null>(null);

export function SceneDirector({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DirectorState>(() => {
    const current = appStore.getState();
    return { chapter: current.currentChapter, scene: SCENE_BY_CHAPTER[current.currentChapter], progress: current.chapterProgress };
  });

  useEffect(() => appStore.subscribe((current) => {
    setState({ chapter: current.currentChapter, scene: SCENE_BY_CHAPTER[current.currentChapter], progress: current.chapterProgress });
  }), []);

  const value = useMemo(() => state, [state]);
  return <DirectorContext.Provider value={value}>{children}</DirectorContext.Provider>;
}

export function SceneLayer({ scene, children }: { scene: SceneId; children: React.ReactNode }) {
  const director = useContext(DirectorContext);
  return <group visible={director?.scene === scene}>{children}</group>;
}

export function useSceneDirector() {
  return useContext(DirectorContext);
}
