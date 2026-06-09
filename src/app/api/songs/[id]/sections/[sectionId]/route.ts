import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recalcSongStatus } from "@/lib/songStatus";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const { id: songId, sectionId } = await params;
  const body = await request.json();

  const section = await prisma.section.update({
    where: { id: sectionId },
    data: {
      type: body.type,
      label: body.label ?? null,
      status: body.status,
      lyrics: body.lyrics ?? null,
      chords: body.chords ?? null,
      bassTab: body.bassTab ?? null,
      notes: body.notes ?? null,
    },
  });

  await recalcSongStatus(songId);
  return NextResponse.json(section);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const { id: songId, sectionId } = await params;
  await prisma.section.delete({ where: { id: sectionId } });
  await recalcSongStatus(songId);
  return new NextResponse(null, { status: 204 });
}
