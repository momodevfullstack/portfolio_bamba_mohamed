'use client';

import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

type Props = {
  label: string;
  value: number;
  /** Délai après entrée dans le viewport (ms) */
  delayMs?: number;
};

export function AnimatedCircularSkill({ label, value, delayMs = 0 }: Props) {
  const target = Math.min(100, Math.max(0, Math.round(value)));
  const [display, setDisplay] = useState(0);
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(target);
      setEntered(true);
      return;
    }

    let timeoutId: number | undefined;
    let started = false;

    const runAnimation = () => {
      const start = performance.now();
      const duration = 1500;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setDisplay(Math.round(easeOutCubic(t) * target));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(target);
          setEntered(true);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        timeoutId = window.setTimeout(runAnimation, delayMs) as number;
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, delayMs]);

  const degrees = display * 3.6;

  return (
    <article
      ref={ref}
      className="group rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm transition duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg motion-safe:hover:border-teal-200"
    >
      <h3 className="mb-5 text-lg font-bold text-zinc-900 transition-colors group-hover:text-teal-800">{label}</h3>
      <div
        className="relative mx-auto h-[150px] w-[150px] motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out"
        style={{
          transform: entered ? 'scale(1)' : 'scale(0.94)',
        }}
        role="img"
        aria-label={`${label}, niveau ${display} pour cent`}
      >
        <div
          className="absolute inset-0 rounded-full motion-safe:transition-[box-shadow] motion-safe:duration-700"
          style={{
            background: `conic-gradient(rgb(15 118 110) ${degrees}deg, rgb(229 231 235) 0deg)`,
            boxShadow: entered ? '0 0 0 0 rgba(15, 118, 110, 0)' : '0 0 0 8px rgba(15, 118, 110, 0.06)',
          }}
        />
        <div className="absolute inset-[10px] flex items-center justify-center rounded-full bg-white shadow-inner">
          <div
            className={`text-3xl font-bold tabular-nums text-zinc-900 transition-transform duration-300 ${
              entered ? 'motion-safe:scale-100' : 'scale-95'
            }`}
          >
            {display}
            <sup className="ml-0.5 align-top text-sm font-bold text-zinc-600">%</sup>
          </div>
        </div>
      </div>
    </article>
  );
}
