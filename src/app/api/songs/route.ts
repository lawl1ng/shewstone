import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@/generated/prisma/enums";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as Status | null;
    const search = searchParams.get("search") ?? "";
    const sort = searchParams.get("sort") ?? "recent";

    const orderBy =
      sort === "title"
        ? { title: "asc" as const }
        : sort === "readiness"
        ? { status: "asc" as const }
        : { updatedAt: "desc" as const };

    const songs = await prisma.song.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(search ? { title: { contains: search } } : {}),
      },
      orderBy,
    });

    return NextResponse.json(songs);
  } catch (err) {
    console.error("GET /api/songs error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const song = await prisma.song.create({
      data: {
        title: body.title,
        bpm: body.bpm ?? null,
        key: body.key ?? null,
        duration: body.duration ?? null,
        referenceUrl: body.referenceUrl ?? null,
        capo: body.capo ?? null,
        tuning: body.tuning ?? null,
        status: body.status ?? "NEEDS_WORK",
      },
    });

    return NextResponse.json(song, { status: 201 });
  } catch (err) {
    console.error("POST /api/songs error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
