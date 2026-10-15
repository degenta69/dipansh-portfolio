'use client';

import { useEffect } from 'react';

/**
 * Copies the visible preview into a polite live region on hover or focus.
 * The cards themselves are CSS, so they still appear when this does not run.
 */
export default function SystemsMapEnhancer() {
  useEffect(() => {
    const root = document.querySelector('.systems-map');
    const live = document.getElementById('systems-map-live');
    if (!root || !live) return;

    const announce = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const node = target.closest('[data-node]');
      if (!node || !root.contains(node)) return;
      const id = node.getAttribute('data-node');
      const card = root.querySelector(`[data-preview="${id}"]`);
      const text = card?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      if (text && live.textContent !== text) live.textContent = text;
    };

    root.addEventListener('focusin', announce);
    root.addEventListener('mouseover', announce);
    return () => {
      root.removeEventListener('focusin', announce);
      root.removeEventListener('mouseover', announce);
    };
  }, []);

  return null;
}
