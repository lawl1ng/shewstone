import type { SongStatus } from "@/lib/types";

const labels: Record<SongStatus, string> = {
  PERFORMANCE_READY: "Performance Ready",
  GETTING_THERE: "Getting There",
  NEEDS_WORK: "Needs Work",
};

const dotColors: Record<SongStatus, string> = {
  PERFORMANCE_READY: "bg-green-500",
  GETTING_THERE: "bg-amber-400",
  NEEDS_WORK: "bg-red-500",
};

const badgeStyles: Record<SongStatus, string> = {
  PERFORMANCE_READY:
    "bg-green-50 text-green-800 ring-1 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-800",
  GETTING_THERE:
    "bg-amber-50 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800",
  NEEDS_WORK:
    "bg-red-50 text-red-800 ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-800",
};

export function StatusBadge({ status }: { status: SongStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      {labels[status]}
    </span>
  );
}
