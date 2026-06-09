import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const setlist = await prisma.setlist.findUnique({
    where: { id },
    include: {
      songs: {
        orderBy: { order: "asc" },
        include: { song: true },
      },
    },
  });

  if (!setlist) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(setlist);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const setlist = await prisma.setlist.update({
    where: { id },
    data: {
      title: body.title.trim(),
      date: body.date ? new Date(body.date) : null,
    },
  });

  return NextResponse.json(setlist);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.setlist.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
