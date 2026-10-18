import { useLayoutEffect, useRef } from 'react';

// FLIP only moved rows; persisted order and keyboard focus stay untouched.
export default function useListMotion() {
  const container = useRef(null), positions = useRef(new Map());
  useLayoutEffect(() => {
    const rows = [...(container.current?.querySelectorAll('[data-motion-id]') || [])];
    const next = new Map(rows.map(row => [row.dataset.motionId, { top: row.offsetTop }]));
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) rows.forEach(row => {
      const before = positions.current.get(row.dataset.motionId), after = next.get(row.dataset.motionId);
      if (!before || !after || Math.abs(before.top - after.top) < 2) return;
      row.getAnimations().forEach(animation => animation.cancel());
      row.animate([{ transform: `translateY(${before.top - after.top}px)` }, { transform: 'translateY(0)' }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
    });
    positions.current = next;
  });
  return container;
}
