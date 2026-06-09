"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Setlist } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SetlistsPage() {
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/setlists")
      .then((r) => r.json())
      .then((data) => {
        setSetlists(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Setlists</h1>
        <Link
          href="/setlists/new"
          className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          + New setlist
        </Link>
      </div>

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : setlists.length === 0 ? (
        <p className="text-neutral-500 text-sm">No setlists yet. Create your first one!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {setlists.map((setlist) => (
            <Link
              key={setlist.id}
              href={`/setlists/${setlist.id}`}
              className="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <h2 className="font-semibold">{setlist.title}</h2>
              {setlist.date && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {formatDate(setlist.date)}
                </p>
              )}
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                {(setlist.songs?.length ?? 0)} song{(setlist.songs?.length ?? 0) !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
