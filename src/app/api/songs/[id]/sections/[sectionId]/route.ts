import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const { sectionId } = await params;
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

  return NextResponse.json(section);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const { sectionId } = await params;
  await prisma.section.delete({ where: { id: sectionId } });
  return new NextResponse(null, { status: 204 });
}
