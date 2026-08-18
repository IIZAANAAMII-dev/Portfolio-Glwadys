'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { appStore } from '../lib/store';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [cursorState, setCursorState] = useState(() => ({
    mode: appStore.getState().cursorMode,
    text: appStore.getState().cursorText,
    enable: appStore.getState().quality.enableCustomCursor,
  }));

  useEffect(() => {
    const unsub = appStore.subscribe((state) => {
      setCursorState({
        mode: state.cursorMode,
        text: state.cursorText,
        enable: state.quality.enableCustomCursor,
      });
    });

    const onMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.18,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      unsub();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  if (!cursorState.enable) return null;

  const isExpanded = cursorState.mode !== 'default';

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center transition-all duration-300"
      style={{
        width: isExpanded ? '84px' : '14px',
        height: isExpanded ? '84px' : '14px',
        borderRadius: '50%',
        background: isExpanded
          ? 'rgba(216, 194, 157, 0.22)'
          : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: isExpanded ? 'blur(8px)' : 'none',
        border: isExpanded ? '1px solid rgba(216, 194, 157, 0.6)' : 'none',
      }}
    >
      {isExpanded && (
        <span
          ref={textRef}
          className="font-mono-tag text-[9px] text-[#f5f3ef] font-semibold tracking-wider text-center px-1 select-none"
        >
          {cursorState.text || cursorState.mode.toUpperCase()}
        </span>
      )}
    </div>
  );
}
