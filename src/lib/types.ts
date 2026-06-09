export type SongStatus = "PERFORMANCE_READY" | "GETTING_THERE" | "NEEDS_WORK";

export interface AudioFile {
  id: string;
  songId: string;
  name: string;
  url: string;
  createdAt: string;
}

export interface Song {
  id: string;
  title: string;
  bpm: number | null;
  key: string | null;
  duration: number | null;
  referenceUrl: string | null;
  capo: number | null;
  tuning: string | null;
  status: SongStatus;
  sections?: Section[];
  practiceNotes?: PracticeNote[];
  audioFiles?: AudioFile[];
  createdAt: string;
  updatedAt: string;
}

export type SongFormData = Omit<Song, "id" | "status" | "sections" | "practiceNotes" | "audioFiles" | "createdAt" | "updatedAt">;

export interface PracticeSession {
  id: string;
  date: string;
  attendees: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PracticeSessionFormData = Omit<PracticeSession, "id" | "createdAt" | "updatedAt">;

export interface PracticeNote {
  id: string;
  songId: string;
  content: string;
  createdAt: string;
}

export interface Setlist {
  id: string;
  title: string;
  date: string | null;
  songs?: SetlistSong[];
  createdAt: string;
  updatedAt: string;
}

export interface SetlistSong {
  id: string;
  setlistId: string;
  songId: string;
  song?: Song;
  order: number;
}

export type SetlistFormData = Pick<Setlist, "title" | "date">;

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
