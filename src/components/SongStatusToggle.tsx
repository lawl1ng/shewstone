"use client";

import { useState } from "react";
import type { SongStatus } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

const CYCLE: SongStatus[] = ["NEEDS_WORK", "GETTING_THERE", "PERFORMANCE_READY"];

export function SongStatusToggle({
  songId,
  initialStatus,
}: {
  songId: string;
  initialStatus: SongStatus;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    const next = CYCLE[(CYCLE.indexOf(status) + 1) % CYCLE.length];
    setStatus(next);
    setPending(true);
    try {
      await fetch(`/api/songs/${songId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="disabled:opacity-60 transition-opacity"
      title="Tap to change readiness"
    >
      <StatusBadge status={status} alwaysShowLabel />
    </button>
  );
}
