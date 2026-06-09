import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recalcSongStatus } from "@/lib/songStatus";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: songId } = await params;
  const body = await request.json();

  const last = await prisma.section.findFirst({
    where: { songId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const order = last ? last.order + 1 : 0;

  const section = await prisma.section.create({
    data: {
      songId,
      type: body.type,
      label: body.label ?? null,
      status: body.status ?? "NEEDS_WORK",
      lyrics: body.lyrics ?? null,
      chords: body.chords ?? null,
      bassTab: body.bassTab ?? null,
      notes: body.notes ?? null,
      order,
    },
  });

  await recalcSongStatus(songId);
  return NextResponse.json(section, { status: 201 });
}
