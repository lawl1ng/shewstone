"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Section } from "@/lib/types";
import { SectionForm } from "@/components/SectionForm";

export default function EditSectionPage() {
  const { id, sectionId } = useParams<{ id: string; sectionId: string }>();
  const [section, setSection] = useState<Section | null>(null);

  useEffect(() => {
    fetch(`/api/songs/${id}`)
      .then((r) => r.json())
      .then((song) => {
        const found = song.sections?.find((s: Section) => s.id === sectionId);
        setSection(found ?? null);
      });
  }, [id, sectionId]);

  if (!section)
    return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit section</h1>
      <SectionForm songId={id} section={section} />
    </div>
  );
}
