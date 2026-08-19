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
    <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40">
      <button
        onClick={toggle}
        className={`glass-panel px-3 py-2 rounded-full flex items-center gap-2 text-[10px] md:text-xs font-mono transition-all duration-500 shadow-2xl cursor-pointer ${
          isBehind
            ? 'bg-accent-gold text-background-dark font-bold border-accent-gold'
            : 'text-foreground-light hover:border-accent-gold/50'
        }`}
        aria-label="Toggle Behind The Scenes"
      >
        {isBehind ? (
          <>
            <Layers className="w-3.5 h-3.5 text-background-dark" />
            <span className="hidden sm:inline">BEHIND</span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5 text-accent-gold" />
            <span className="hidden sm:inline">FRONT</span>
          </>
        )}
      </button>
    </div>
  );
}
