'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Retourne `true` si l'utilisateur demande une réduction du mouvement.
 *
 * Volontairement `false` au premier rendu (SSR et hydratation) puis corrigé en
 * effet : cela garantit un markup serveur/client identique. Les composants qui
 * en dépendent doivent donc *retirer* du mouvement quand la valeur passe à
 * `true`, jamais ajouter du contenu.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(QUERY);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
