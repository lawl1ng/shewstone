"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PracticeSession, PracticeSessionFormData } from "@/lib/types";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const defaultForm: PracticeSessionFormData = {
  date: todayISO(),
  attendees: null,
  notes: null,
};

function toFormData(s: PracticeSession): PracticeSessionFormData {
  return {
    date: s.date.slice(0, 10),
    attendees: s.attendees,
    notes: s.notes,
  };
}

export function SessionForm({ session }: { session?: PracticeSession }) {
  const router = useRouter();
  const [form, setForm] = useState<PracticeSessionFormData>(
    session ? toFormData(session) : defaultForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!session;

  function set<K extends keyof PracticeSessionFormData>(
    key: K,
    value: PracticeSessionFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = isEdit ? `/api/sessions/${session.id}` : "/api/sessions";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/sessions");
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Server error (${res.status})`);
        setSaving(false);
      }
    } catch {
      setError("Network error — could not reach server");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!session) return;
    if (!confirm("Delete this session?")) return;
    await fetch(`/api/sessions/${session.id}`, { method: "DELETE" });
    router.push("/sessions");
    router.refresh();
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400";
  const labelClass =
    "block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Date *</label>
          <input
            required
            type="date"
            className={inputClass}
            value={form.date ?? ""}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Attendees</label>
          <input
            className={inputClass}
            placeholder="e.g. Cillian, Dave, Sarah"
            value={form.attendees ?? ""}
            onChange={(e) => set("attendees", e.target.value || null)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          rows={6}
          className={inputClass}
          placeholder="How did it go? What did you work on?"
          value={form.notes ?? ""}
          onChange={(e) => set("notes", e.target.value || null)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        {isEdit ? (
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Delete session
          </button>
        ) : (
          <span />
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/sessions")}
            className="px-4 py-2 rounded-lg text-sm border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Log session"}
          </button>
        </div>
      </div>
    </form>
  );
}
