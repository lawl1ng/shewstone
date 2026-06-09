"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Song, SongFormData } from "@/lib/types";

function parseDuration(str: string): number | null {
  const m = str.match(/^(\d+):([0-5]\d)$/);
  return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : null;
}

function fmtDuration(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
}

const defaultForm: SongFormData = {
  title: "",
  bpm: null,
  key: null,
  duration: null,
  referenceUrl: null,
  capo: null,
  tuning: null,
};

function toFormData(song: Song): SongFormData {
  return {
    title: song.title,
    bpm: song.bpm,
    key: song.key,
    duration: song.duration,
    referenceUrl: song.referenceUrl,
    capo: song.capo,
    tuning: song.tuning,
  };
}

export function SongForm({ song }: { song?: Song }) {
  const router = useRouter();
  const [form, setForm] = useState<SongFormData>(
    song ? toFormData(song) : defaultForm
  );
  const [durationStr, setDurationStr] = useState<string>(() =>
    song?.duration ? fmtDuration(song.duration) : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!song;

  function set<K extends keyof SongFormData>(key: K, value: SongFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleDurationChange(str: string) {
    setDurationStr(str);
    set("duration", parseDuration(str));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = isEdit ? `/api/songs/${song.id}` : "/api/songs";
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      title: form.title,
      bpm: form.bpm ? Number(form.bpm) : null,
      key: form.key || null,
      duration: form.duration,
      referenceUrl: form.referenceUrl || null,
      capo: form.capo ? Number(form.capo) : null,
      tuning: form.tuning || null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved: Song = await res.json();
        router.push(`/songs/${saved.id}`);
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
    if (!song) return;
    if (!confirm("Delete this song?")) return;
    await fetch(`/api/songs/${song.id}`, { method: "DELETE" });
    router.push("/");
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400";
  const labelClass =
    "block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Title *</label>
          <input
            required
            className={inputClass}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>BPM</label>
          <input
            type="number"
            min={1}
            max={300}
            className={inputClass}
            value={form.bpm ?? ""}
            onChange={(e) =>
              set("bpm", e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>

        <div>
          <label className={labelClass}>Key</label>
          <input
            className={inputClass}
            placeholder="e.g. A minor"
            value={form.key ?? ""}
            onChange={(e) => set("key", e.target.value || null)}
          />
        </div>

        <div>
          <label className={labelClass}>Capo (fret)</label>
          <input
            type="number"
            min={1}
            max={12}
            className={inputClass}
            placeholder="e.g. 2"
            value={form.capo ?? ""}
            onChange={(e) =>
              set("capo", e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>

        <div>
          <label className={labelClass}>Tuning</label>
          <input
            className={inputClass}
            placeholder="e.g. Standard, Drop D"
            value={form.tuning ?? ""}
            onChange={(e) => set("tuning", e.target.value || null)}
          />
        </div>

        <div>
          <label className={labelClass}>Duration (mm:ss)</label>
          <input
            className={inputClass}
            placeholder="e.g. 3:45"
            value={durationStr}
            onChange={(e) => handleDurationChange(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Reference link</label>
          <input
            type="url"
            className={inputClass}
            placeholder="YouTube, Spotify, SoundCloud…"
            value={form.referenceUrl ?? ""}
            onChange={(e) => set("referenceUrl", e.target.value || null)}
          />
        </div>
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
            Delete song
          </button>
        ) : (
          <span />
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg text-sm border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add song"}
          </button>
        </div>
      </div>
    </form>
  );
}
