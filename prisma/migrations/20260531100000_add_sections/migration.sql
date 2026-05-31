ALTER TABLE "Song" DROP COLUMN "artist";
ALTER TABLE "Song" DROP COLUMN "tuning";
ALTER TABLE "Song" DROP COLUMN "lyrics";
ALTER TABLE "Song" DROP COLUMN "chords";
ALTER TABLE "Song" DROP COLUMN "tabs";
ALTER TABLE "Song" DROP COLUMN "notes";

CREATE TABLE "Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "songId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEEDS_WORK',
    "lyrics" TEXT,
    "chords" TEXT,
    "bassTab" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Section_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
