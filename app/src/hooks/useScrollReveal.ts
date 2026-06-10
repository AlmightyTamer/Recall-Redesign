import { useEffect } from 'react';

/**
 * Adds .revealed to all .scroll-reveal elements as they enter the viewport.
 * Call once in any scrollable container that contains .scroll-reveal elements.
 */
export function useScrollReveal(dep?: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.scroll-reveal');
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('revealed');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el, i) => {
      // stagger delay via inline style
      el.style.animationDelay = `${i * 0.06}s`;
      io.observe(el);
    });

    return () => io.disconnect();
  }, [dep]);
}
