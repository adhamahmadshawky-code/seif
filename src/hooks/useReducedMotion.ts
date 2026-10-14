import { useEffect, useState } from 'react';

// Mirrors the prefers-reduced-motion media query in JS so effects that are
// driven by state (typewriter, auto-advance, progress) can also be tamed,
// not just CSS animations.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}
