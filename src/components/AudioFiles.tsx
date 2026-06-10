"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { AudioFile } from "@/lib/types";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AudioFiles({
  songId,
  initialFiles,
}: {
  songId: string;
  initialFiles: AudioFile[];
}) {
  const [files, setFiles] = useState<AudioFile[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const existing = files.find((f) => f.name === file.name);
    if (existing && !confirm(`A file named "${file.name}" already exists. Replace it?`)) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: `/api/songs/${songId}/audio`,
        multipart: true,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });

      await fetch(`/api/songs/${songId}/audio/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: blob.url, pathname: blob.pathname, replaceId: existing?.id }),
      });

      const updated: AudioFile[] = await fetch(`/api/songs/${songId}/audio`).then((r) => r.json());
      setFiles(updated);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      if (msg.includes("client token") || msg.includes("presigned")) {
        setError("Upload not configured — check BLOB_READ_WRITE_TOKEN in Vercel project settings");
      } else {
        setError(msg);
      }
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(fileId: string) {
    await fetch(`/api/songs/${songId}/audio/${fileId}`, { method: "DELETE" });
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold">Audio</h2>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium hover:opacity-80 disabled:opacity-40 transition-opacity"
        >
          {uploading ? `Uploading ${progress}%` : "+ Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/x-m4a,.mp3,.wav,.ogg,.m4a"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {uploading && (
        <div className="mb-3 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
          <div
            className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mb-3">{error}</p>
      )}

      {files.length === 0 ? (
        <p className="text-sm text-neutral-400 dark:text-neutral-500">No audio files yet.</p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => (
            <li key={file.id} className="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-3 py-2 bg-neutral-50 dark:bg-neutral-900">
                <span className="text-xs font-medium truncate">{file.name}</span>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="shrink-0 text-neutral-400 hover:text-red-500 transition-colors text-xs"
                >
                  Delete
                </button>
              </div>
              <audio controls src={file.url} className="w-full h-10" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
