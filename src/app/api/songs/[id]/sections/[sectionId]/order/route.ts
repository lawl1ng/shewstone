import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const { id: songId, sectionId } = await params;
  const { direction } = await request.json() as { direction: "up" | "down" };

  const current = await prisma.section.findUnique({ where: { id: sectionId } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const neighbour = await prisma.section.findFirst({
    where: {
      songId,
      order: direction === "up" ? { lt: current.order } : { gt: current.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });

  if (!neighbour) return NextResponse.json({ error: "Cannot move" }, { status: 400 });

  await prisma.$transaction([
    prisma.section.update({ where: { id: current.id }, data: { order: neighbour.order } }),
    prisma.section.update({ where: { id: neighbour.id }, data: { order: current.order } }),
  ]);

  return new NextResponse(null, { status: 204 });
}
