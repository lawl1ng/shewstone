"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { PracticeSession } from "@/lib/types";
import { SessionForm } from "@/components/SessionForm";

export default function EditSessionPage() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data: PracticeSession[]) => {
        setSession(data.find((s) => s.id === id) ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;
  if (!session) return <p className="text-sm text-neutral-500">Session not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit session</h1>
      <SessionForm session={session} />
    </div>
  );
}
