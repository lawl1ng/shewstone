"use client";

import { useEffect, useRef, useState } from "react";

export function AutoScroll() {
  const [active, setActive] = useState(false);
  const [speed, setSpeed] = useState(4);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    let lastTime: number | null = null;

    function step(time: number) {
      if (lastTime !== null) {
        const dt = time - lastTime;
        const pxPerSecond = speed * 15;
        window.scrollBy(0, (pxPerSecond * dt) / 1000);

        const atBottom =
          window.innerHeight + window.scrollY >= document.body.scrollHeight - 1;
        if (atBottom) {
          setActive(false);
          return;
        }
      }
      lastTime = time;
      frameRef.current = requestAnimationFrame(step);
    }

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active, speed]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900/90 dark:bg-white/90 text-white dark:text-neutral-900 shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={() => setActive((a) => !a)}
        className="text-sm font-medium hover:opacity-80 transition-opacity"
      >
        {active ? "⏸ Pause" : "▶ Autoscroll"}
      </button>
      <input
        type="range"
        min={1}
        max={10}
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
        className="w-24 accent-current"
        aria-label="Scroll speed"
      />
    </div>
  );
}
