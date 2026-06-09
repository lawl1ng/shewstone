"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PracticeSession } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this session?")) return;
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Practice Sessions</h1>
        <Link
          href="/sessions/new"
          className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          + Log session
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-neutral-500">No sessions logged yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{formatDate(s.date)}</p>
                  {s.attendees && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {s.attendees}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/sessions/${s.id}/edit`}
                    className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {s.notes && (
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                  {s.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
