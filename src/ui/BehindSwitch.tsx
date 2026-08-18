'use client';

import { useState, useEffect } from 'react';
import { appStore } from '../lib/store';
import { Eye, Layers } from 'lucide-react';

export function BehindSwitch({ locale }: { locale: string }) {
  const [isBehind, setIsBehind] = useState(false);

  useEffect(() => {
    const unsub = appStore.subscribe((state) => {
      setIsBehind(state.isBehindActive);
    });
    return () => {
      unsub();
    };
  }, []);

  const toggle = () => {
    appStore.setState({ isBehindActive: !isBehind });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={toggle}
        className={`glass-panel px-4 py-2.5 rounded-full flex items-center gap-2.5 text-xs font-mono transition-all duration-500 shadow-2xl cursor-pointer ${
          isBehind
            ? 'bg-accent-gold text-background-dark font-bold border-accent-gold'
            : 'text-foreground-light hover:border-accent-gold/50'
        }`}
        aria-label="Toggle Behind The Scenes"
      >
        {isBehind ? (
          <>
            <Layers className="w-4 h-4 text-background-dark animate-pulse" />
            <span>BEHIND : STRATÉGIE ACTIVE</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 text-accent-gold" />
            <span>FRONT : CONTENU FINAL</span>
          </>
        )}
      </button>
    </div>
  );
}
