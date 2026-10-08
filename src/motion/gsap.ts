'use client';

import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// A single plugin boundary. Scrolling remains the browser's responsibility.
gsap.registerPlugin(ScrollTrigger, Flip);

export { gsap, Flip, ScrollTrigger };
