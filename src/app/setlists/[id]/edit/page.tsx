"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Setlist } from "@/lib/types";
import { SetlistForm } from "@/components/SetlistForm";

export default function EditSetlistPage() {
  const { id } = useParams<{ id: string }>();
  const [setlist, setSetlist] = useState<Setlist | null>(null);

  useEffect(() => {
    fetch(`/api/setlists/${id}`)
      .then((r) => r.json())
      .then(setSetlist);
  }, [id]);

  if (!setlist) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit setlist</h1>
      <SetlistForm setlist={setlist} />
    </div>
  );
}
