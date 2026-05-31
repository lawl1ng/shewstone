"use client";

import { useState } from "react";
import type { Section } from "@/lib/types";

type Tab = "lyrics" | "chords" | "bassTab" | "notes";

const TABS: { key: Tab; label: string }[] = [
  { key: "lyrics", label: "Lyrics" },
  { key: "chords", label: "Chords" },
  { key: "bassTab", label: "Bass Tab" },
  { key: "notes", label: "Notes" },
];

export function SectionTabs({ section }: { section: Section }) {
  const [active, setActive] = useState<Tab>("lyrics");
  const content = section[active];

  return (
    <div>
      <div className="flex gap-1 border-b border-neutral-200 dark:border-neutral-700 mb-3">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
              active === key
                ? "border border-b-0 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white -mb-px"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {content ? (
        <pre
          className={`font-mono text-sm leading-relaxed overflow-x-auto ${
            active === "bassTab" ? "whitespace-pre" : "whitespace-pre-wrap"
          }`}
        >
          {content}
        </pre>
      ) : (
        <p className="text-sm text-neutral-400 dark:text-neutral-500">—</p>
      )}
    </div>
  );
}
