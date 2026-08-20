'use client';

/**
 * Point d'entrée GSAP unique.
 * Les plugins sont enregistrés une seule fois pour tout le projet : les
 * enregistrements dispersés sont une source classique de doublons.
 *
 * Flip, SplitText et ScrollTrigger font partie du paquet npm public depuis
 * GSAP 3.13 — aucune licence requise.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, Flip, SplitText, useGSAP);

/**
 * Défauts du site : toute animation part de la grammaire, pas des défauts GSAP.
 * `overwrite: 'auto'` évite que deux timelines se disputent la même propriété
 * lors d'un scroll rapide dans les deux sens.
 */
gsap.defaults({ ease: 'power3.out', duration: 0.6, overwrite: 'auto' });

export { gsap, ScrollTrigger, Flip, SplitText, useGSAP };
