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

/* `useGSAP` est un hook React, pas un plugin GSAP : le passer à
   registerPlugin() est sans effet et masque les vraies erreurs
   d'enregistrement. Il est simplement réexporté. */
gsap.registerPlugin(ScrollTrigger, Flip, SplitText);

/**
 * Aucun `ease` ni `duration` global : les timelines scrubées au scroll doivent
 * rester en `ease: 'none'`, et un défaut global se glisse dans les tweens qui
 * n'en déclarent pas — c'est ce qui produisait des décrochages au scroll rapide.
 * Seul `overwrite: 'auto'` est un défaut sain : il évite que deux timelines se
 * disputent la même propriété quand on scrolle dans les deux sens.
 */
gsap.defaults({ overwrite: 'auto' });

export { gsap, ScrollTrigger, Flip, SplitText, useGSAP };
