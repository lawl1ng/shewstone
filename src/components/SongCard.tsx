import Link from "next/link";
import type { Song } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

function formatRelative(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "Practiced today";
  if (days === 1) return "Practiced yesterday";
  if (days < 7) return `Practiced ${days}d ago`;
  if (days < 30) return `Practiced ${Math.floor(days / 7)}w ago`;
  return `Practiced ${Math.floor(days / 30)}mo ago`;
}

export function SongCard({ song }: { song: Song }) {
  const lastPracticed = song.practiceNotes?.[0]?.createdAt;

  return (
    <Link
      href={`/songs/${song.id}`}
      className="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold truncate">{song.title}</h2>
        </div>
        <StatusBadge status={song.status} />
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
        {song.bpm && <span>{song.bpm} BPM</span>}
        {song.key && <span>Key: {song.key}</span>}
        {song.capo && <span>Capo {song.capo}</span>}
        {song.tuning && <span>{song.tuning}</span>}
        {song.duration && (
          <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}</span>
        )}
        {lastPracticed && <span>{formatRelative(lastPracticed)}</span>}
      </div>
    </Link>
  );
}
