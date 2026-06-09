import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: setlistId } = await params;
  const { songId } = await request.json();

  const last = await prisma.setlistSong.findFirst({
    where: { setlistId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const entry = await prisma.setlistSong.create({
    data: { setlistId, songId, order: last ? last.order + 1 : 0 },
    include: { song: true },
  });

  return NextResponse.json(entry, { status: 201 });
}
