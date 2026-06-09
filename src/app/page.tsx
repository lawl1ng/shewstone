"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Song, SongStatus } from "@/lib/types";
import { SongCard } from "@/components/SongCard";

type FilterStatus = SongStatus | "ALL";
type SortOption = "recent" | "title" | "readiness";

const tabs: { label: string; value: FilterStatus; dot?: string }[] = [
  { label: "All", value: "ALL" },
  { label: "Needs Work", value: "NEEDS_WORK", dot: "bg-red-500" },
  { label: "Getting There", value: "GETTING_THERE", dot: "bg-amber-400" },
  { label: "Performance Ready", value: "PERFORMANCE_READY", dot: "bg-green-500" },
];

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Recent", value: "recent" },
  { label: "A–Z", value: "title" },
  { label: "Readiness", value: "readiness" },
];

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [sort, setSort] = useState<SortOption>("recent");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== "ALL") params.set("status", filter);
    if (search) params.set("search", search);
    if (sort !== "recent") params.set("sort", sort);

    fetch(`/api/songs?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, filter, sort]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Songs</h1>
        <Link
          href="/songs/new"
          className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          + Add song
        </Link>
      </div>

      <input
        type="search"
        placeholder="Search songs…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
      />

      <div className="flex flex-wrap gap-2 mb-3">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === tab.value
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            {tab.dot && <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-neutral-400 dark:text-neutral-500 mr-1">Sort:</span>
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSort(opt.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              sort === opt.value
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : songs.length === 0 ? (
        <p className="text-neutral-500 text-sm">
          {search || filter !== "ALL"
            ? "No songs match your search."
            : "No songs yet. Add your first one!"}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}
