"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Section, SectionFormData, SectionType, SongStatus } from "@/lib/types";
import { SECTION_TYPES } from "@/lib/types";

type Tab = "lyrics" | "chords" | "bassTab" | "notes";

const TABS: { key: Tab; label: string }[] = [
  { key: "lyrics", label: "Lyrics" },
  { key: "chords", label: "Chords" },
  { key: "bassTab", label: "Bass Tab" },
  { key: "notes", label: "Notes" },
];

const BASS_TAB_TEMPLATE = `G|------------------|\nD|------------------|\nA|------------------|\nE|------------------|`;

const defaultForm: SectionFormData = {
  type: "verse",
  label: null,
  status: "NEEDS_WORK",
  lyrics: null,
  chords: null,
  bassTab: BASS_TAB_TEMPLATE,
  notes: null,
  order: 0,
};

function toFormData(section: Section): SectionFormData {
  return {
    type: section.type,
    label: section.label,
    status: section.status,
    lyrics: section.lyrics,
    chords: section.chords,
    bassTab: section.bassTab ?? BASS_TAB_TEMPLATE,
    notes: section.notes,
    order: section.order,
  };
}

export function SectionForm({
  songId,
  section,
}: {
  songId: string;
  section?: Section;
}) {
  const router = useRouter();
  const [form, setForm] = useState<SectionFormData>(
    section ? toFormData(section) : defaultForm
  );
  const [activeTab, setActiveTab] = useState<Tab>("lyrics");
  const [saving, setSaving] = useState(false);

  const isEdit = !!section;

  function set<K extends keyof SectionFormData>(
    key: K,
    value: SectionFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const url = isEdit
      ? `/api/songs/${songId}/sections/${section.id}`
      : `/api/songs/${songId}/sections`;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push(`/songs/${songId}`);
    } else {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!section) return;
    if (!confirm("Delete this section?")) return;
    await fetch(`/api/songs/${songId}/sections/${section.id}`, {
      method: "DELETE",
    });
    router.push(`/songs/${songId}`);
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400";
  const labelClass =
    "block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Section type *</label>
          <select
            required
            className={inputClass}
            value={form.type}
            onChange={(e) => set("type", e.target.value as SectionType)}
          >
            {SECTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Custom label</label>
          <input
            className={inputClass}
            placeholder="e.g. Verse 2"
            value={form.label ?? ""}
            onChange={(e) => set("label", e.target.value || null)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Status</label>
        <div className="flex flex-wrap gap-3">
          {(
            [
              "NEEDS_WORK",
              "GETTING_THERE",
              "PERFORMANCE_READY",
            ] as SongStatus[]
          ).map((s) => (
            <label
              key={s}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm transition-colors select-none ${
                form.status === s
                  ? "border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 font-medium"
                  : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500"
              }`}
            >
              <input
                type="radio"
                name="status"
                value={s}
                checked={form.status === s}
                onChange={() => set("status", s)}
                className="sr-only"
              />
              <span
                className={`w-2 h-2 rounded-full ${
                  {
                    NEEDS_WORK: "bg-red-500",
                    GETTING_THERE: "bg-amber-400",
                    PERFORMANCE_READY: "bg-green-500",
                  }[s]
                }`}
              />
              {
                {
                  NEEDS_WORK: "Needs Work",
                  GETTING_THERE: "Getting There",
                  PERFORMANCE_READY: "Performance Ready",
                }[s]
              }
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex gap-1 mb-3">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === key
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {activeTab === "bassTab" ? (
          <textarea
            rows={6}
            wrap="off"
            className={`${inputClass} font-mono overflow-x-auto`}
            style={{ whiteSpace: "pre", resize: "vertical" }}
            value={form.bassTab ?? ""}
            onChange={(e) => set("bassTab", e.target.value || null)}
          />
        ) : (
          <textarea
            rows={10}
            className={`${inputClass} font-mono`}
            value={form[activeTab] ?? ""}
            onChange={(e) => set(activeTab, e.target.value || null)}
            placeholder={`Enter ${TABS.find((t) => t.key === activeTab)?.label.toLowerCase()}…`}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        {isEdit ? (
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Delete section
          </button>
        ) : (
          <span />
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push(`/songs/${songId}`)}
            className="px-4 py-2 rounded-lg text-sm border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add section"}
          </button>
        </div>
      </div>
    </form>
  );
}
