-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "capo" INTEGER,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "referenceUrl" TEXT,
ADD COLUMN     "tuning" TEXT;

-- CreateTable
CREATE TABLE "PracticeSession" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "attendees" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeSession_pkey" PRIMARY KEY ("id")
);
