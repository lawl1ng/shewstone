import Link from "next/link";
import type { Song } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

export function SongCard({ song }: { song: Song }) {
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
      </div>
    </Link>
  );
}
