import type { RefObject } from 'react';

export interface SharedStoryRefs {
  mask: RefObject<HTMLDivElement | null>;
  plane: RefObject<HTMLDivElement | null>;
}

export interface StoryRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function rectFromElement(element: HTMLElement): StoryRect {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

export function storyRectForPhone(isDesktop: boolean): StoryRect {
  const width = isDesktop
    ? Math.min(window.innerWidth * 0.22, 17 * 16)
    : Math.min(window.innerWidth * 0.58, 16 * 16);
  const height = width * (16 / 9);

  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
  };
}

export function storyRectForPhoneScreen(isDesktop: boolean): StoryRect {
  const deviceWidth = isDesktop
    ? Math.min(window.innerWidth * 0.22, 17 * 16)
    : Math.min(window.innerWidth * 0.58, 16 * 16);
  const deviceHeight = deviceWidth * (19.5 / 9);
  const bezel = isDesktop ? 10 : 8;
  const border = 1;
  const inset = bezel + border;

  return {
    left: (window.innerWidth - deviceWidth) / 2 + inset,
    top: (window.innerHeight - deviceHeight) / 2 + inset,
    width: deviceWidth - inset * 2,
    height: deviceHeight - inset * 2,
  };
}

export function viewportClip(rect: StoryRect, radius = 0): string {
  const top = Math.max(0, rect.top);
  const right = Math.max(0, window.innerWidth - rect.left - rect.width);
  const bottom = Math.max(0, window.innerHeight - rect.top - rect.height);
  const left = Math.max(0, rect.left);
  const rounding = radius > 0 ? ` round ${radius}px` : '';
  return `inset(${top}px ${right}px ${bottom}px ${left}px${rounding})`;
}
