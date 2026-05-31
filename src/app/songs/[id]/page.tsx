import { notFound } from "next/navigation";
import Link from "next/link";
import type { Song, Section } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { SectionTabs } from "@/components/SectionTabs";
import { SectionReorder } from "@/components/SectionReorder";

async function getSong(id: string): Promise<Song | null> {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`;

  const res = await fetch(`${base}/api/songs/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function SongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const song = await getSong(id);
  if (!song) notFound();

  const sections: Section[] = song.sections ?? [];

  return (
    <div>
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{song.title}</h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={song.status} />
          <Link
            href={`/songs/${song.id}/edit`}
            className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400 mb-8">
        {song.bpm && <span>{song.bpm} BPM</span>}
        {song.key && <span>Key: {song.key}</span>}
      </div>

      <div className="space-y-4">
        {sections.length === 0 && (
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            No sections yet.
          </p>
        )}
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-medium text-sm capitalize">
                  {section.type}
                  {section.label && (
                    <span className="text-neutral-500 dark:text-neutral-400 font-normal ml-1">
                      — {section.label}
                    </span>
                  )}
                </span>
                <StatusBadge status={section.status} />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <SectionReorder
                  songId={song.id}
                  sectionId={section.id}
                  isFirst={index === 0}
                  isLast={index === sections.length - 1}
                />
                <Link
                  href={`/songs/${song.id}/sections/${section.id}/edit`}
                  className="px-3 py-1 text-xs rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
            <div className="p-4">
              <SectionTabs section={section} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href={`/songs/${song.id}/sections/new`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600 text-sm text-neutral-600 dark:text-neutral-400 hover:border-neutral-500 dark:hover:border-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          + Add section
        </Link>
      </div>

      <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          ← Back to songs
        </Link>
      </div>
    </div>
  );
}
