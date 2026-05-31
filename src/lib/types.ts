export type SongStatus = "PERFORMANCE_READY" | "GETTING_THERE" | "NEEDS_WORK";

export interface Song {
  id: string;
  title: string;
  bpm: number | null;
  key: string | null;
  status: SongStatus;
  sections?: Section[];
  createdAt: string;
  updatedAt: string;
}

export type SongFormData = Omit<Song, "id" | "sections" | "createdAt" | "updatedAt">;

export const SECTION_TYPES = [
  "intro",
  "verse",
  "pre-chorus",
  "chorus",
  "bridge",
  "solo",
  "interlude",
  "breakdown",
  "hook",
  "outro",
  "other",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export interface Section {
  id: string;
  songId: string;
  type: SectionType;
  label: string | null;
  status: SongStatus;
  lyrics: string | null;
  chords: string | null;
  bassTab: string | null;
  notes: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type SectionFormData = Omit<Section, "id" | "songId" | "createdAt" | "updatedAt">;
