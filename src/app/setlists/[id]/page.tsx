"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Setlist, SetlistSong, Song } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SetlistPage() {
  const { id } = useParams<{ id: string }>();
  const [setlist, setSetlist] = useState<Setlist | null>(null);
  const [entries, setEntries] = useState<SetlistSong[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [addSongId, setAddSongId] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/setlists/${id}`).then((r) => r.json()),
      fetch("/api/songs").then((r) => r.json()),
    ]).then(([sl, songs]) => {
      setSetlist(sl);
      setEntries(sl.songs ?? []);
      setAllSongs(songs);
      setLoading(false);
    });
  }, [id]);

  const addedSongIds = new Set(entries.map((e) => e.songId));
  const availableSongs = allSongs.filter((s) => !addedSongIds.has(s.id));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addSongId) return;
    setAdding(true);

    const res = await fetch(`/api/setlists/${id}/songs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId: addSongId }),
    });

    if (res.ok) {
      const entry: SetlistSong = await res.json();
      setEntries((prev) => [...prev, entry]);
      setAddSongId("");
    }
    setAdding(false);
  }

  async function handleRemove(entryId: string) {
    await fetch(`/api/setlists/${id}/songs/${entryId}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  }

  async function handleMove(entryId: string, direction: "up" | "down") {
    await fetch(`/api/setlists/${id}/songs/${entryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });

    const res = await fetch(`/api/setlists/${id}`);
    const sl = await res.json();
    setEntries(sl.songs ?? []);
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;
  if (!setlist) return <p className="text-sm text-neutral-500">Setlist not found.</p>;

  return (
    <div>
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{setlist.title}</h1>
          {setlist.date && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {formatDate(setlist.date)}
            </p>
          )}
        </div>
        <Link
          href={`/setlists/${id}/edit`}
          className="shrink-0 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          Edit
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-6">No songs yet.</p>
      ) : (
        <ol className="flex flex-col gap-2 mb-6">
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <span className="text-sm text-neutral-400 dark:text-neutral-500 w-5 shrink-0 text-right">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/songs/${entry.songId}`}
                  className="font-medium text-sm hover:underline truncate block"
                >
                  {entry.song?.title ?? entry.songId}
                </Link>
                {entry.song && (
                  <div className="flex items-center gap-3 mt-0.5">
                    <StatusBadge status={entry.song.status} />
                    {entry.song.key && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {entry.song.key}
                      </span>
                    )}
                    {entry.song.bpm && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {entry.song.bpm} BPM
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleMove(entry.id, "up")}
                  disabled={index === 0}
                  className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMove(entry.id, "down")}
                  disabled={index === entries.length - 1}
                  className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => handleRemove(entry.id)}
                  className="ml-1 p-1 rounded text-neutral-400 hover:text-red-500 transition-colors text-sm"
                  aria-label="Remove from setlist"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      {availableSongs.length > 0 && (
        <form onSubmit={handleAdd} className="flex gap-2 mb-8">
          <select
            value={addSongId}
            onChange={(e) => setAddSongId(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <option value="">Add a song…</option>
            {availableSongs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={adding || !addSongId}
            className="px-4 py-2 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600 text-sm text-neutral-600 dark:text-neutral-400 hover:border-neutral-500 dark:hover:border-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-40 transition-colors"
          >
            Add
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <Link
          href="/setlists"
          className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          ← Back to setlists
        </Link>
      </div>
    </div>
  );
}
