import "dotenv/config";
import Database from "better-sqlite3";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "../dev.db");

const sqlite = new Database(dbPath);
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();

  const songs = sqlite.prepare("SELECT * FROM Song").all();
  const sections = sqlite.prepare("SELECT * FROM Section").all();
  const notes = sqlite.prepare("SELECT * FROM PracticeNote").all();

  console.log(`Migrating: ${songs.length} songs, ${sections.length} sections, ${notes.length} notes`);

  for (const s of songs) {
    await client.query(
      `INSERT INTO "Song" (id, title, bpm, key, status, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
      [s.id, s.title, s.bpm, s.key, s.status, new Date(s.createdAt), new Date(s.updatedAt)]
    );
  }

  for (const s of sections) {
    await client.query(
      `INSERT INTO "Section" (id, "songId", type, label, status, lyrics, chords, "bassTab", notes, "order", "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT (id) DO NOTHING`,
      [s.id, s.songId, s.type, s.label, s.status, s.lyrics, s.chords, s.bassTab, s.notes, s.order, new Date(s.createdAt), new Date(s.updatedAt)]
    );
  }

  for (const n of notes) {
    await client.query(
      `INSERT INTO "PracticeNote" (id, "songId", content, "createdAt")
       VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`,
      [n.id, n.songId, n.content, new Date(n.createdAt)]
    );
  }

  console.log("Done.");
  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
