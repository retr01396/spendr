import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref to attach to a DOM element and a boolean `isVisible`.
 * When `isVisible` becomes true the element has entered the viewport.
 * Respects prefers-reduced-motion: if the user prefers reduced motion
 * the element is considered visible immediately so it never hides.
 */
export function useScrollAnimation(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -60px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
