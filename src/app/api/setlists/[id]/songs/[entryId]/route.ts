import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  const { entryId } = await params;
  await prisma.setlistSong.delete({ where: { id: entryId } });
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  const { id: setlistId, entryId } = await params;
  const { direction } = (await request.json()) as { direction: "up" | "down" };

  const current = await prisma.setlistSong.findUnique({ where: { id: entryId } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const neighbour = await prisma.setlistSong.findFirst({
    where: {
      setlistId,
      order: direction === "up" ? { lt: current.order } : { gt: current.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });

  if (!neighbour) return NextResponse.json({ error: "Cannot move" }, { status: 400 });

  await prisma.$transaction([
    prisma.setlistSong.update({ where: { id: current.id }, data: { order: neighbour.order } }),
    prisma.setlistSong.update({ where: { id: neighbour.id }, data: { order: current.order } }),
  ]);

  return new NextResponse(null, { status: 204 });
}
