"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SectionReorder({
  songId,
  sectionId,
  isFirst,
  isLast,
}: {
  songId: string;
  sectionId: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function move(direction: "up" | "down") {
    setBusy(true);
    await fetch(`/api/songs/${songId}/sections/${sectionId}/order`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex gap-1">
      <button
        type="button"
        disabled={isFirst || busy}
        onClick={() => move("up")}
        className="w-6 h-6 flex items-center justify-center rounded text-xs border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        disabled={isLast || busy}
        onClick={() => move("down")}
        className="w-6 h-6 flex items-center justify-center rounded text-xs border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Move down"
      >
        ↓
      </button>
    </div>
  );
}
