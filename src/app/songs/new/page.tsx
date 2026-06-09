"use client";

import { SongForm } from "@/components/SongForm";

export default function NewSongPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add song</h1>
      <SongForm />
    </div>
  );
}
