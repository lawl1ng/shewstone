"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Song } from "@/lib/types";
import { SongForm } from "@/components/SongForm";

export default function EditSongPage() {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    fetch(`/api/songs/${id}`)
      .then((r) => r.json())
      .then(setSong);
  }, [id]);

  if (!song) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit song</h1>
      <SongForm song={song} />
    </div>
  );
}
