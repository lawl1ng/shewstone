import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        sections: { orderBy: { order: "asc" } },
        practiceNotes: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!song) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(song);
  } catch (err) {
    console.error("GET /api/songs/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const song = await prisma.song.update({
      where: { id },
      data: {
        title: body.title,
        bpm: body.bpm ?? null,
        key: body.key ?? null,
        duration: body.duration ?? null,
        referenceUrl: body.referenceUrl ?? null,
        capo: body.capo ?? null,
        tuning: body.tuning ?? null,
      },
    });

    return NextResponse.json(song);
  } catch (err) {
    console.error("PUT /api/songs/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const song = await prisma.song.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(song);
  } catch (err) {
    console.error("PATCH /api/songs/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.song.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/songs/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
