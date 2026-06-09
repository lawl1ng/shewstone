import { prisma } from "./prisma";
import type { Status } from "@/generated/prisma/enums";

export async function recalcSongStatus(songId: string) {
  const sections = await prisma.section.findMany({
    where: { songId },
    select: { status: true },
  });

  let status: Status;
  if (sections.length === 0) {
    status = "NEEDS_WORK";
  } else if (sections.every((s) => s.status === "PERFORMANCE_READY")) {
    status = "PERFORMANCE_READY";
  } else if (sections.every((s) => s.status !== "NEEDS_WORK")) {
    status = "GETTING_THERE";
  } else {
    status = "NEEDS_WORK";
  }

  await prisma.song.update({ where: { id: songId }, data: { status } });
}
