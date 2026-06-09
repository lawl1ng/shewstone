"use client";

import { useState } from "react";
import type { PracticeNote } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PracticeNotes({
  songId,
  initialNotes,
}: {
  songId: string;
  initialNotes: PracticeNote[];
}) {
  const [notes, setNotes] = useState<PracticeNote[]>(initialNotes);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSaving(true);

    const res = await fetch(`/api/songs/${songId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: draft.trim() }),
    });

    if (res.ok) {
      const note: PracticeNote = await res.json();
      setNotes((prev) => [note, ...prev]);
      setDraft("");
    }
    setSaving(false);
  }

  async function handleDelete(noteId: string) {
    await fetch(`/api/songs/${songId}/notes/${noteId}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }

  return (
    <section>
      <h2 className="text-base font-semibold mb-3">Practice notes</h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a note…"
          className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
        <button
          type="submit"
          disabled={saving || !draft.trim()}
          className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 disabled:opacity-40 transition-opacity"
        >
          Add
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-neutral-400 dark:text-neutral-500">No notes yet.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex items-start justify-between gap-3 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-sm"
            >
              <div className="min-w-0">
                <p className="break-words">{note.content}</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                  {formatDate(note.createdAt)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                className="shrink-0 text-neutral-400 hover:text-red-500 transition-colors text-xs"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
